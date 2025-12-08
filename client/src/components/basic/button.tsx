import type { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  onClick: (event: Event) => void;
}

export function Button(props: Props) {
  return (
    <button
      className={
        "pl-1 pr-1 pt-0.5 pb-0.5 border-2  w-full bg-(--window-bg) text-2xl rounded-xl hover:opacity-50 transition-opacity"
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
