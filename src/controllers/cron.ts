import cron from "node-cron";
import { WeixinWorkflow } from "../services/weixin.workflow";

export const weixinCron = async () => {
  console.log("开始执行微信发布任务...");
  const weixinWorkflow = new WeixinWorkflow();
  // 美国服务器时间转换为北京时间18:00 (UTC-4 -> UTC+8，差12小时)
  cron.schedule("0 6 * * *", async () => {
    await weixinWorkflow.refresh();
    await weixinWorkflow.process();
  });
};
