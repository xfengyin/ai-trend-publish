import { OpenAI } from "openai";
import { ContentSummarizer, Summary } from "./interfaces/summarizer.interface";

export class DeepseekAISummarizer implements ContentSummarizer {
  private client: OpenAI;
  private readonly model: string = "deepseek-chat";

  constructor() {
    this.validateConfig();
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }

  validateConfig(): void {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error("DeepSeek API key is required");
    }
  }

  async summarize(
    content: string,
    options?: Record<string, any>
  ): Promise<Summary> {
    if (!content) {
      throw new Error("Content is required for summarization");
    }

    try {
      const systemPrompt = `你是一个专业的内容创作者和摘要生成器。你的任务是：
        1. 理解原始内容的核心观点和背景
        2. 基于原始内容进行扩充，补充相关的背景信息、技术细节或实际应用场景
        3. 确保扩充后的内容准确、专业，并保持行文流畅
        4. 生成一个引人入胜的标题和3-5个关键词

        请只返回JSON格式数据，格式如下：
        {
            "title": "引人注目且专业的标题",
            "content": "扩充和完善后的内容",
            "keywords": ["关键词1", "关键词2", "关键词3"]
        }`;

      const userPrompt = `请分析以下内容，在保持原意的基础上进行专业的扩充和完善，使用${
        options?.language || "中文"
      }，完善后的内容不少于${options?.minLength || 200}字，不超过${
        options?.maxLength || 300
      }字：\n\n${content}\n\n要求：
        1. 保持专业性，可以补充相关的技术细节、应用场景或行业背景
        2. 注意内容的连贯性和可读性
        3. 如果原文涉及技术点，可以补充相关的技术原理或最新进展
        4. 如果原文是新闻，可以补充相关的行业影响或未来趋势
        5. 确保扩充的内容真实可靠，避免主观臆测
        6. 关键字的长度不超过4个字
        `;

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_object",
        },
      });

      const completion = response.choices[0]?.message?.content;
      if (!completion) {
        throw new Error("未获取到有效的摘要结果");
      }

      try {
        const summary = JSON.parse(completion) as Summary;

        // 验证必要字段
        if (
          !summary.title ||
          !summary.content ||
          !Array.isArray(summary.keywords)
        ) {
          throw new Error("摘要结果格式不正确");
        }

        return summary;
      } catch (parseError) {
        throw new Error("解析摘要结果失败");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DeepSeek AI API 错误: ${error.message}`);
      }
      throw error;
    }
  }
}
