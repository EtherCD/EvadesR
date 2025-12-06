import { useEffect, useRef, useState } from "preact/hooks";
import { GameService } from "../core/services/game";
import { useServiceManual } from "./useServiceManual";
import { useService } from "./useService";
import { KeyboardService } from "../core/services/keyboard";
import { ResizeService } from "../core/services/resize";
import type { IChatMessage } from "../core/types";
import { WebSocketService } from "../core/services/websocket";

export function useChat() {
	const messages = useServiceManual<{ messages: Array<IChatMessage> }>(GameService.messagesState, GameService.onMessages, GameService.offMessages);
	const resize = useService(ResizeService);

	const chatMessagesRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isScrolledToBottom, setScrolled] = useState<boolean>();

	const onScroll = (event: UIEvent) => {
		const element = event.target as HTMLDivElement;
		setScrolled(element.scrollHeight - element.clientHeight <= element.scrollTop + 1);
		if (isScrolledToBottom) scrolledToBottom();
	};

	const onFocus = () => {
		KeyboardService.setChatting(true);
	};

	const onBlur = () => {
		KeyboardService.setChatting(false);
	};

	const scrolledToBottom = () => {
		const chatMessages = chatMessagesRef.current;
		if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
	};

	const onEnter = (isChatting: boolean) => {
		if (!inputRef.current) return;
		const input = inputRef.current;
		if (isChatting) {
			input.value !== "" && WebSocketService.sendMessage(input.value);
			input.value = "";
			input.blur();
		} else {
			input.focus();
		}
	};

	useEffect(() => {
		KeyboardService.onEmit("enter", onEnter);
		return () => {
			KeyboardService.offEmit("enter", onEnter);
		};
	}, []);

	const style = {
		transform: `scale(${resize.scale})`,
		left: 10 + resize.canvasLeft + "px",
		top: 10 + resize.canvasTop + "px",
		transformOrigin: "0% 0%",
	};

	return {
		messages,
		chatMessagesRef,
		inputRef,
		onScroll,
		onFocus,
		onBlur,
		style,
	};
}
