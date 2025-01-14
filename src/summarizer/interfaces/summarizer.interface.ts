export interface ContentSummarizer {
  // 验证配置是否完善
  validateConfig(): void;

  // 对内容进行摘要
  summarize(content: string, options?: Record<string, any>): Promise<Summary>;

  // 生成标题
  generateTitle(
    content: string,
    options?: Record<string, any>
  ): Promise<string>;
}

export interface Summary {
  title: string;
  content: string;
  keywords: string[];
}
