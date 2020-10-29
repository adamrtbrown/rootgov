class Request {
  constructor() {
    this.authObject = null;
  }
  
  get auth() {
    console.log("auth", this.authObject);
    if(this.authObject !== null) {
      return this.authObject;
    } 
    return {accessToken: null}
  }

  set auth(authObject) {
    this.authObject = authObject;
  }

  async send(config) {
    if(!config.headers){
      config.headers = {'Content-Type': 'application/json'};
    }
    if(config.authRequired !== false) {
      let accessToken = await this.auth.accessToken;
      if (!accessToken) {
        throw new Error("Request: Error, no access token.");
      }
      config.headers.Authorization = "Bearer " + accessToken;
    }
    
    let url = config.url;
    console.log("Fetching: ", url, config);
    let response = await fetch(url, config);
    return response;
  }
}
export default Request;