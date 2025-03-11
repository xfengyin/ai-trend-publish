import { ImageProcessor } from "../image-processor";
import { WeixinPublisher } from "@src/modules/publishers/weixin.publisher";
import { ConfigManager } from "@src/utils/config/config-manager";
async function test() {
    const configManager = ConfigManager.getInstance();
    await configManager.initDefaultConfigSources();
    const weixinPublisher = new WeixinPublisher();
    const imageProcessor = new ImageProcessor(weixinPublisher);
    const content = `
        # 测试文章
        ![示例图片](https://oss.liuyaowen.cn/images/202503081200663.png)
        <img src="https://oss.liuyaowen.cn/images/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%912024-11-09%2010_13_12.png" alt="另一张图片">
    `;

    const result = await imageProcessor.processContent(content);
    console.log('处理后的内容:', result.content);
    console.log('处理结果:', result.results);
}

test().then(() => {
    console.log('测试完成');
}).catch((error) => {
    console.error('测试失败', error);
});
