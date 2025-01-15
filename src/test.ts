import { WeixinWorkflow } from "./services/weixin.workflow";
import { ConfigManager } from "./utils/config/config-manager";
import { EnvConfigSource } from "./utils/config/sources/env-config.source";
import { DbConfigSource } from "./utils/config/sources/db-config.source";
import { MySQLDB } from "./utils/db/mysql.db";

async function bootstrap() {
  const configManager = ConfigManager.getInstance();
  configManager.addSource(new EnvConfigSource());

  const db = await MySQLDB.getInstance({
    host: await configManager.get("DB_HOST"),
    port: await configManager.get("DB_PORT"),
    user: await configManager.get("DB_USER"),
    password: await configManager.get("DB_PASSWORD"),
    database: await configManager.get("DB_DATABASE"),
  });
  configManager.addSource(new DbConfigSource(db));

  const weixinWorkflow = new WeixinWorkflow();

  await weixinWorkflow.refresh();
  await weixinWorkflow.process();
}

bootstrap().catch(console.error);
