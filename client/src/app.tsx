import { Route, Router } from "wouter";
import { Login } from "./pages/login";
import { Home } from "./pages/home";
import { useEffect } from "preact/hooks";
import { navigate } from "wouter/use-browser-location";
import { useAuthStore } from "./stores/auth";
import { Register } from "./pages/register";

export const App = () => {
  const auth = useAuthStore();
  useEffect(() => {
    if (!auth.valid) navigate("/login");
    else navigate("/");
  }, [auth.valid]);
  return (
    <Router>
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
    </Router>
  );
};
