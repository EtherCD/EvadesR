import { useState } from "preact/hooks";
import { TextField } from "../components/Basic/TextField";
import { Button } from "../components/Basic/Button";
import { AuthenticationService } from "../core/services/auth";

export function Login() {
	const [username, setUsername] = useState<string>("");
	const [error, setError] = useState<string>("");

	const validate = (event: Event) => {
		event.preventDefault();
		if (username.length == 0) {
			setError("Поле с псевдонимом должно быть заполнено");
			return;
		}
		if (username.length >= 24) {
			setError("Псевдоним слишком длинный");
			return;
		}
		setError("");
		AuthenticationService.login(username);
	};

	return (
		<form className={"flex flex-col items-center gap-1"}>
			<h1 className={"text-3xl"}>Evades R</h1>
			<TextField
				placeholder={""}
				onInput={(value) => {
					setUsername(value);
				}}
			></TextField>
			{error.length !== 0 && <span className={"p-1 mt-0.5 text-left block mb-1 font-bold"}>{error}</span>}
			<Button onClick={validate}>Войти</Button>
		</form>
	);
}
