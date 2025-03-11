import { ConfigManager } from "@src/utils/config/config-manager";
import { TwitterScraper } from "../twitter.scraper";
async function test() {
    const configManager = ConfigManager.getInstance();
    await configManager.initDefaultConfigSources();
    const scraper = new TwitterScraper();
    const result = await scraper.scrape("https://x.com/CohereForAI");
    console.log('处理后的内容:', JSON.stringify(result, null, 2));
}

test().then(() => {
    console.log('测试完成');
}).catch((error) => {
    console.error('测试失败', error);
});
