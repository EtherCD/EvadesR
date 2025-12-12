import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/basic/button";
import { useAuthStore } from "../stores/auth";
import { Game } from "../components/game";
import { useGameStore } from "../stores/game";
import { useAssetsStore } from "../stores/assets";
import { useLocation } from "wouter";

export const Home = () => {
  const auth = useAuthStore();

  const [inGame, setInGame] = useState(false);
  const game = useGameStore();
  const assets = useAssetsStore();

  const [_, setLocation] = useLocation();

  useEffect(() => {
    useAssetsStore.getState().fetch();
    if (inGame == false) setInGame(game.isGameInit && assets.loaded);
  }, [game.isGameInit, assets.loaded]);

  if (inGame) {
    return <Game />;
  }

  return (
    <main
      className={
        "min-h-screen w-full flex flex-col gap-1 justify-center items-center text-center text-2xl"
      }
    >
      <img src="/favicon.svg" alt="" width={100} />
      <h1 class={"text-5xl border-b-2"}>Altverse</h1>
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
          <Button
            onClick={() => setLocation("profile/" + auth.profile?.username)}
          >
            Profile
          </Button>
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
