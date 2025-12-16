const cache = {};
export class Cache {
    cache;
    ttlSeconds;
    constructor(ttlSeconds = 3600) {
        this.cache = {};
        this.ttlSeconds = ttlSeconds;
    }
    purge() {
        Object.entries(this.cache).forEach(item => {
            if (item[1].ts + this.ttlSeconds >= (new Date().getTime() * 1000)) {
                delete this.cache[item[0]];
            }
        });
    }
    setItem(key, data) {
        this.purge();
        let ts = new Date().getTime() * 1000;
        this.cache[key] = {
            ts: ts,
            data: data
        };
    }
    getItem(key) {
        this.purge();
        let item = this.cache[key];
        return item ? item['data'] : undefined;
    }
}
