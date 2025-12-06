import { useEffect } from "preact/hooks";
import { Home } from "./pages/Home";
import { Services } from "./core/services";

export function App() {
	useEffect(() => {
		Services.init();
	});

	return (
		<>
			<Home></Home>
		</>
	);
}
