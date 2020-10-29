import ABCIAMAppServer from 'ABCIAM';
import jwt from 'jsonwebtoken';
import DB from './DB.js';
class Server {
    constructor(server_config) {
        this.abciam_config = {
            app_id: (server_config.app_id) ? server_config.app_id : null,
            app_secret: (server_config.app_secret) ? server_config.app_secret : null,
            url: (server_config.url) ? server_config.url : null, 
        }
        this.signing_key = null;
    }

    set config(config) {
        this.abciam_config = config;
    }
    get config() {
        return this.abciam_config;
    }

    async getToken(req) {
        try {
            let config = {
                app_id: process.env.ABCIAM_APP_ID,
                app_secret:process.env.ABCIAM_APP_SECRET,
                url: process.env.ABCIAM_URL
            }
            let abc = new ABCIAMAppServer(this.abciam_config);
            let refreshToken = await abc.login(req.body.id_token);
            let decoded = jwt.decode(refreshToken);
            let expiry = Math.round(new Date().getTime() / 1000) + Number(process.env.ACCESS_EXPIRY);
            let accessToken = await this.createToken({user: decoded.user}, expiry);
            await this.provisionUser(decoded.user);
            let retvar = {'refreshToken': refreshToken, 'accessToken': accessToken};
            console.log("Server: Returning getTokens");
            return retvar;
        } catch (err) {
            console.log(err.message);
            return {"err":1};
        }
    }

    async provisionUser(user) {
        let db = new DB();
        let query = "REPLACE INTO `users`(`uid`) VALUES (?)";
        let response = await db.query(query, [user]);
        db.end();
    }

    async postToken(req) {
        let abc = new ABCIAMAppServer(this.abciam_config);
        try {
            let refreshToken = await abc.refresh(req.body.token);
            let decoded = jwt.decode(refreshToken);
            let accessToken = await this.createToken({user: decoded.user});
            let retvar = {'refreshToken': refreshToken, 'accessToken': accessToken};
            return retvar;
        } catch(err) {
            console.error("postToken", err.message);
            return {error:1};
        }
    }
    async deleteToken(req) {
        let abc = new ABCIAMAppServer(this.abciam_config);
        console.log("DELETE",req.body);
        await abc.logout(req.body.token, req.body.all);
        return true;
    }

    async createToken(claims, expirySeconds) {
        claims.exp = expirySeconds ?? (Math.round(new Date().getTime() / 1000) + Number(process.env.ACCESS_EXPIRY));
        let signing_key = await this.getSigningKey();
        let token = jwt.sign(claims, signing_key, {algorithm: 'HS256'});
        return token;
      }
    async getSigningKey() {
        let db = new DB();
        if(this.signing_key === null) {
            let result = await db.query('SELECT `latest` FROM `signing_keys` LIMIT 1');
            this.signing_key = result.results[0].latest;
        }
        db.end();
        return this.signing_key;
    }

    routeSecurity(route) {
        return false;
    }

    async tokenSecurity(req, res) {
        let token_header = req.get("Authorization");
        console.log("Checking: ", req.originalUrl)
        if (this.routeSecurity(req.originalUrl)) {
            console.log("route security enabled");
            if(!token_header) {
                console.log("No Auth token");
                res.status(401).json({err:"Unauthorized"});
                res.end();
                return false;
            }
            let token = String(token_header).split(" ")[1];
            let key = await this.getSigningKey();
            try {
                var decoded = jwt.verify(token, key, {algorithms: ['HS256']});
                req.token_claims = decoded;
                console.log("token valid");
                return true;
            } catch(err) {
                console.error("Invalid token", err.message, req.originalUrl);
                res.status(401).json({err:"Unauthorized"});
                res.end();
                return false;
            }
        }
        else {
            console.log("No security required");
            return true;
        }
    }
}
export default Server;