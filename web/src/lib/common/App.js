import Request from "./Request.js"
class App {
    constructor(config) {
        this.language = config.language ?? null;
        this.auth = config.auth ?? null;
    }

    translate(identifier) {
        return this.language.translate(identifier);
    }

    request(config) {
        let request = new Request();
        request.auth = this.auth;
        return request.send(config);
    }
}
export default App;