import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, LoginProps, RegisterProps } from "../api/types";
import { ApiRequests } from "../api/requests";

export interface AuthState {
  token: string;
  valid: boolean;
  profile?: Profile;

  validate: (token: string) => void;
  login: (obj: LoginProps) => Promise<string>;
  register: (obj: RegisterProps) => Promise<string>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: "",
      valid: false,
      validate: async (token: string) => {
        if (token.length === 0) return;
        const response = await ApiRequests.check(token);

        if (response.successful) set({ valid: response.data.valid });
      },
      register: async (obj) => {
        const response = await ApiRequests.register(obj);

        if (response.successful) {
          set({
            valid: response.successful,
            token: response.data.token,
            profile: response.data.profile,
          });
          return "";
        }
        return response.data.message;
      },
      login: async (obj) => {
        const response = await ApiRequests.login(obj);

        if (response.successful) {
          set({
            valid: response.successful,
            token: response.data.token,
            profile: response.data.profile,
          });
          return "";
        }
        return response.data.message;
      },
      logout: () => {
        set({ token: "", valid: false });
      },
    }),
    {
      name: "token",
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        state.valid = false;
        state.validate(state.token);
      },
    }
  )
);
