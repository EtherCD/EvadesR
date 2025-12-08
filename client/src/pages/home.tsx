import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/basic/button";
import { useAuthStore } from "../stores/auth";
import { Game } from "../components/game";
import { useGameStore } from "../stores/game";

export const Home = () => {
  const auth = useAuthStore();

  const [inGame, setInGame] = useState(false);
  const game = useGameStore();

  useEffect(() => {
    setInGame(game.isGameInit);
  }, [game.isGameInit]);

  if (inGame) {
    return <Game />;
  }

  return (
    <main
      className={
        "min-h-screen w-full flex flex-col gap-1 justify-center items-center text-center text-2xl"
      }
    >
      <h1 class={"text-5xl border-b-2"}>Evades.R</h1>
      <p class={"text-2xl"}>Welcome {auth.profile?.username}</p>
      <div className={"flex w-20 flex-col gap-0.5"}>
        <div className={"flex gap-0.5"}>
          <Button
            onClick={() => {
              setInGame(true);
            }}
          >
            Play
          </Button>
          <Button onClick={auth.logout}>Profile</Button>
        </div>
        <div className={"flex gap-0.5"}>
          <Button onClick={() => {}}>Accessories</Button>
          <Button onClick={auth.logout}>Logout</Button>
        </div>
      </div>
      <div class={"p-1 block w-15 font-bold border-2 rounded-xl "}>
        <h1>Warning!</h1>
        <p className={"text-yellow-300"}>
          This project written 4 days. May contain bugs.
        </p>
      </div>
    </main>
  );
};
