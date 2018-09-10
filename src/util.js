const request = require('request');
class Util {
    constructor() {

    }

    static get(url, call) {
        let header = {
            'Content-Type': 'application/json'
        }
        let option = {
            url: url,
            method: 'GET',
            headers: header
        }
        request(option, call);
    }

    static asyncGet(url) {
        return new Promise(async(resolve, reject) => {
            Util.get(url, async(err, res, body) => {
                resolve({
                    error: err,
                    response: res,
                    body: body
                });
            });
        });
    }
}
module.exports = Util;