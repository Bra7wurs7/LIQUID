import { Injectable } from '@angular/core';
import { LLMConfig } from './llm-config.model';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams, HttpRequest } from '@angular/common/http';
import { LlmMessage } from '../../models/llm/llmMessage.model';
import { Observable, map } from 'rxjs';
import { Conversation, Msg } from '../../models/conversation.model';
import { MistralRequestBody } from '../../models/llm/mistral.models';

@Injectable({
  providedIn: 'root'
})
export class LlmApiService {
  llmConfigs: LLMConfig[] = [];

  constructor(private http: HttpClient) {
    const loadedConfig = localStorage.getItem("llmConfigs")
    if (loadedConfig) {
      this.llmConfigs = JSON.parse(loadedConfig);
    }
  }

  public addNewOpenAiConfig(name: string, url: string, key: string) {
    const newOpenAiConfig = new LLMConfig(name, url, {}, { 'Authorization': `Bearer ${key}` }, { model: "gpt-4", stream: true })
    this.llmConfigs.push(newOpenAiConfig);
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public addNewMistralConfig(name: string, url: string, key: string) {
    const newMistralConfig = new LLMConfig(name, url, {}, { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' }, { model: "mistral-medium", stream: true })
    this.llmConfigs.push(newMistralConfig);
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public removeLLMConfig(index: number) {
    this.llmConfigs.splice(index, 1);
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public async sendMistralStylePrompt(prompt: Conversation, llmConfig: LLMConfig): Promise<Observable<Record<string, any>[]> | undefined> {
    const body: MistralRequestBody = { ...new MistralRequestBody(), ...llmConfig.body, temperature: prompt.temperature, max_tokens: prompt.max_tokens }
    body.messages.push({ role: "system", content: prompt.system ?? "" })
    for (const msg of prompt.messages) {
      if(msg.active) body.messages.push({ role: msg.role, content: msg.content });
    }
    const response = await fetch(llmConfig.url + this.httpParamsToStringSuffix(llmConfig.params), {
      method: 'POST',
      headers: llmConfig.headers,
      body: JSON.stringify(body)
    });

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
