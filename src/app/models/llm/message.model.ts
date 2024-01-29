export class LLMMessage {
    role: "user" | "assistant" | "system" = 'user';
    content: string = '';
}