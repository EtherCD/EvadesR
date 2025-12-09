import { useAuthStore } from "../stores/auth";

export const Profile = () => {
  const { profile } = useAuthStore();

  if (profile)
    return (
      <>
        <h1>{profile.username}</h1>
        <p>VP: {profile.vp}</p>
      </>
    );
};
