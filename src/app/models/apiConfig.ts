export interface ApiConfig {
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, any>;
}
