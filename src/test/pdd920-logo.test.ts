import { PDD920LogoGenerator } from "../providers/image-gen/pdd920-logo";
import path from "path";

async function testPDD920Logo() {
    try {
        // 测试直接获取图片buffer
        await PDD920LogoGenerator.saveToFile(
            {
                t: "@AISPACE科技空间",
                text: "本周大模型榜单"
            },
            path.join(__dirname, "../../output/pdd920-logo.png")
        );

        // 测试获取JSON URL
        const imageUrl = await PDD920LogoGenerator.generate({
            t: "@AISPACE科技空间",
            text: "本周大模型榜单",
            type: "json"
        });

        console.log("图片URL:", imageUrl);
        console.log("图片已保存到 output/pdd920-logo.png");
    } catch (error) {
        console.error("Logo生成失败:", error);
    }
}

// 运行测试
testPDD920Logo(); 