import argon2 from "argon2";

export const hashPassword = async (password: string) => {
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 1024 * 20,
		timeCost: 2,
		parallelism: 1,
	});
};

export const verifyPassword = async (hash: string, password: string) => {
	return await argon2.verify(hash, password);
};
