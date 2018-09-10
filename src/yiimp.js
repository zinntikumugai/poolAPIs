process.on('unhandledRejection', console.dir);
const util = require('./util.js');
class YIIMP {
    constructor(host) {
        this.host = host + '/api/';
    }

    pipe(url) {
        return new Promise(async (resolve, reject) => {
            let data = await util.asyncGet(url);
            if (!data.response && !data.body)
                return;
                console.log(data.body);
            resolve(JSON.parse(data.body));
        });
    }

    wallet(address) {
        return new Promise(async(resolve, reject)=>{
            if(!address)
                reject('Missing Address');
            resolve(this.pipe(this.host + 'wallet?address=' + address));
        });
    }

    status() {
        return new Promise(async(resolve, reject)=>{
            let data = this.pipe(this.host + 'status')
            resolve(data);
        });
    }

    currencies() {
        return new Promise(async (resolve, reject) => {
            let data = this.pipe(this.host + 'currencies')
            resolve(data);
        });
    }
}

module.exports = YIIMP;