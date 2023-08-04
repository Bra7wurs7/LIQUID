import { HttpParams } from "@angular/common/http";

/**
 * Configuration for an LLM that LIQUID can access
 */
export class LLMConfig {
    name: string;
    url: string;
    method: "GET" | "POST" | string;
    params: [string, string][];
    headers: [string, string][];
    body: Record<string, any>;

    public constructor(
        name: string,
        url: string,
        method: "GET" | "POST" | string,
        params: [string, string][],
        headers: [string, string][],
        body: Record<string, any>
    ) {
        this.name = name;
        this.url = url;
        this.method = method;
        this.params = params;
        this.headers = headers;
        this.body = body;
    }
}