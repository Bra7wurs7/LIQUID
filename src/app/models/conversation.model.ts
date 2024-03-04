export class Conversation {
    messages: Msg[] = []
    temperature: number = 0.5;
    top_p: number = 1;
    max_tokens: number = 512;
    random_seed: number | null = null;

    constructor(messages?: Msg[]) {
        this.messages = messages ?? [];
    }
}

export interface Msg {
    active?: boolean;
    role: "user" | "assistant" | "system";
    content: string;
}