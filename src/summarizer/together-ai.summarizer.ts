import Together from "together-ai";
import { ContentSummarizer, Summary } from "./interfaces/summarizer.interface";

export class TogetherAISummarizer implements ContentSummarizer {
  private together: Together;

  constructor() {
    this.validateConfig();
    this.together = new Together();
  }

  validateConfig(): void {
    if (!process.env.TOGETHER_API_KEY) {
      throw new Error("TOGETHER_API_KEY is not set");
    }
  }

  async summarize(
    content: string,
    options?: Record<string, any>
  ): Promise<Summary> {
    try {
      const completion = await this.together.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: `你是一个专业的内容创作者和摘要生成器。你的任务是：
            1. 理解原始内容的核心观点和背景
            2. 基于原始内容进行扩充，补充相关的背景信息、技术细节或实际应用场景
            3. 确保扩充后的内容准确、专业，并保持行文流畅
            4. 生成一个引人入胜的标题和3-5个关键词
            
            请只返回JSON格式数据，格式如下：
            {
              "title": "引人注目且专业的标题",
              "content": "扩充和完善后的内容",
              "keywords": ["关键词1", "关键词2", "关键词3"]
            }`,
          },
          {
            role: "user",
            content: `请分析以下内容，在保持原意的基础上进行专业的扩充和完善，使用${
              options?.language || "中文"
            }，完善后的内容不少于${options?.minLength || 300}字，不超过${
              options?.maxLength || 800
            }字：\n\n${content}\n\n要求：
            1. 保持专业性，可以补充相关的技术细节、应用场景或行业背景
            2. 注意内容的连贯性和可读性
            3. 如果原文涉及技术点，可以补充相关的技术原理或最新进展
            4. 如果原文是新闻，可以补充相关的行业影响或未来趋势
            5. 确保扩充的内容真实可靠，避免主观臆测`,
          },
        ],
        response_format: {
          type: "json_object",
          schema: {
            title: "string",
            content: "string",
            keywords: "array",
          },
        },
      });

      const rawJSON = completion?.choices?.[0]?.message?.content;
      if (!rawJSON) {
        throw new Error("未获取到有效的摘要结果");
      }

      const summary = JSON.parse(rawJSON) as Summary;

      // 验证必要字段
      if (
        !summary.title ||
        !summary.content ||
        !Array.isArray(summary.keywords)
      ) {
        throw new Error("摘要结果格式不正确");
      }

      return summary;
    } catch (error) {
      console.error("生成摘要时出错:", error);
      throw error;
    }
  }

  async generateTitle(
    content: string,
    options?: Record<string, any>
  ): Promise<string> {
    return "test";
  }
}
