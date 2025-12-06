import { useState } from "preact/hooks";
import { Button } from "../components/Basic/Button";
import { Login } from "./Login";
import { AuthenticationService } from "../core/services/auth";
import { Game } from "../components/Game";
import { useService } from "../hooks/useService";

export const Home = () => {
	const loginState = useService(AuthenticationService);
	const [inGame, setInGame] = useState(false);

	return (
		<div className={"flex flex-col justify-center items-center min-h-screen w-full text-base"}>
			{loginState.username.length === 0 ? (
				<Login />
			) : (
				<>
					{" "}
					{inGame ? (
						<Game />
					) : (
						<div className={"text-5xl items-center flex flex-col gap-1"}>
							<h1>Evades R</h1>
							<Button
								onClick={() => {
									setInGame(true);
								}}
							>
								Играть
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
