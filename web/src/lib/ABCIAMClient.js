class ABCIAMClient {
    constructor(config) {
        this.accessTokenData = null;
        this.refreshTokenData = null;
        //this.cookie_root = cookie_root ?? window.document;
        this.cookie_root = window.document;
        this.serverURL = (config.url) ? config.url : "";
        this.resource = (config.resource) ? config.resource : "token";
    }
    get isLoggedIn() {
        let loggedIn = this.refreshToken || !this.isTokenExpired(this.refreshToken);
        if(!loggedIn) {
            this.logout();
        }
        return loggedIn;
    }
    
    async login(id_token) {
        let url = this.serverURL + this.resource;
        url += "?id_token=" + encodeURIComponent(id_token);

        let response = await fetch(url);
        let data = await response.json();
        if(data.refreshToken === undefined) {
            return;
        }
        if (data) {
            this.refreshToken = data.refreshToken;
            this.accessToken = data.accessToken;
        }
    }
    async logout(all) {
        if(this.refreshToken === null) {
            this.accessToken = null;
            console.log("ABCIAM: Already logged out");
            return;
        } 
        
        let url = this.serverURL + this.resource;
        let config = {
            method: "delete",
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({'token': this.refreshToken, 'all': all}),
        }
        this.refreshToken = null;
        this.accessToken = null;

        let response = await fetch(url, config);
    }
    async refresh() {
        let url = this.serverURL + this.resource;
        let config = {
            method: "POST",
            body: JSON.stringify({'token': this.refreshToken}),
            headers: {"Content-Type": "application/json"}
        }
        let response = await fetch(url, config);
        let data = await response.json();
        
        this.refreshToken = data.refreshToken;
        this.accessToken = data.accessToken;
    }

    get refreshToken() {
        if(this.refreshTokenData === null) {
            this.refreshTokenData = this.getCookieValue("refresh");
        }
        return this.refreshTokenData;
    }
    set refreshToken(token) {
        let expiry = 0;
        if(token !== null) {
            let decoded = this.decode(token);
            expiry = decoded.payload.exp;
        }
        this.refreshTokenData = token;
        this.setCookieValue("refresh", token, expiry);
    }
    //TODO - await an access token on refresh
    get accessToken() {
        return new Promise(async (resolve) => {
            if(this.accessTokenData === null) {
                this.accessTokenData = this.getCookieValue("access");
            }
            if(this.isTokenExpired(this.accessTokenData)){
                console.log("access expired, refreshing");
                await this.refresh();
            }
            resolve(this.accessTokenData);
        });
    }
    set accessToken(token) {
        let expiry = 0;
        if(token !== null) {
            let decoded = this.decode(token);
            expiry = decoded.payload.exp;
        }

        this.accessTokenData = token;
        this.setCookieValue("access", token, expiry);
    }

    isTokenExpired(token = null, relative = 0) {
        if(token === null || token === undefined) {
            console.log("token null")
            return true;
        } else {
            let decoded = this.decode(token);
            console.log("decoded", decoded);
            let expiry = Number(decoded.payload.exp) * 1000;
            let now = new Date().getTime() + (relative * 1000);
            let isExpired = (now > expiry);
            console.log("Expired:", expiry, now, (expiry - now), isExpired);
            
            return (isExpired);
        }
    }
    
    decode(key) {
        key = String(key).trim();
        if(!key) {
            return null;
        }
        let jwtParts = key.split(".");
        return {
            header: JSON.parse(atob(jwtParts[0])),
            payload: JSON.parse(atob(jwtParts[1])),
            signature: jwtParts[2]
        }
    }
    getCookieValue(key) {
        let returnValue = null;
        let searchLength = key.length;
        let cookieArray = String(this.cookie_root.cookie).split(";");
        for(let i = 0; i < cookieArray.length && returnValue === null; i++) {
            let valString = String(cookieArray[i]).trim();
            if(valString.substring(0, searchLength) === key) {
                returnValue = valString.split("=")[1].trim();
            } 
        }
        return returnValue;
    }

    setCookieValue(key, value, expirySeconds) {
        let expiryDate = new Date(expirySeconds * 1000).toGMTString();
        let cookie_value = key + "=" + value + "; expires=" + expiryDate;
        this.cookie_root.cookie = cookie_value;
    }
}
export default ABCIAMClient;