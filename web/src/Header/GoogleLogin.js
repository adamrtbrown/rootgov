import Component from "../lib/common/Component.js";
class GoogleLogin extends Component{
    constructor(parent) {
        super(parent);
        this.googleAltText = this.t("GOOGLE_LOGIN");
        this.gauth = null;
        this.initNode();
    }
    
    init() {
        this.initGoogle();
        this.node.addEventListener("click", (e) => {this.signIn();});
    }
    get html() {
        return `

        <div class="LoginButton" tabindex="0">
            <img src="https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png" alt="${this.googleAltText}" />
        </div>

        `.trim();
    }

    set ga(gauth) {
        this.gauth = gauth;
    }
    get ga() {
        return this.gauth;
    }

    async signIn() {
        this.ga = window.gapi.auth2.getAuthInstance();
        try {
            let googleUser = await this.ga.signIn(); 
            const { id_token, expires_at } = googleUser.getAuthResponse();
            await this.parent.updateAuthState();
        } catch(err) {
            console.log("Exception", err);
        };
    }

    signOut() {
        this.ga.signOut();
    }

    initGoogle() {
        const ga = window.gapi && window.gapi.auth2 ?
          window.gapi.auth2.getAuthInstance() :
          null;
        if (!ga) {
            this.createScript();
        }
    }

    createScript() {
        // load the Google SDK
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        
        script.addEventListener("load",() => {this.initGapi()});
        document.body.appendChild(script);
    }
  
    async initGapi() {
        // init the Google SDK client
        const g = window.gapi;
        g.load('auth2', async () => {
            g.auth2.init({
                client_id: window.env.GOOGLE_APP_ID,
                // authorized scopes
                scope: 'profile email openid'
            });
            let gauth = await g.auth2.getAuthInstance();
            this.ga = gauth;
            if(gauth.isSignedIn.get()) {
                this.parent.updateAuthState();
            }
            
        });
    }
 } 
export default GoogleLogin;