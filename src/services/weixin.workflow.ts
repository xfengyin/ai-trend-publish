import {
  ContentScraper,
  ScrapedContent,
} from "../scrapers/interfaces/scraper.interface";
import { ContentSummarizer } from "../summarizer/interfaces/summarizer.interface";
import { ContentPublisher } from "../publishers/interfaces/publisher.interface";
import { WeixinPublisher } from "../publishers/weixin.publisher";
import { DeepseekAISummarizer } from "../summarizer/deepseek-ai.summarizer";
import { BarkNotifier } from "../utils/bark.notify";
import dotenv from "dotenv";
import { TwitterScraper } from "../scrapers/twitter.scraper";
import { FireCrawlScraper } from "../scrapers/fireCrawl.scraper";
import { sourceConfigs } from "../data-sources/getCronSources";
import { WeixinTemplateRenderer } from "../templates/weixin/renderer";
import { WeixinTemplate } from "../templates/interfaces/template.interface";
import cliProgress from "cli-progress";

dotenv.config();

export class WeixinWorkflow {
  private scraper: Map<string, ContentScraper>;
  private summarizer: ContentSummarizer;
  private publisher: ContentPublisher;
  private notifier: BarkNotifier;
  private renderer: WeixinTemplateRenderer;
  private stats = {
    success: 0,
    failed: 0,
    contents: 0,
  };

  constructor() {
    this.scraper = new Map<string, ContentScraper>();
    this.scraper.set("fireCrawl", new FireCrawlScraper());
    this.scraper.set("twitter", new TwitterScraper());
    this.summarizer = new DeepseekAISummarizer();
    this.publisher = new WeixinPublisher();
    this.notifier = new BarkNotifier();
    this.renderer = new WeixinTemplateRenderer();
  }

  private async scrapeSource(
    type: string,
    source: { identifier: string },
    scraper: ContentScraper
  ): Promise<ScrapedContent[]> {
    try {
      console.log(`[${type}] 抓取: ${source.identifier}`);
      const contents = await scraper.scrape(source.identifier);
      this.stats.success++;
      return contents;
    } catch (error) {
      this.stats.failed++;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${type}] ${source.identifier} 抓取失败:`, message);
      await this.notifier.warning(
        `${type}抓取失败`,
        `源: ${source.identifier}\n错误: ${message}`
      );
      return [];
    }
  }

  private async processContent(content: ScrapedContent): Promise<void> {
    try {
      const summary = await this.summarizer.summarize(JSON.stringify(content));
      content.title = summary.title;
      content.content = summary.content;
      content.metadata.keywords = summary.keywords;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[内容处理] ${content.id} 处理失败:`, message);
      await this.notifier.warning(
        "内容处理失败",
        `ID: ${content.id}\n保留原始内容`
      );
      content.title = content.title || "无标题";
      content.content = content.content || "内容处理失败";
      content.metadata.keywords = content.metadata.keywords || [];
    }
  }

  async process(): Promise<void> {
    try {
      console.log("=== 开始执行微信工作流 ===");
      await this.notifier.info("工作流开始", "开始执行内容抓取和处理");

      // 1. 获取数据源
      const sourceIds = sourceConfigs.AI;
      const totalSources =
        sourceIds.firecrawl.length + sourceIds.twitter.length;
      console.log(`[数据源] 发现 ${totalSources} 个数据源`);

      const progress = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      progress.start(totalSources, 0);
      let currentProgress = 0;

      // 2. 抓取内容
      const allContents: ScrapedContent[] = [];

      // FireCrawl sources
      const fireCrawlScraper = this.scraper.get("fireCrawl");
      if (!fireCrawlScraper) throw new Error("FireCrawlScraper not found");

      for (const source of sourceIds.firecrawl) {
        const contents = await this.scrapeSource(
          "FireCrawl",
          source,
          fireCrawlScraper
        );
        allContents.push(...contents);
        progress.update(++currentProgress);
      }

      // Twitter sources
      const twitterScraper = this.scraper.get("twitter");
      if (!twitterScraper) throw new Error("TwitterScraper not found");

      for (const source of sourceIds.twitter) {
        const contents = await this.scrapeSource(
          "Twitter",
          source,
          twitterScraper
        );
        allContents.push(...contents);
        progress.update(++currentProgress);
      }
      progress.stop();

      this.stats.contents = allContents.length;
      if (this.stats.contents === 0) {
        const message = "未获取到任何内容";
        console.error(`[工作流] ${message}`);
        await this.notifier.error("工作流终止", message);
        return;
      }

      // 3. 内容处理
      console.log(`\n[内容处理] 处理 ${allContents.length} 条内容`);
      const summaryProgress = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );
      summaryProgress.start(allContents.length, 0);

      for (let i = 0; i < allContents.length; i++) {
        await this.processContent(allContents[i]);
        summaryProgress.update(i + 1);
      }
      summaryProgress.stop();

      // 4. 生成并发布
      console.log("\n[模板生成] 生成微信文章");
      const templateData: WeixinTemplate[] = allContents.map((content) => ({
        id: content.id,
        title: content.title,
        content: content.content,
        url: content.url,
        publishDate: content.publishDate,
        metadata: content.metadata,
        keywords: content.metadata.keywords,
      }));

      const renderedTemplate = this.renderer.render(templateData);
      console.log("[发布] 发布到微信公众号");
      const publishResult = await this.publisher.publish(
        renderedTemplate,
        `今日AI热点 - ${new Date().toLocaleDateString()}`,
        "今日AI热点"
      );

      // 5. 完成报告
      const summary = `
        工作流执行完成
        - 数据源: ${totalSources} 个
        - 成功: ${this.stats.success} 个
        - 失败: ${this.stats.failed} 个
        - 内容: ${this.stats.contents} 条
        - 发布: ${publishResult.status}`.trim();

      console.log(`=== ${summary} ===`);

      if (this.stats.failed > 0) {
        await this.notifier.warning("工作流完成(部分失败)", summary);
      } else {
        await this.notifier.success("工作流完成", summary);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[工作流] 执行失败:", message);
      await this.notifier.error("工作流失败", message);
      throw error;
    }
  }
}
