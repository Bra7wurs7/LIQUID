import { Injectable } from '@angular/core';
import { LLMConfig } from './llm-config.model';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams, HttpRequest } from '@angular/common/http';
import { LlmMessage } from '../../models/llm/llmMessage.model';
import { Observable } from 'rxjs';

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
    const newOpenAiConfig = new LLMConfig(name, url, "POST", [], [['Authorization', `Bearer ${key}`]], { model: "gpt-3.5-turbo", stream: true, temperature: 1.07 })
    this.llmConfigs.push(newOpenAiConfig);
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public removeLLMConfig(index: number) {
    this.llmConfigs.splice(index, 1);
    localStorage.setItem("llmConfigs", JSON.stringify(this.llmConfigs));
  }

  public sendOpenAiStylePrompt(prompt: LlmMessage[], llmConfig: LLMConfig): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    let params: HttpParams = new HttpParams();
    for (const header of llmConfig.headers) {
      headers = headers.set(header[0], header[1])
    }
    for (const param of llmConfig.params) {
      params = params.set(param[0], param[1])
    }
    return this.http.post(llmConfig.url, {...llmConfig.body, messages: prompt}, {headers: headers, params: params})
  }
}
