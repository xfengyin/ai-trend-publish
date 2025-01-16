import cron from "node-cron";
import { WeixinWorkflow } from "../services/weixin.workflow";

export const weixinCron = async () => {
  console.log("开始执行微信发布任务...");
  const weixinWorkflow = new WeixinWorkflow();
  // 每天中国时间下午6点执行
  cron.schedule(
    "0 18 * * *", // 修改为18点执行
    async () => {
      await weixinWorkflow.refresh();
      await weixinWorkflow.process();
    },
    {
      timezone: "Asia/Shanghai", // 设置为中国时区
    }
  );
};
