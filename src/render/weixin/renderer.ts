import fs from "fs";
import path from "path";
import ejs from "ejs";
import { WeixinTemplate } from "../interfaces/template.interface";

export class WeixinTemplateRenderer {
  private templates: { [key: string]: string } = {};

  constructor() {
    // 读取模板文件
    const templatePath = path.join(__dirname, "../../templates/article.ejs");
    const modernTemplatePath = path.join(__dirname, "../../templates/article.modern.ejs");
    const techTemplatePath = path.join(__dirname, "../../templates/article.tech.ejs");
    const mianproTemplatePath = path.join(__dirname, "../../templates/article.mianpro.ejs");

    this.templates = {
      default: fs.readFileSync(templatePath, "utf-8"),
      modern: fs.readFileSync(modernTemplatePath, "utf-8"),
      tech: fs.readFileSync(techTemplatePath, "utf-8"),
      mianpro: fs.readFileSync(mianproTemplatePath, "utf-8"),
    };
  }

  /**
   * 渲染微信文章模板
   * @param articles 微信文章模板数组
   * @param templateType 模板类型：'default' 或 'modern'
   * @returns 渲染后的 HTML
   */
  render(articles: WeixinTemplate[], templateType: 'default' | 'modern' | 'tech' | 'mianpro' = 'mianpro'): string {
    try {
      const template = this.templates[templateType];
      if (!template) {
        throw new Error(`Template type '${templateType}' not found`);
      }

      // 使用 EJS 渲染模板
      return ejs.render(
        template,
        { articles },
        {
          rmWhitespace: true,
        }
      );
    } catch (error) {
      console.error("模板渲染失败:", error);
      throw error;
    }
  }
}
