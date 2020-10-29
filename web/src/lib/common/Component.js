class Component {
    constructor(parent, application = null) {
        /*
        this.testVariableValue = "";
        this.testVariableNode = null;
        */
        this.node = null;
        this.application = application;
        this.parent = parent;
    }
    /*
    set testVariable(value) {
        this.testVariableNode.nodeValue = value;
    }
    get testVariable() {
        return this.testVariableNode.nodeValue;
    }
    */
    initNode() {
        let frag = document.createRange().createContextualFragment(this.html);
        this.node = frag.firstChild;
        this.init();
    }
    init(){
        console.log("parent init");
    }

    get app() {
        let returnApp = this.application;
        if(returnApp === null) {
            if(this.parent !== null) {
                returnApp = this.parent.app;
            }
        }
        if(returnApp === null) {
            throw new Error("Error: Must create an App.");
        }
        return returnApp;
    }

    get root() {
        if(this.parent === null) {
            return this;
        }
        return this.parent.root;;
    }

    t(identifier) {
        return this.app.translate(identifier);
    }

    request(config) {
        return this.app.request(config);
    }

    get html() {
        return ` `;
    }
    
}
export default Component;