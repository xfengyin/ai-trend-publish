export interface GeneratedTemplate {
  id: string;
  title: string;
  content: string;
  url: string;
  publishDate: Date;
  metadata: Record<string, any>;
}

export interface WeixinTemplate extends GeneratedTemplate {
  keywords: string[];
}
