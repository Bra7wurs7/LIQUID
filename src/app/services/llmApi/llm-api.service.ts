import { Injectable } from '@angular/core';
import { LLMConfig } from '../../models/llm-config';
import { Observable, map } from 'rxjs';
import { Conversation } from '../../models/conversation';
import { OpenAIRequestBody } from '../../models/llm/openAiRequestBody';
import { MessageService } from 'primeng/api';
import { OllamaRequestBody } from 'src/app/models/llm/ollamaRequestBody';

@Injectable({
  providedIn: 'root'
})
export class LlmApiService {
  llmConfigs: LLMConfig[] = [];

  constructor(private messageService: MessageService) {
    const loadedConfig = localStorage.getItem("llmConfigs")
    if (loadedConfig) {
      this.llmConfigs = JSON.parse(loadedConfig);
    }
  }

  public addLLMConfig(llm: [string, string, string], key: string) {
    const newLLMConfig = new LLMConfig(llm[1], llm[0], {}, { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }, { model: llm[1] })
    this.llmConfigs.push(newLLMConfig);
    this.saveLLMConfigs();
  }

  public removeLLMConfig(index?: number) {
    if (index !== undefined) {
      this.llmConfigs.splice(index, 1);
      this.saveLLMConfigs();
    }
  }

  public saveLLMConfigs() {
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public async sendLLMPrompt(prompt: Conversation, llmConfig: LLMConfig): Promise<Observable<Record<string, any>[]> | void> {
    const last_message = prompt.messages.pop();
    if (last_message) {
      last_message.role = 'user';
      this.messageService.add({
        severity: 'success',
        summary: 'Last message changed to outgoing',
      });
      prompt.messages.push(last_message);
    }
    return this.sendOpenAiStylePrompt(prompt, llmConfig);
  }

  public async sendOpenAiStylePrompt(prompt: Conversation, llmConfig: LLMConfig): Promise<Observable<Record<string, any>[]> | undefined> {
    const body: OpenAIRequestBody = { ...new OpenAIRequestBody(), ...llmConfig.body, temperature: prompt.temperature, max_tokens: prompt.max_tokens }
    for (const msg of prompt.messages) {
      if (msg.active) body.messages.push({ role: msg.role, content: msg.content });
    }
    const response = await fetch(llmConfig.url + this.httpParamsToStringSuffix(llmConfig.params), {
      method: 'POST',
      headers: { ...llmConfig.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      this.messageService.add({ severity: 'error', summary: `Something went wrong trying to prompt the LLM. Code: ` + response.status })
    }

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    if (reader) {
      return this.readableStreamToObservable(reader).pipe(map((a) => this.tolerantJsonParse(a)));
    } else {
      return;
    }
  }

  public async sendOllamaStylePrompt(prompt: Conversation, llmConfig: LLMConfig) {
    let system_text = "";
    let prompt_text = "";
    for (const msg of prompt.messages) {
      if (msg.active) {
        if (msg.role === "system") {
          system_text = system_text + msg.content + "\n";
        } else {
          prompt_text = prompt_text + msg.content + "\n";
        }
      }
    }
    const body: OllamaRequestBody = {
      ...new OllamaRequestBody(), ...llmConfig.body, system: system_text, prompt: prompt_text, options: {
        top_p: prompt.top_p,
        temperature: prompt.temperature,
        num_predict: prompt.max_tokens,
      }
    }
    const response = await fetch(llmConfig.url + this.httpParamsToStringSuffix(llmConfig.params), {
      method: 'POST',
      headers: { ...llmConfig.headers, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      this.messageService.add({ severity: 'error', summary: `Something went wrong trying to prompt the LLM. Code: ` + response.status })
    }

    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

    if (reader) {
      return this.readableStreamToObservable(reader).pipe(map((a) => this.tolerantJsonParse(a)));
    } else {
      return;
    }
  }

  /**
    * Converts a record of http params into a string to be appended to any url
    * @param params An instance of Record<string, string> to be converted into a string suffix
    * @returns A string of http parameters that can be appended to any url
    */
  public httpParamsToStringSuffix(params: Record<string, string>): string {
    const paramEntries = Object.entries(params);
    const paramString = paramEntries
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    return paramString ? `?${paramString}` : '';
  }

  public readableStreamToObservable(reader: ReadableStreamDefaultReader<string>): Observable<string> {
    return new Observable<string>((subscriber) => {
      // Recursive function to read the stream
      const pump = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            // Close the stream if it's done
            subscriber.complete();
            return;
          }
          // Emit the value and continue reading
          subscriber.next(value);
          pump();
        }).catch(err => {
          // Handle any errors
          subscriber.error(err);
        });
      };

      // Start the reading process
      pump();

      // Return a teardown logic function
      return () => {
        reader.cancel().catch(() => {
          // Handle the cancel error if necessary
        });
      };
    });
  }

  public tolerantJsonParse(input: string): Record<string, any>[] {
    // Regular expression to match JSON objects
    const jsonRegex = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
    const validJsonObjects: Record<string, any>[] = [];
    let match: RegExpExecArray | null;

    // Iterate over all matches of the regular expression
    while ((match = jsonRegex.exec(input)) !== null) {
      try {
        // Attempt to parse the matched string as JSON
        const jsonObject = JSON.parse(match[0]);
        validJsonObjects.push(jsonObject);
      } catch (error) {
        // If parsing fails, it's not a valid JSON object, so we ignore it
      }
    }

    return validJsonObjects;
  }
}
