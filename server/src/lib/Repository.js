import DB from './DB.js';
class Repository {
    constructor() {
       this.DB = null; 
    }
    browse(filter) {
        return false;
    }
    read(id) {
        return false;
    }
    edit(id, entityData) {
        return false;
    }
    add(entityData) {
        return false;
    }
    delete(id) {
        return false;
    }

    get db() {
        if(this.DB === null) {
            this.DB = new DB();
        }
        return this.DB;
    }
    set db(db) {
        this.DB = db;
    }
}
export default Repository;