export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface ChatCompletionOptions {
    model?: string;
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stream?: boolean;
    response_format?: any;
}

export interface LLMProvider {
    /**
     * 初始化LLM提供者
     */
    initialize(): Promise<void>;

    /**
     * 刷新配置
     */
    refresh(): Promise<void>;

    /**
     * 创建聊天完成
     * @param messages 消息数组
     * @param options 可选参数
     */
    createChatCompletion(
        messages: ChatMessage[],
        options?: ChatCompletionOptions
    ): Promise<any>;
}