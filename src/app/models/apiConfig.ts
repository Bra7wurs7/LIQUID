import { HttpParams } from "@angular/common/http";

export class ApiConfig {
    url: URL;
    default_params: Record<string, string>;
    default_headers: Record<string, string>;
    default_body: Record<string, any>;
    flags: ApiFlag[] = [];

    public constructor(
        url: URL,
        params?: Record<string, string>,
        headers?: Record<string, string>,
        body?: Record<string, any>
    ) {
        this.url = url;
        this.default_params = params ?? {};
        this.default_headers = headers ?? {};
        this.default_body = body ?? {};
    }

    public static ForChatCompletion(url: string) {
        const parsedUrl = this.TolerantUrlParse(url)
        const params = {}

        parsedUrl.pathname = "/chat/completions"

        return new ApiConfig(parsedUrl)
    }

    public static TolerantUrlParse(url: string): URL {
        if (URL.canParse(url)) {
            const urlCopy = "https://" + url
            return new URL(urlCopy)
        }
        return new URL(url);
    }
}

export enum ApiFlag {
    ollama,
    mistral,
    openai,
}