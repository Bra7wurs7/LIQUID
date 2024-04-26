import { HttpParams } from "@angular/common/http";

/**
 * Configuration for an LLM that LIQUID can access
 */
export class LLMConfig {
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, any>;

    public constructor(
        name: string,
        url: string,
        params: Record<string, string> = {},
        headers: Record<string, string> = {},
        body: Record<string, any> = {}
    ) {
        this.url = url;
        this.params = params;
        this.headers = headers;
        this.body = body;
    }
}