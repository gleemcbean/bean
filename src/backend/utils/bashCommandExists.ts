import { exec } from "node:child_process";

export default function bashCommandExists(command: string): Promise<boolean> {
	return new Promise((resolve) => {
		const cmd = (process.platform === "win32" ? "where " : "which ") + command;
		exec(cmd, (err) => resolve(!err));
	});
}
