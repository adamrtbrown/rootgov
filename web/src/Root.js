import Component from './lib/common/Component.js'
class Root extends Component {
    constructor(parent, application) {
        super(parent, application);

        this.initNode();
    }

    get html() {
        return `
        <div>Hello World</div>
        `.trim();
    }

    init() {

    }
}

export default Root;