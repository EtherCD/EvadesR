export default class MaxContainer {
	cur: number;
	max: number;

	constructor(cur: number, max: number) {
		this.cur = cur;
		this.max = max;
	}

	accept(cur?: number, max?: number) {
		this.cur = cur ?? this.cur;
		this.max = max ?? this.max;
	}
}
