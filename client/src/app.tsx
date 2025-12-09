import { Route, Router } from "wouter";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { useEffect } from "preact/hooks";
import { navigate } from "wouter/use-browser-location";
import { useAuthStore } from "./stores/auth";
import { Register } from "./pages/register";
import { Suspense } from "preact/compat";
import { Profile } from "./pages/profile";

export const App = () => {
  const auth = useAuthStore();
  useEffect(() => {
    if (!auth.valid) navigate("/login");
  }, [auth.valid]);
  return (
    <Suspense fallback={"Haha"}>
      <Router>
        <Route path={"/"} component={Home} />
        <Route path={"/login"} component={Login} />
        <Route path={"/register"} component={Register} />
        <Route path={"/profile"} component={Profile} />
      </Router>
    </Suspense>
  );
};
