import { useGame } from "../../hooks/useGame";
import { Chat } from "./Chat";
import style from "./index.module.css";
import { LeaderBoard } from "./LeaderBoard";

export function Game() {
	const canvasRef = useGame();

	return (
		<div className={style.game}>
			<canvas width={1280} height={720} ref={canvasRef}></canvas>
			<LeaderBoard></LeaderBoard>
			<Chat></Chat>
		</div>
	);
}
