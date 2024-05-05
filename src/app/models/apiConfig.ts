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
        const parsedUrl = this.TolerantUrlParse(url)
        const authorization = `Bearer ${key}`
        parsedUrl.pathname = "/chat/completions"

        return new ApiConfig(parsedUrl, {}, {'Authorization' : authorization})
    }

    public static TolerantUrlParse(url: string): URL {
        if (URL.canParse(url)) {
            const urlCopy = "https://" + url
            return new URL(urlCopy)
        }
        return new URL(url);
    }
}
