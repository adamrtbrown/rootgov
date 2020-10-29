import Server from './lib/Server.js';
class AppServer extends Server {
    constructor(config){
        super(config)
    } 
    routeSecurity(route) {
        const routes = [
            //"/route",
        ];
        if( routes.find( (element) => {console.log(String(route).indexOf(element)); return String(route).indexOf(element) !== -1} ) ) {
            return true;
        }
        return false;
    }
}
export default AppServer