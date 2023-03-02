import fs from 'fs';
import __dirname from '../../utils.js';

export default class Users {
    constructor () {
        this.path = `${__dirname}/files/users.json`
        this.init();
    };

    init = async () => {
        if (!fs.existsSync(this.path)) await fs.promises.writeFile(this.path, JSON.stringify([]));
    };

    get = async () => {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    };

    getBy = async (params) => {
        const users = await this.get();
        const keys = Object.keys(params);
        const result = users.find( user => {
            let flag = true;
            keys.forEach( param => {
                if(params[param] !== user[param]){
                    flag = false;
                };
            });
            return flag;
        });
        return result;
    };

    save = async (user) => {
        const users = await this.get();
        user.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2));
        return user;
    };

}