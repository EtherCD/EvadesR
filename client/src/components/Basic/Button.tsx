import type { ComponentChildren } from "preact";

interface Props {
	children: ComponentChildren;
	onClick: (event: Event) => void;
}

export function Button(props: Props) {
	return (
		<button className={"p-0.5 border-2 min-w-10 bg-(--window-bg) text-base rounded-xl"} onClick={props.onClick}>
			{props.children}
		</button>
	);
}
