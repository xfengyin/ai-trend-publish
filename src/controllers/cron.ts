import cron from "node-cron";
import dotenv from "dotenv";

import { WeixinWorkflow } from "../services/weixin.workflow";

const weixinWorkflow = new WeixinWorkflow();

export const weixinCron = async () => {
  console.log("开始执行微信发布任务...");
  cron.schedule("0 18 * * *", async () => {
    await weixinWorkflow.process();
  });
};
