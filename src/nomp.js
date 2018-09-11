const util = require('./util.js');
const eventsource = require('eventsource');

class NOMP {
    constructor(host) {
        this.host = host;
    }

    status() {
        return new Promise(async (resolve, reject) => {
            let data = await util.asyncGet(this.host + '/api/stats');
            let res = data.response;
            let body = data.body;
            if (!res && !body) {
                return null;
            }
            body = JSON.parse(body);
            let algos = [];
            Object.keys(body.algos).forEach(key => {
                algos[key] = body.algos[key];
            });
            let pools = [];
            Object.keys(body.pools).forEach(key => {
                pools[key] = body.pools[key];
            })
            data = {
                time: body.time,
                pool: body.global,
                algos: algos,
                pools: pools
            }
            resolve(data);
        });
    }

    blocks() {
        return new Promise(async (resolve, reject) => {
            let data = await util.asyncGet(this.host + '/api/blocks');
            if (!data.response && !data.body)
                return;
            let body = JSON.parse(data.body);
            data = [];
            let counter = [];
            Object.keys(body).forEach(bodyKey => {
                let bodyKeySplit = bodyKey.split('-');
                let dataSplit = body[bodyKey].split(':');

                if (!data[bodyKeySplit[0]])
                    data[bodyKeySplit[0]] = [];
                if (!counter[bodyKeySplit[0]])
                    counter[bodyKeySplit[0]] = 0;

                data[bodyKeySplit[0]][counter[bodyKeySplit[0]]++] = {
                    name: bodyKeySplit[0],
                    blockHash: dataSplit[0],
                    transaction: dataSplit[1],
                    block: dataSplit[2],
                    minerAddress: dataSplit[3].split('.')[0],
                    minerAddressStr: dataSplit[3],
                    timeRaw: dataSplit[4],
                    unixTime: dataSplit[4].slice(0, -3)
                }
            });
            resolve(data);
        });
    }

    pool_stats() {
        return new Promise(async (resolve, reject) => {
            let data = await util.asyncGet(this.host + '/api/pool_stats');
            if (!data.response && !data.body)
                return;
            let body = JSON.parse(data.body);
            resolve(body);  //どう整形すればいいのかねぇ
        });
    }

    payments() {
        return new Promise(async (resolve, reject) => {
            let data = await util.asyncGet(this.host + '/api/payments');
            if (!data.response && !data.body)
                return;
            let body = JSON.parse(data.body);
            data = [];
            body.forEach(el => {
                let pending = [];
                el.pending.blocks.forEach(elb => {
                    let elbSplit = elb.split(':');
                    pending.push({
                        blockHash: elbSplit[0],
                        transaction: elbSplit[1],
                        block: elbSplit[2],
                        minerAddress: elbSplit[3].split('.')[0],
                        minerAddressStr: elbSplit[3],
                        timeRaw: elbSplit[4],
                        unixTime: elbSplit[4].slice(0, -3)
                    });
                });
                Object.keys(el.pending.confirms).forEach(key => {
                    pending.forEach(elb => {
                        if (elb.blockHash == key)
                            elb['confirms'] = el.pending.confirms[key];
                    });
                });
                data.push({
                    name: el.name,
                    pending: pending,
                    payments: el.payments
                });
            })
            resolve(data);
        })
    }

    worker_stats(address) {
        return new Promise(async (resolve, reject) => {
            if (!address)
                reject('Missing Address');
            let data = await util.asyncGet(thsi.host + '/api/worker_stats?' + address);
            if (!data.response && !data.body)
                return;
            let body = JSON.parse(data.body);
            resolve(body);
        });
    }

    live_stats() {
        let es = new eventsource(this.host + '/api/live_stats');
        es.on('open', () => {
            console.log('connected.');
        });
        es.on('message', e => {
            console.log(e);
        });
        es.on('error', e => {
            console.log(e);
        });
        //一つのデータがアホ
        //http://info-i.net/eventsource
    }
}
module.exports = NOMP;