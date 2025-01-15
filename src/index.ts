import { weixinCron } from "./controllers/cron";
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
    user: await configManager.get("DB_USERNAME"),
    password: await configManager.get("DB_PASSWORD"),
    database: await configManager.get("DB_DATABASE"),
  });
  configManager.addSource(new DbConfigSource(db));

  weixinCron();
}

bootstrap().catch(console.error);
