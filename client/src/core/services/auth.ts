import createStore, { type Listener } from "unistore";
import { LocalStorageService } from "./localStorage";
import type { AuthenticationState } from "./types";

export class AuthenticationService {
	private static store = createStore<AuthenticationState>({
		isAuthenticated: false,
		username: "",
	});

	public static login(username: string) {
		LocalStorageService.set("auth", { username });
		AuthenticationService.store.setState({
			isAuthenticated: true,
			username,
		});
	}

	public static authenticate() {
		const auth = LocalStorageService.get("auth");
		AuthenticationService.store.setState({
			isAuthenticated: auth !== undefined && auth.username !== null,
			username: auth?.username ?? "",
		});
	}

	public static logout() {
		LocalStorageService.reset("auth");
		AuthenticationService.store.setState({
			isAuthenticated: false,
		});
	}

	public static get state(): AuthenticationState {
		return AuthenticationService.store.getState();
	}

	static on(f: Listener<AuthenticationState>) {
		AuthenticationService.store.subscribe(f);
	}

	static off(f: Listener<AuthenticationState>) {
		AuthenticationService.store.unsubscribe(f);
	}
}
