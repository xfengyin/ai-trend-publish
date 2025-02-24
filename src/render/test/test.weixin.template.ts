import fs from "fs";
import path from "path";
import { WeixinTemplateRenderer } from "../weixin/renderer";
import { WeixinTemplate } from "../interfaces/template.interface";
import { formatDate } from "../../utils/common";

// 生成示例HTML预览
const previewArticles: WeixinTemplate[] = [
  {
    id: "1",
    title: "人工智能发展最新突破：GPT-4展现多模态能力",
    content: `
      OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。\n
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。\n
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景。
    `,
    url: "https://example.com/gpt4-breakthrough",
    publishDate: formatDate(new Date().toISOString()),
    keywords: ["GPT-4", "人工智能", "多模态", "OpenAI"],
    metadata: {
      author: "AI研究员",
      readTime: "5分钟",
    },
  },
  {
    id: "2",
    title: "量子计算研究取得重大进展",
    content: `
      科研团队成功实现了100量子比特的纠缠态控制，
      这一突破为未来量子计算机的实用化奠定了重要基础。
      专家预测这将加速量子优势的实现进程OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景OpenAI最新发布的GPT-4模型展现了强大的多模态能力，
      不仅能够理解文本，还能处理图像输入，为AI的发展带来新的可能。
      本文将深入分析GPT-4的核心特性和潜在应用场景。
    `,
    url: "https://example.com/quantum-computing",
    publishDate: formatDate(new Date().toISOString()),
    keywords: ["量子计算", "量子纠缠", "科技创新"],
    metadata: {
      author: "量子物理专家",
      readTime: "8分钟",
    },
  },
];

// 渲染并保存预览文件
const renderer = new WeixinTemplateRenderer();
const html = renderer.render(previewArticles);

// 确保temp目录存在
const tempDir = path.join(__dirname, "../../../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 保存渲染结果
const outputPath = path.join(tempDir, "preview_weixin.html");
fs.writeFileSync(outputPath, html, "utf-8");
console.log(`预览文件已生成：${outputPath}`);
