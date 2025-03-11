import { WeixinPublisher } from "@src/modules/publishers/weixin.publisher";
import sharp from 'sharp';

interface ImageValidationResult {
    isValid: boolean;
    contentType?: string;
    error?: string;
}

interface ImageProcessResult {
    originalUrl: string;
    newUrl?: string;
    error?: string;
}

export class WeixinImageProcessor {
    private static readonly MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
    private static readonly VALID_IMAGE_EXTENSIONS = [
        '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff'
    ];

    private static readonly URL_PATTERNS = {
        markdown: /!\[([^\]]*)\]\(([^)]+)\)/g,
        html: /<img[^>]+src=["']([^"']+)["'][^>]*>/g,
        bbcode: /\[img\](.*?)\[\/img\]/g,
        plainUrl: /(https?:\/\/[^\s<>"]+?\/[^\s<>"]+?\.(jpg|jpeg|png|gif|webp|bmp|tiff))/gi
    };
    private weixinPublisher: WeixinPublisher;

    constructor(weixinPublisher: WeixinPublisher) {
        this.weixinPublisher = weixinPublisher;
    }

    /**
     * 处理文章内容中的所有图片
     * @param content 文章内容
     * @returns 处理后的文章内容
     */
    async processContent(content: string): Promise<{
        content: string;
        results: ImageProcessResult[];
    }> {
        const imageUrls = this.extractImageUrls(content);
        const results: ImageProcessResult[] = [];
        let processedContent = content;

        for (const imageUrl of imageUrls) {
            try {
                const validationResult = await this.validateImage(imageUrl);
                if (!validationResult.isValid) {
                    results.push({
                        originalUrl: imageUrl,
                        error: validationResult.error
                    });
                    continue;
                }

                // 下载图片
                const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
                let uploadBuffer: Buffer | undefined;

                // 检查图片大小并在需要时进行压缩
                if (imageBuffer.byteLength > WeixinImageProcessor.MAX_IMAGE_SIZE) {
                    console.log(`图片大小超过1MB (${(imageBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)，进行压缩...`);
                    uploadBuffer = await this.compressImage(imageBuffer);
                    console.log(`压缩后大小: ${(uploadBuffer.length / 1024 / 1024).toFixed(2)}MB`);
                }

                // 上传图片到微信
                const newUrl = await this.weixinPublisher.uploadContentImage(imageUrl, uploadBuffer);
                results.push({
                    originalUrl: imageUrl,
                    newUrl
                });

                // 替换文章中的图片URL
                processedContent = this.replaceImageUrl(processedContent, imageUrl, newUrl);

            } catch (error) {
                console.error(`处理图片失败: ${imageUrl}`, error);
                results.push({
                    originalUrl: imageUrl,
                    error: error instanceof Error ? error.message : '未知错误'
                });
            }
        }

        return {
            content: processedContent,
            results
        };
    }

    async processImageUrl(url: string): Promise<string> {
        const validationResult = await this.validateImage(url);
        if (!validationResult.isValid) {
            throw new Error(validationResult.error);
        }
        const imageBuffer = await fetch(url).then(res => res.arrayBuffer());
        let uploadBuffer: Buffer | undefined;
        if (imageBuffer.byteLength > WeixinImageProcessor.MAX_IMAGE_SIZE) {
            uploadBuffer = await this.compressImage(imageBuffer);
        }
        return this.weixinPublisher.uploadContentImage(url, uploadBuffer);
    }

    /**
     * 从文章内容中提取所有图片URL
     * @param content 文章内容
     * @returns 图片URL数组
     */
    private extractImageUrls(content: string): string[] {
        const urls = new Set<string>();

        // 处理Markdown格式
        content.replace(WeixinImageProcessor.URL_PATTERNS.markdown, (_, __, url) => {
            urls.add(url);
            return '';
        });

        // 处理HTML格式
        content.replace(WeixinImageProcessor.URL_PATTERNS.html, (_, url) => {
            urls.add(url);
            return '';
        });

        // 处理BBCode格式
        content.replace(WeixinImageProcessor.URL_PATTERNS.bbcode, (_, url) => {
            urls.add(url);
            return '';
        });

        // 处理纯URL格式
        content.replace(WeixinImageProcessor.URL_PATTERNS.plainUrl, (url) => {
            urls.add(url);
            return '';
        });

        return Array.from(urls);
    }

    /**
     * 验证图片URL是否有效
     * @param url 图片URL
     * @returns 验证结果
     */
    private async validateImage(url: string): Promise<ImageValidationResult> {
        try {
            // 检查URL格式
            const urlObj = new URL(url);
            const extension = urlObj.pathname.toLowerCase().split('.').pop();

            if (!extension || !WeixinImageProcessor.VALID_IMAGE_EXTENSIONS.includes(`.${extension}`)) {
                return {
                    isValid: false,
                    error: '不支持的图片格式'
                };
            }

            // 发送HEAD请求检查Content-Type
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');

            if (!contentType || !contentType.startsWith('image/')) {
                return {
                    isValid: false,
                    error: '无效的Content-Type: ' + contentType
                };
            }

            return {
                isValid: true,
                contentType
            };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : '验证图片URL时发生错误'
            };
        }
    }

    /**
     * 压缩图片
     * @param imageBuffer 原始图片buffer
     * @param maxSizeInMB 最大大小（MB）
     * @returns 压缩后的Buffer
     */
    private async compressImage(imageBuffer: ArrayBuffer, maxSizeInMB: number = 1): Promise<Buffer> {
        const buffer = Buffer.from(imageBuffer);
        let quality = 100;
        let compressedBuffer = await sharp(buffer)
            .jpeg({ quality })
            .toBuffer();

        // 如果大小仍然超过限制，逐步降低质量直到满足要求
        while (compressedBuffer.length > maxSizeInMB * 1024 * 1024 && quality > 10) {
            quality -= 10;
            compressedBuffer = await sharp(buffer)
                .jpeg({ quality })
                .toBuffer();
        }

        return compressedBuffer;
    }

    /**
     * 替换文章中的图片URL
     * @param content 文章内容
     * @param oldUrl 原始URL
     * @param newUrl 新URL
     * @returns 替换后的内容
     */
    private replaceImageUrl(content: string, oldUrl: string, newUrl: string): string {
        let result = content;

        // 替换Markdown格式
        result = result.replace(
            new RegExp(`!\\[([^\\]]*)\\]\\(${this.escapeRegExp(oldUrl)}\\)`, 'g'),
            `![$1](${newUrl})`
        );

        // 替换HTML格式
        result = result.replace(
            new RegExp(`<img([^>]*)src=["']${this.escapeRegExp(oldUrl)}["']([^>]*)>`, 'g'),
            `<img$1src="${newUrl}"$2>`
        );

        // 替换BBCode格式
        result = result.replace(
            new RegExp(`\\[img\\]${this.escapeRegExp(oldUrl)}\\[/img\\]`, 'g'),
            `[img]${newUrl}[/img]`
        );

        // 替换纯URL格式
        result = result.replace(
            new RegExp(this.escapeRegExp(oldUrl), 'g'),
            newUrl
        );

        return result;
    }

    /**
     * 转义正则表达式特殊字符
     * @param string 需要转义的字符串
     * @returns 转义后的字符串
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 处理EJS模板中的图片URL，将其转换为微信图片URL
     * @param ejsContent EJS模板内容
     * @returns 处理后的EJS内容和处理结果
     */
    async processEjsContent(ejsContent: string): Promise<{
        content: string;
        results: ImageProcessResult[];
    }> {
        // EJS图片标签的正则表达式
        const ejsImagePattern = /<%[-=]?\s*['"](https?:\/\/[^'"]+\.(jpg|jpeg|png|gif|webp|bmp|tiff))['"]\s*%>/gi;

        const imageUrls = new Set<string>();
        ejsContent.replace(ejsImagePattern, (match, url) => {
            imageUrls.add(url);
            return match;
        });

        const results: ImageProcessResult[] = [];
        let processedContent = ejsContent;

        for (const imageUrl of imageUrls) {
            try {
                const validationResult = await this.validateImage(imageUrl);
                if (!validationResult.isValid) {
                    results.push({
                        originalUrl: imageUrl,
                        error: validationResult.error
                    });
                    continue;
                }

                // 下载并处理图片
                const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
                let uploadBuffer: Buffer | undefined;

                if (imageBuffer.byteLength > WeixinImageProcessor.MAX_IMAGE_SIZE) {
                    console.log(`图片大小超过1MB (${(imageBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)，进行压缩...`);
                    uploadBuffer = await this.compressImage(imageBuffer);
                    console.log(`压缩后大小: ${(uploadBuffer.length / 1024 / 1024).toFixed(2)}MB`);
                }

                // 上传图片到微信
                const newUrl = await this.weixinPublisher.uploadContentImage(imageUrl, uploadBuffer);
                results.push({
                    originalUrl: imageUrl,
                    newUrl
                });

                // 替换EJS模板中的图片URL
                processedContent = processedContent.replace(
                    new RegExp(`(<%[-=]?\\s*['"])${this.escapeRegExp(imageUrl)}(['"]\\s*%>)`, 'g'),
                    `$1${newUrl}$2`
                );

            } catch (error) {
                console.error(`处理EJS模板中的图片失败: ${imageUrl}`, error);
                results.push({
                    originalUrl: imageUrl,
                    error: error instanceof Error ? error.message : '未知错误'
                });
            }
        }

        return {
            content: processedContent,
            results
        };
    }
} 