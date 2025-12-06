import createStore, { type Listener } from "unistore";
import type { ResizeState } from "./types";

export class ResizeService {
	private static store = createStore<ResizeState>({
		scale: 1,
		canvasLeft: 0,
		canvasTop: 0,
		canvasWidth: 0,
		canvasHeight: 0,
	});

	static resize(scale: number, canvas: HTMLCanvasElement, rect: DOMRect) {
		ResizeService.store.setState({
			scale: scale,
			canvasLeft: rect.left,
			canvasTop: rect.top,
			canvasWidth: canvas.width,
			canvasHeight: canvas.height,
		});
	}

	public static get state(): ResizeState {
		return ResizeService.store.getState();
	}

	static on(f: Listener<ResizeState>) {
		ResizeService.store.subscribe(f);
	}

	static off(f: Listener<ResizeState>) {
		ResizeService.store.unsubscribe(f);
	}
}
