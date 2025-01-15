import { IConfigSource } from "./interfaces/config-source.interface";

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export class ConfigManager {
  private static instance: ConfigManager;
  private configSources: IConfigSource[] = [];

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 添加配置源
   * @param source 配置源实例
   */
  public addSource(source: IConfigSource): void {
    this.configSources.push(source);
    // 按优先级排序（升序，数字越小优先级越高）
    this.configSources.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 获取配置值
   * @param key 配置键
   * @throws {ConfigurationError} 当所有配置源都无法获取值时抛出
   */
  public async get<T>(key: string): Promise<T> {
    for (const source of this.configSources) {
      const value = await source.get<T>(key);
      if (value !== null) {
        return value;
      }
    }
    throw new ConfigurationError(
      `Configuration key "${key}" not found in any source`
    );
  }

  /**
   * 获取所有已注册的配置源
   */
  public getSources(): IConfigSource[] {
    return [...this.configSources];
  }

  /**
   * 清除所有配置源
   */
  public clearSources(): void {
    this.configSources = [];
  }
}
