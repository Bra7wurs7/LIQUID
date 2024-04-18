import { LLMMessage } from "./message.model";

export class OllamaRequestBody {
    model: string = "";
    system: string = "";
    prompt: string = "";
    options: OllamaOptions = {
        top_p: 1,
        temperature: 0.5,
        num_predict: 512,
    }

    stream: boolean = true;
}

export interface OllamaOptions {
    top_p: number;
    temperature: number;
    num_predict: number;
    seed?: number;
}