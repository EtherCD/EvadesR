import { Link, useParams } from "wouter";
import { AccountRole } from "shared";
import { useEffect, useState } from "preact/hooks";
import { ApiRequests } from "../api/requests";
import type { Profile } from "../api/types";

export const ProfilePage = () => {
  const params = useParams();
  const [profile, setProfile] = useState<Profile>();

  const styleForBg = () => {
    if (profile) {
      if (profile.role === AccountRole.Dev)
        return "text-[#fff] bg-linear-to-br from-[#008080] via-[#66b2b2] to-[#004C4C]";
      if (profile.role === AccountRole.MapMaker)
        return "text-[#fff] bg-linear-to-br from-[#005B96] via-[#6497b1] to-[#011f4b]";
    }
  };

  useEffect(() => {
    const fetch = async () => {
      setProfile((await ApiRequests.profile(params[0] + "")).data.profile);
    };
    fetch();
  }, []);

  const role = () => {
    if (profile) {
      if (profile.role === AccountRole.Dev) return "Dev";
      if (profile.role === AccountRole.MapMaker) return "Map Maker";
    }
  };

  if (profile)
    return (
      <div
        className={
          "flex flex-col justify-center items-center h-screen w-screen gap-1"
        }
      >
        <div
          className={
            "p-1 flex flex-col bg-(--window-bg) rounded-2xl gap-0.5 w-20 " +
            styleForBg()
          }
        >
          <div className={"flex gap-1  text-3xl flex-col "}>
            <h1 className={"font-semibold"}>Username: {profile.username}</h1>
            {profile.role !== AccountRole.None && <p>Role: {role()}</p>}
            <p>VP: {profile.vp}</p>
          </div>
        </div>

        <Link href={"/"} className={"text-2xl"}>
          Back to home
        </Link>
      </div>
    );
};
