interface Props {
	placeholder: string;
	value?: string;
	onInput: (value: string) => void;
	min?: number;
	max?: number;
	type?: "text" | "number";
	defaultValue?: string;
}

export function TextField(props: Props) {
	return (
		<input
			type={props.type ?? "text"}
			className={"w-10 p-0.5 bg-(--window-bg) outline-1 text-base  rounded-xl"}
			value={props.value}
			placeholder={props.placeholder}
			onInput={(event) => props.onInput(event.currentTarget.value)}
			defaultValue={props.defaultValue}
			minLength={props.min}
			maxLength={props.max}
			min={props.min}
			max={props.max}
		/>
	);
}
