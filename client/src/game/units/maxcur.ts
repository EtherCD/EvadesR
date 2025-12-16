export default class MaxContainer {
	cur: number;
	max: number;

	constructor(cur: number, max: number) {
		this.cur = cur  / 10;
		this.max = max  / 10;
	}

	accept(cur?: number, max?: number) {
		this.cur = cur ?? this.cur / 10;
		this.max = max ?? this.max / 10;
	}
}
