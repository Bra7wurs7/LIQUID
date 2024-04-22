export class ApiConnection {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    local_ollama(): ApiConnection {
        const ac = new ApiConnection("http://localhost:11434");
        return ac;
    }
}