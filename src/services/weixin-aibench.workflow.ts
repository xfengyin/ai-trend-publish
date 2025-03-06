import { Workflow } from "./interfaces/workflow.interface";
import { LiveBenchAPI } from "../api/livebench.api";
import { ConfigManager } from "../utils/config/config-manager";
import { BarkNotifier } from "../utils/bark.notify";
import path from "path";
import { AIBenchRenderer } from "@src/modules/render/ai-bench.renderer";
import { WeixinPublisher } from "@src/modules/publishers/weixin.publisher";

export class WeixinAIBenchWorkflow implements Workflow {
  private liveBenchAPI: LiveBenchAPI;
  private renderer: AIBenchRenderer;
  private notify: BarkNotifier;
  private publisher: WeixinPublisher;

  constructor() {
    this.liveBenchAPI = new LiveBenchAPI();
    this.renderer = new AIBenchRenderer();
    this.notify = new BarkNotifier();
    this.publisher = new WeixinPublisher();
  }

  async refresh(): Promise<void> {
    await this.notify.refresh();
    await this.liveBenchAPI.refresh();
    await this.publisher.refresh();
  }

  async process(): Promise<void> {
    try {
      // 获取所有模型的性能数据
      const modelData = await this.liveBenchAPI.getModelPerformance();

      // 处理数据，清理模型名称中的多余空格
      const cleanedModelData: typeof modelData = Object.entries(
        modelData
      ).reduce((acc, [key, value]) => {
        acc[key.trim()] = {
          ...value,
          organization: value.organization?.trim(),
        };
        return acc;
      }, {} as typeof modelData);

      // 使用 AIBenchRenderer 处理数据
      const templateData = AIBenchRenderer.render(cleanedModelData);

      // 渲染并保存文件
      const outputPath = path.join(
        "output",
        `aibench-${new Date().toISOString().split("T")[0]}.html`
      );
      await this.renderer.renderToFile(templateData, outputPath);

      // 发布到微信公众号
      const title = `${new Date().toLocaleDateString()} AI模型性能榜单`;
      const mediaId =
        "SwCSRjrdGJNaWioRQUHzgF8cSi0Wuf1M6duNPIMX9ennpaMqttRXYwwXnZjmi6QI";

      // 使用微信专用模板渲染内容
      const htmlContent = this.renderer.renderForWeixin(templateData);

      const publishResult = await this.publisher.publish(
        htmlContent,
        title,
        title,
        mediaId
      );

      // 发送通知
      await this.notify.info(
        "AI Benchmark更新",
        `已生成并发布最新的AI模型性能榜单\n发布状态: ${publishResult.status}`
      );
    } catch (error) {
      console.error("Error processing WeixinAIBenchWorkflow:", error);
      await this.notify.error(
        "AI Benchmark更新失败",
        `错误: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }
}
