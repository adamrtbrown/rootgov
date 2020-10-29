import Component from "../lib/common/Component.js";

class Nav extends Component {
    constructor(parent) {
        super(parent);
        
        this.initNode();
    }

    get html() {
        return `<nav></nav>`;
    }

    init() {
        
    }

}
export default Nav