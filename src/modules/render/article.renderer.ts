import path from "path";
import fs from "fs";
import { BaseTemplateRenderer } from "./base.renderer";
import { WeixinTemplate } from "./interfaces/article.type";

/**
 * 文章模板渲染器
 */
export class WeixinArticleTemplateRenderer extends BaseTemplateRenderer<WeixinTemplate[]> {
    constructor() {
        super('article');
        this.availableTemplates = ['default', 'modern', 'tech', 'mianpro'];
    }

    /**
     * 预处理文章内容，将图片插入到段落之间
     * @param article 文章数据
     * @returns 处理后的文章数据
     */
    private processArticleContent(article: WeixinTemplate): WeixinTemplate {
        if (!article.media || article.media.length === 0) {
            return article;
        }

        // 分割段落
        const paragraphs = article.content.split('<next_paragraph />');
        const mediaUrls = article.media.map(m => m.url);
        let mediaIndex = 0;

        // 在段落之间插入图片
        let processedContent = '';

        // 第一张图片放在文章开头
        if (mediaUrls.length > 0) {
            processedContent += `<img src="${mediaUrls[0]}" alt="文章配图" /><next_paragraph />`;
            mediaIndex++;
        }

        // 遍历段落，在段落之间插入图片
        paragraphs.forEach((paragraph, index) => {
            processedContent += paragraph;

            // 如果还有图片，且不是最后一个段落，在段落后插入图片
            if (mediaIndex < mediaUrls.length && index < paragraphs.length - 1) {
                processedContent += `<next_paragraph /><img src="${mediaUrls[mediaIndex]}" alt="文章配图" />`;
                mediaIndex++;
            }

            // 如果不是最后一个段落，添加段落分隔符
            if (index < paragraphs.length - 1) {
                processedContent += '<next_paragraph />';
            }
        });

        return {
            ...article,
            content: processedContent
        };
    }

    /**
     * 加载文章模板文件
     */
    protected loadTemplates(): void {
        this.templates = {
            default: fs.readFileSync(path.join(__dirname, "../../templates/article/article.ejs"), "utf-8"),
            modern: fs.readFileSync(path.join(__dirname, "../../templates/article/article.modern.ejs"), "utf-8"),
            tech: fs.readFileSync(path.join(__dirname, "../../templates/article/article.tech.ejs"), "utf-8"),
            mianpro: fs.readFileSync(path.join(__dirname, "../../templates/article/article.mianpro.ejs"), "utf-8"),
        };
    }

    /**
     * 重写render方法，添加预处理步骤
     */
    public async render(
        data: WeixinTemplate[],
        preProcess?: (data: WeixinTemplate[]) => Promise<WeixinTemplate[]>,
        templateType?: string,
    ): Promise<string> {
        // 预处理每篇文章 插入图片到段落之间
        const processedData = data.map(article => this.processArticleContent(article));

        // 调用父类的render方法
        return super.render(processedData, preProcess, templateType);
    }
}
