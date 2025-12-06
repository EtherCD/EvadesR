interface Auth {
	username: string;
}

interface Storage {
	auth: Auth;
	locale: { language: string };
}

export class LocalStorageService {
	public static set<K extends keyof Storage>(key: K, value: Storage[K]) {
		localStorage.setItem(key, JSON.stringify(value));
	}

	public static get<K extends keyof Storage>(key: K): Storage[K] | undefined {
		const value = localStorage.getItem(key);
		if (!value) return undefined;
		return JSON.parse(value) ?? undefined;
	}

	public static reset<K extends keyof Storage>(key: K) {
		localStorage.removeItem(key);
	}
}
