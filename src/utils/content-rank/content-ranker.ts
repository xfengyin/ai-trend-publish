import { OpenAI } from "openai";
import { ScrapedContent } from "../../scrapers/interfaces/scraper.interface";
import { ConfigManager } from "../config/config-manager";

export interface RankResult {
  id: string;
  score: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const MODEL_NAME = "deepseek-reason";

export class ContentRanker {
  private client!: OpenAI;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.validateConfig();
    this.client = new OpenAI({
      apiKey: await ConfigManager.getInstance().get("DEEPSEEK_API_KEY"),
      baseURL: "https://api.deepseek.com",
    });
  }

  private async validateConfig(): Promise<void> {
    if (!(await ConfigManager.getInstance().get("DEEPSEEK_API_KEY"))) {
      throw new Error("DeepSeek API key is required");
    }
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt));
        console.error(`Retry attempt ${attempt} failed:`, error);
      }
    }
    throw new Error("Operation failed after max retries");
  }

  private getSystemPrompt(): string {
    return `你是一个专业的科技内容评估专家，特别专注于AI和前沿科技领域。你的任务是评估文章的重要性、创新性和技术价值。

            评分标准（总分100分）：

            1. 技术创新与前沿性 (35分)
            - 技术的创新程度和突破性
            - 是否涉及最新的技术发展和研究进展
            - 技术方案的可行性和实用价值
            - AI/科技领域的前沿趋势相关度

            2. 技术深度与专业性 (25分)
            - 技术原理的解释深度
            - 技术实现细节的完整性
            - 专业术语使用的准确性
            - 技术方案的可实施性

            3. 行业影响力 (20分)
            - 对AI/科技行业的潜在影响
            - 商业价值和市场潜力
            - 技术应用场景的广泛性
            - 解决实际问题的效果

            4. 时效性与竞争格局 (20分)
            - 内容的时效性和新闻价值
            - 与竞品/竞争技术的对比分析
            - 技术发展趋势的预测
            - 市场竞争态势的分析

            请仔细阅读文章，并按照以下格式返回评分结果：
            文章ID: 分数
            文章ID: 分数
            ...

            注意事项：
            1. 分数范围为0-100，精确到小数点后一位
            2. 每篇文章占一行
            3. 只返回ID和分数，不要有其他文字说明
            4. 分数要有区分度，避免所有文章分数过于接近
            5. 重点关注技术创新性和行业影响力
            6. 对于纯市场新闻类文章，技术创新分数应相对较低
            7. 对于深度技术文章，应在技术深度上给予更高权重`;
  }

  private getUserPrompt(contents: ScrapedContent[]): string {
    return contents.map(content => (
      `文章ID: ${content.id}\n` +
      `标题: ${content.title}\n` +
      `发布时间: ${content.publishDate}\n` +
      `内容:\n${content.content}\n` +
      `---\n`
    )).join('\n');
  }

  private parseRankingResult(result: string): RankResult[] {
    const lines = result.trim().split('\n');
    return lines.map(line => {
      const [id, scoreStr] = line.split(':').map(s => s.trim());
      const score = parseFloat(scoreStr);
      
      if (isNaN(score)) {
        throw new Error(`Invalid score format for line: ${line}`);
      }

      return { id, score };
    });
  }

  public async rankContents(contents: ScrapedContent[]): Promise<RankResult[]> {
    if (!contents.length) {
      return [];
    }

    return this.retryOperation(async () => {
      const response = await this.client.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(),
          },
          {
            role: "user",
            content: this.getUserPrompt(contents),
          },
        ],
        temperature: 0.3, // 使用较低的温度以获得更一致的评分
        max_tokens: 500,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("未获取到有效的评分结果");
      }

      try {
        return this.parseRankingResult(result);
      } catch (error) {
        throw new Error(
          `解析评分结果失败: ${
            error instanceof Error ? error.message : "未知错误"
          }`
        );
      }
    });
  }

  public async rankContentsBatch(
    contents: ScrapedContent[],
    batchSize: number = 5
  ): Promise<RankResult[]> {
    const results: RankResult[] = [];
    
    for (let i = 0; i < contents.length; i += batchSize) {
      const batch = contents.slice(i, i + batchSize);
      const batchResults = await this.rankContents(batch);
      results.push(...batchResults);
      
      // 添加延迟以避免API限制
      if (i + batchSize < contents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
} 