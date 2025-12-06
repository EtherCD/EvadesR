import createStore, { type Listener } from "unistore";
import type { KeyboardState } from "./types";
import mitt, { type Handler } from "mitt";

type value = "up" | "down" | "right" | "shift" | "left" | "upgrade_speed" | "upgrade_energy" | "upgrade_regen" | "upgrade_firstAb" | "upgrade_secondAb" | "first" | "second";

export const keyCodes: Record<string, value> = {
	KeyW: "up",
	KeyS: "down",
	KeyA: "left",
	KeyD: "right",
	Digit1: "upgrade_speed",
	Digit2: "upgrade_energy",
	Digit3: "upgrade_regen",
	Digit4: "upgrade_firstAb",
	Digit5: "upgrade_secondAb",
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	ShiftLeft: "shift",
	ShiftRight: "shift",
	KeyZ: "first",
	KeyX: "second",
};

export type Events = {
	down: value;
	up: value;
	enter: boolean;
};

export class KeyboardService {
	private static store = createStore<KeyboardState>({
		isChatting: false,
		left: false,
		up: false,
		right: false,
		down: false,
		shift: false,
	});
	private static emitter = mitt<Events>();

	public static setChatting(value: boolean) {
		KeyboardService.store.setState({ isChatting: value });
	}

	public static keyboardEvent(event: KeyboardEvent) {
		if (keyCodes[event.code] && !KeyboardService.state.isChatting) {
			KeyboardService.emitter.emit(event.type === "keydown" ? "down" : "up", keyCodes[event.code]);
			KeyboardService.store.setState({
				[keyCodes[event.code]]: event.type === "keydown",
			});
		}
		if (event.code === "Enter" && event.type === "keydown") {
			const isChatting = KeyboardService.state.isChatting;
			if (isChatting) KeyboardService.clearMovement();
			KeyboardService.emitter.emit("enter", isChatting);
		}
	}

	public static clearMovement() {
		let state = KeyboardService.state;
		for (const i in state) {
			if (i !== "isChatting" && state[i]) {
				KeyboardService.emitter.emit("up", i as value);
				state[i] = false;
			}
		}
		KeyboardService.store.setState(state);
	}

	public static get state(): KeyboardState {
		return KeyboardService.store.getState();
	}

	static on(f: Listener<KeyboardState>) {
		KeyboardService.store.subscribe(f);
	}

	static off(f: Listener<KeyboardState>) {
		KeyboardService.store.unsubscribe(f);
	}

	static onEmit<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
		KeyboardService.emitter.on(type, handler);
	}

	static offEmit<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
		KeyboardService.emitter.off(type, handler);
	}
}
