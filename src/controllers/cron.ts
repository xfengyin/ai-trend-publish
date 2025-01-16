import cron from "node-cron";
import { WeixinWorkflow } from "../services/weixin.workflow";

export const weixinCron = async () => {
  console.log("开始执行微信发布任务...");
  const weixinWorkflow = new WeixinWorkflow();
  // 每分钟执行一次
  cron.schedule("* * * * *", async () => {
    await weixinWorkflow.refresh();
    await weixinWorkflow.process();
  });
};
