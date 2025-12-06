import mitt, { type Handler, type WildcardHandler } from "mitt";
import createStore, { type Listener } from "unistore";
import type { MouseState } from "./types";
import { ResizeService } from "./resize";

export type Events = {
	move: { x: number; y: number };
	enable: boolean;
};

export class MouseService {
	public static emitter = mitt<Events>();
	private static store = createStore<MouseState>({
		enable: false,
	});

	public static mouseEvent(e: MouseEvent) {
		if (e.type === "mousemove") {
			const resize = ResizeService.state;
			if (MouseService.store.getState().enable)
				MouseService.emitter.emit("move", {
					x: (e.pageX - resize.canvasLeft) / resize.scale - resize.canvasWidth / 2,
					y: (e.pageY - resize.canvasTop) / resize.scale - resize.canvasHeight / 2,
				});
		}
		if (e.type === "mousedown") {
			if (e.buttons == 1) {
				let enable = !MouseService.store.getState().enable;
				MouseService.emitter.emit("enable", enable);
				MouseService.store.setState({ enable });
			}
		}
		if (e.type === "mouseup") {
			// state.enable = !state.enable;
		}
	}

	public static get state(): MouseState {
		return MouseService.store.getState();
	}

	static on(f: Listener<MouseState>) {
		MouseService.store.subscribe(f);
	}

	static off(f: Listener<MouseState>) {
		MouseService.store.unsubscribe(f);
	}

	static onEmit<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
		MouseService.emitter.on(type, handler);
	}

	static offEmit<K extends keyof Events>(type: K, handler: Handler<Events[K]>) {
		MouseService.emitter.off(type, handler);
	}
}
