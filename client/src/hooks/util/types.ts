import type { Listener } from "unistore";

export interface Service<T> {
	on: (f: Listener<T>) => void;
	off: (f: Listener<T>) => void;
	state: T;
}
