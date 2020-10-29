import Component from './lib/common/Component.js';
import Header from './Header/Header.js';
class Root extends Component {
    constructor(parent, application) {
        super(parent, application);

        this.header = new Header(this);
        this.initNode();
    }

    get html() {
        return `
        <div class="App"></div>
        `.trim();
    }

    init() {
        this.node.appendChild(this.header.node);
    }

    loginEvent() {

    }

    logoutEvent() {
        
    }
}

export default Root;