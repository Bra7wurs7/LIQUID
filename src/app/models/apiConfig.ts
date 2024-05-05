export class ApiConfig {
    url: URL;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, any>;

    public constructor(
        url: URL,
        params?: Record<string, string>,
        headers?: Record<string, string>,
        body?: Record<string, any>
    ) {
        this.url = url;
        this.params = params ?? {};
        this.headers = headers ?? {};
        this.body = body ?? {};
    }

    public static ForChatCompletion(url: string, key: string) {
        const parsedUrl = new URL(url);
        const authorization = `Bearer ${key}`
        parsedUrl.pathname = "/chat/completions"

        return new ApiConfig(parsedUrl, {}, {'Authorization' : authorization})
    }
}
