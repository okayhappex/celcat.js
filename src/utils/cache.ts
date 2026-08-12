interface CacheItem<T> {
	ts: number;
	data: T;
}

export class Cache {
	private cache: Record<string, CacheItem<unknown>> = {};
	private readonly ttlSeconds: number;

	constructor(ttlSeconds = 3600) {
		this.ttlSeconds = ttlSeconds;
	}

	private purge(): void {
		const now = Date.now();

		for (const [key, item] of Object.entries(this.cache)) {
			const ageSeconds = (now - item.ts) / 1000;

			if (ageSeconds >= this.ttlSeconds) {
				delete this.cache[key];
			}
		}
	}

	setItem<T>(key: string, data: T): void {
		this.purge();

		this.cache[key] = {
			ts: Date.now(),
			data,
		};
	}

	getItem<T>(key: string): T | undefined {
		this.purge();

		const item = this.cache[key];

		return item ? (item.data as T) : undefined;
	}

	deleteItem(key: string): void {
		delete this.cache[key];
	}

	clear(): void {
		this.cache = {};
	}
}
