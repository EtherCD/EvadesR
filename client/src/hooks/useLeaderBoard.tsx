import { useEffect, useState } from "preact/hooks";
import { GameService } from "../core/services/game";
import { useServiceManual, useServiceManualValue } from "./useServiceManual";
import { useService } from "./useService";
import { ResizeService } from "../core/services/resize";

interface PlayerInLeaderBoard {
	area: number;
	name: string;
	died: boolean;
	timer: number;
	self: boolean;
}

interface OutObject {
	name: string;
	color: string;
	players: Array<PlayerInLeaderBoard>;
}

export function useLeaderBoard() {
	const players = useServiceManual(GameService.playersState, GameService.onPlayers, GameService.offPlayers);
	const self = useServiceManualValue(GameService.selfIdState, GameService.onSelfId, GameService.offSelfId);
	const resize = useService(ResizeService);
	const [worldList, setWorldList] = useState<Array<OutObject>>([]);

	const sortPlayers = () => {
		let a = Object.values(players ?? []).sort((v1, v2) => {
			return (
				(v1.world === players[self.id].world
					? v2.world === players[self.id].world
						? v2.area - v1.area
						: -1
					: v2.world === players[self.id].world
					? v1.world === players[self.id].world
						? v2.area - v1.area
						: 1
					: 0) ||
				(v1.world === v2.world ? 0 : v1.world > v2.world ? 1 : -1) ||
				v2.area - v1.area
			);
		});
		return a;
	};

	const make = () => {
		let outObject: Array<OutObject> = [];
		sortPlayers().forEach((element) => {
			let color;
			color = "white";

			let playersTo: PlayerInLeaderBoard = {
				area: element.area,
				name: element.name,
				died: element.died ?? false,
				timer: element.dt ?? -1,
				self: element === players[self.id],
			};
			let tryFind = outObject.find((v, i, o) => v.name === element.world);
			if (tryFind) {
				tryFind.players.push(playersTo);
			} else {
				outObject.push({
					name: element.world,
					color: color,
					players: [playersTo],
				});
			}
		});
		return outObject;
	};

	useEffect(() => {
		setWorldList(make());
	}, [players]);

	const style = {
		transform: `scale(${resize.scale})`,
		right: resize.canvasLeft + 10 + "px",
		top: resize.canvasTop + 10 + "px",
		transformOrigin: "100% 0%",
	};

	return { worldList, style };
}
