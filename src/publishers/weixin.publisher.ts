import {
  ContentPublisher,
  PublishResult,
} from "./interfaces/publisher.interface";
import dotenv from "dotenv";
import axios from "axios";
import { WeixinTemplate } from "../templates/interfaces/template.interface";
import { ConfigManager } from "../utils/config/config-manager";

dotenv.config();

interface WeixinToken {
  access_token: string;
  expires_in: number;
  expiresAt: Date;
}

interface WeixinDraft {
  media_id: string;
  article_id?: string;
}

export class WeixinPublisher implements ContentPublisher {
  private accessToken: WeixinToken | null = null;
  private appId: string | undefined;
  private appSecret: string | undefined;

  constructor() {
    this.refresh();
  }

  async refresh(): Promise<void> {
    await this.validateConfig();
    this.appId = await ConfigManager.getInstance().get("WEIXIN_APP_ID");
    this.appSecret = await ConfigManager.getInstance().get("WEIXIN_APP_SECRET");
  }

  async validateConfig(): Promise<void> {
    if (
      !(await ConfigManager.getInstance().get("WEIXIN_APP_ID")) ||
      !(await ConfigManager.getInstance().get("WEIXIN_APP_SECRET"))
    ) {
      throw new Error(
        "微信公众号配置不完整，请检查 WEIXIN_APP_ID 和 WEIXIN_APP_SECRET"
      );
    }
  }

  private async ensureAccessToken(): Promise<string> {
    // 检查现有token是否有效
    if (
      this.accessToken &&
      this.accessToken.expiresAt > new Date(Date.now() + 60000) // 预留1分钟余量
    ) {
      return this.accessToken.access_token;
    }

    // 获取新token
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.appId}&secret=${this.appSecret}`;

    try {
      const response = await axios.get(url);
      const { access_token, expires_in } = response.data;

      if (!access_token) {
        throw new Error(
          "获取access_token失败: " + JSON.stringify(response.data)
        );
      }

      this.accessToken = {
        access_token,
        expires_in,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      };

      return access_token;
    } catch (error) {
      console.error("获取微信access_token失败:", error);
      throw error;
    }
  }

  private async uploadDraft(
    article: string,
    title: string,
    digest: string
  ): Promise<WeixinDraft> {
    const token = await this.ensureAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`;

    const articles = [
      {
        title: title,
        author: "刘耀文",
        digest: digest,
        content: article,
        thumb_media_id:
          "SwCSRjrdGJNaWioRQUHzgHJZrV6TNIA3EAaKJabbh4hKjw1instlmsOt9MlN20xo",
        need_open_comment: 1,
        only_fans_can_comment: 0,
      },
    ];

    try {
      const response = await axios.post(url, {
        articles,
      });

      if (response.data.errcode) {
        throw new Error(`上传草稿失败: ${response.data.errmsg}`);
      }

      return {
        media_id: response.data.media_id,
      };
    } catch (error) {
      console.error("上传微信草稿失败:", error);
      throw error;
    }
  }

  async publish(
    article: string,
    title: string,
    digest: string
  ): Promise<PublishResult> {
    try {
      // 上传草稿
      const draft = await this.uploadDraft(article, title, digest);
      return {
        publishId: draft.media_id,
        status: "draft",
        publishedAt: new Date(),
        platform: "weixin",
        url: `https://mp.weixin.qq.com/s/${draft.media_id}`,
      };
    } catch (error) {
      console.error("微信发布失败:", error);
      throw error;
    }
  }
}
