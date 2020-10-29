import './env.js';
import './constants.js'
import App from "./src/lib/common/App.js";
import ABCIAMClient from './src/lib/ABCIAMClient.js';
import Language from './lang/language.js';
import Root from './src/Root.js';

window.addEventListener("DOMContentLoaded", (e) => {
    
    let config = {
        auth : new ABCIAMClient({url: window.env.API_URL}),
        language: new Language("en", "CA"),
    }
    let app = new App(config);
    let root = new Root(null, app);
    document.body.appendChild(root.node);

    if(window.env.gApp !== undefined) {window.env.gApp = root};
});

//window.addEventListener("keyup",(e)=>{console.log("key", document.activeElement)});