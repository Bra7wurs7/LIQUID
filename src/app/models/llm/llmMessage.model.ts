export interface LlmMessage {
    role: "system" | "user" | "assistant" | string;
    content: string;
}