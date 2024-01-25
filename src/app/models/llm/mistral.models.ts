export class MistralRequestBody {
    model: string = "mistral-medium";
    messages: MistralRequestMessage[] = [];
    temperature: number = 0;
    top_p: number = 1;
    max_tokens: number = 64;
    stream: boolean = true;
    safe_prompt: boolean = false;
    random_seed: number = 0;
}

export class MistralRequestMessage {
    role: "user" | "assistant" | "system" = 'user';
    content: string = '';
}