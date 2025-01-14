import cron from "node-cron";
import dotenv from "dotenv";

import { WeixinWorkflow } from "../services/weixin.workflow";

const weixinWorkflow = new WeixinWorkflow();

export const weixinCron = async () => {
  console.log("开始执行微信发布任务...");
  // 美国服务器时间转换为北京时间18:00 (UTC-4 -> UTC+8，差12小时)
  cron.schedule("0 6 * * *", async () => {
    await weixinWorkflow.process();
  });
};
