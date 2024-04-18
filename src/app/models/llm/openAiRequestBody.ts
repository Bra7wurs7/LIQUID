import { LLMMessage } from "./message.model";

export class OpenAIRequestBody {
    model: string = "";
    messages: LLMMessage[] = [];
    temperature: number = 0;
    top_p: number = 1;
    max_tokens: number = 64;
    stream: boolean = true;
    safe_prompt?: boolean = undefined;
    random_seed?: number = undefined;
}