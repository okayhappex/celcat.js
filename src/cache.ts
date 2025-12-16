interface CacheItem {
    ts: number,
    data: any
}

const cache: Record<string, CacheItem> = {}

export class Cache {
    private cache: Record<string, CacheItem>
    private ttlSeconds: number

    constructor(ttlSeconds: number =3600) {
        this.cache = {}
        this.ttlSeconds = ttlSeconds
    }

    private purge() {
        Object.entries(this.cache).forEach(item => {
            if (item[1].ts + this.ttlSeconds >= (new Date().getTime() * 1000)) {
                delete this.cache[item[0]]
            }
        });
    }

    public setItem(key: string, data: any) {
        this.purge()

        let ts = new Date().getTime() * 1000

        this.cache[key] = {
            ts: ts,
            data: data
        }
    }

    public getItem(key: string) {
        this.purge()
        let item = this.cache[key]

        return item ? item['data'] : undefined
    }
}