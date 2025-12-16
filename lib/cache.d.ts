export declare class Cache {
    private cache;
    private ttlSeconds;
    constructor(ttlSeconds?: number);
    private purge;
    setItem(key: string, data: any): void;
    getItem(key: string): any;
}
