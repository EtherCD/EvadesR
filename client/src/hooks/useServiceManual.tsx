import { useEffect, useState } from "preact/hooks";
import type { Listener, Store } from "unistore";
import { arraysEqual } from "./useService";

export const useServiceManual = <T extends object>(state: T, on: (listener: Listener<T>) => void, off: (listener: Listener<T>) => void): T => {
	const [currentState, setState] = useState<T>(state);

	useEffect(() => {
		let oldState = currentState;
		const sub = (newState: T) => {
			if (!arraysEqual(Object.values(oldState), Object.values(newState))) setState(newState);
			oldState = newState;
		};

		on(sub);

		return () => {
			off(sub);
		};
	}, []);

	return currentState;
};

export const useServiceManualValue = <T extends object>(state: T, on: (listener: Listener<T>) => void, off: (listener: Listener<T>) => void): T => {
	const [currentState, setState] = useState<T>(state);

	useEffect(() => {
		let oldState = state;
		const sub = (newState: T) => {
			if (!arraysEqual(Object.values(oldState), Object.values(newState))) setState(newState);
			oldState = newState;
		};

		on(sub);

		return () => {
			off(sub);
		};
	}, []);

	return currentState;
};
