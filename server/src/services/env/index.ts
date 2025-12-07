import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string, fallback?: string): string {
	const value = process.env[key];
	if (value === undefined) {
		if (fallback !== undefined) return fallback;
		throw new Error(`Missing required env variable: ${key}`);
	}
	return value;
}

export const Env = {
	port: Number(getEnv("PORT", "8080")),
	tickRate: Number(getEnv("TICK_RATE", "60")),
	storagePath: getEnv("STORAGE_PATH", "storage"),
	worldsPath: getEnv("WORLDS_PATH", "worlds"),
	logPath: getEnv("LOG_PATH", "logs"),
	databaseFile: getEnv("DATABASE_FILE", "database.sqlite"),
	dev: getEnv("NODE_ENV", "dev") === "dev",
};
