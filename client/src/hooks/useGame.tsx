import { useEffect, useRef, useState } from "preact/hooks";
import { MouseService } from "../core/services/mouse";
import { ResizeService } from "../core/services/resize";
import { GameService } from "../core/services/game";
import { Render } from "../core/render";
import { Services } from "../core/services";
import { KeyboardService } from "../core/services/keyboard";

export function useGame() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D>();

	useEffect(() => {
		if (canvasRef.current) {
			resize();
			contextRef.current = canvasRef.current.getContext("2d") ?? undefined;
			render();
		}
	}, [canvasRef.current]);

	const resize = () => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			let s = window.innerWidth / canvas.width;
			if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
				s = window.innerHeight / canvas.height;
			}
			canvas.style.transform = `scale(${s})`;
			canvas.style.left = (1 / 2) * (window.innerWidth - canvas.width) + "px";
			canvas.style.top = (1 / 2) * (window.innerHeight - canvas.height) + "px";
			const canvasRect = canvas.getBoundingClientRect();

			ResizeService.resize(s, canvas, canvasRect);
		}
	};
	const render = () => {
		requestAnimationFrame(render);
		if (!GameService.state.isGameInited) return;
		Render.render(canvasRef.current!, contextRef.current!);
	};

	useEffect(() => {
		window.onresize = resize;

		Services.initGame();

		window.addEventListener("keydown", KeyboardService.keyboardEvent);
		window.addEventListener("keyup", KeyboardService.keyboardEvent);
		// document.addEventListener("blur", removeInput);
		// canvasRef.current!.addEventListener('blur', removeInput);
		canvasRef.current!.addEventListener("mousedown", MouseService.mouseEvent);
		canvasRef.current!.addEventListener("mouseup", MouseService.mouseEvent);
		canvasRef.current!.addEventListener("mousemove", MouseService.mouseEvent);

		return () => {
			Services.deInitGame();
			// document.removeEventListener("resize", updateSize);
			window.removeEventListener("keydown", KeyboardService.keyboardEvent);
			window.removeEventListener("keyup", KeyboardService.keyboardEvent);
			// canvasRef.current!.removeEventListener('blur', removeInput);
			canvasRef.current!.removeEventListener("mousedown", MouseService.mouseEvent);
			canvasRef.current!.removeEventListener("mouseup", MouseService.mouseEvent);
			canvasRef.current!.removeEventListener("mousemove", MouseService.mouseEvent);
			// cancelAnimationFrame(animationId);
		};
	}, []);

	return canvasRef;
}
