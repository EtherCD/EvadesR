import { useEffect, useRef, useState } from "preact/hooks";
import { useGameStore } from "../stores/game";
import { useResize } from "../stores/resize";
import { useKeyboard } from "../stores/keyboard";
import { webSocketConnection } from "../game/connection";
import { keyboardEvents } from "../game/events/keyboard";

export function useChat() {
  const { messages } = useGameStore();
  const resize = useResize();

  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isScrolledToBottom, setScrolled] = useState<boolean>();

  const onScroll = (event: UIEvent) => {
    const element = event.target as HTMLDivElement;
    setScrolled(
      element.scrollHeight - element.clientHeight <= element.scrollTop + 1
    );
    if (isScrolledToBottom) scrolledToBottom();
  };

  const onFocus = () => {
    useKeyboard.getState().setChatting(true);
  };

  const onBlur = () => {
    useKeyboard.getState().setChatting(false);
  };

  const scrolledToBottom = () => {
    const chatMessages = chatMessagesRef.current;
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const onEnter = (isChatting: boolean) => {
    if (!inputRef.current) return;
    const input = inputRef.current;
    if (isChatting) {
      input.value !== "" && webSocketConnection.sendMessage(input.value);
      input.value = "";
      input.blur();
    } else {
      input.focus();
    }
  };

  useEffect(() => {
    keyboardEvents.on("enter", onEnter);
    return () => {
      keyboardEvents.off("enter", onEnter);
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
