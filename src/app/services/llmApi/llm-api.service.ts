import { Injectable } from '@angular/core';
import { LLMConfig } from './llm-config.model';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams, HttpRequest } from '@angular/common/http';
import { LlmMessage } from '../../models/llm/llmMessage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlmApiService {

  constructor(private http: HttpClient) { }

  public sendLlmPrompt(prompt: LlmMessage[], llmConfig: LLMConfig) {
    let headers: HttpHeaders;
    let params: HttpParams;
    llmConfig.headers.forEach((header) => headers = headers.set(header[0], header[1]));
    llmConfig.params.forEach((param) => params = params.set(param[0], param[1]));
  }

  public sendOpenAiStyleApiPrompt(prompt: LlmMessage[], llmConfig: LLMConfig): Observable<any> {
    let headers: HttpHeaders;
    let params: HttpParams;
    llmConfig.headers.forEach((header) => headers = headers.set(header[0], header[1]));
    llmConfig.params.forEach((param) => params = params.set(param[0], param[1]));
    return this.http.post(llmConfig.url, {...llmConfig.body, messages: prompt})
  }
}
