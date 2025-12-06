import { LocalStorageService } from "../services/localStorage";

const translationsPath = "./translations/*.json";
const translationsPathLength = translationsPath.split("*")[0].length;

const loadTranslations = (): Translations => {
	const files: GlobModuleObject = import.meta.glob("../../assets/translations/*.json", {
		eager: true,
	});
	const filesName = Object.keys(files);
	const result: Translations = {};
	for (const i in filesName) {
		const value = filesName[i];
		const translationName = value.slice(translationsPathLength).split(".")[0];
		result[translationName] = async () => ({
			name: "Unknown lang",
			...files[value].default,
		});
	}
	return result;
};

export const setLangInLocalStorage = (value: string) => {
	if (translationsKeys.includes(value)) LocalStorageService.set("locale", { language: value });
};

const getLangFromLocalStorage = (): string => {
	const locale = LocalStorageService.get("locale");
	if (!locale || !locale.language + "" in translationsKeys) {
		setLangInLocalStorage(translationsKeys[0]);
		return translationsKeys[0] + "";
	}
	return locale.language;
};

export const getLangNames = async (): Promise<string[]> => {
	const translationPromises = Object.values(translations).map((value) => value().then((translation: Translation) => translation.name));

	return Promise.all(translationPromises);
};

export const translations = loadTranslations();
const translationsKeys = Object.keys(translations);
export const initialLanguage = getLangFromLocalStorage();

type Translations = Record<string, TranslationPromise>;
type GlobModuleObject = Record<string, { default: Record<string, string> }>;
type TranslationPromise = () => Promise<Translation>;
type Translation = {
	[key: string]: string;
	name: string;
};
