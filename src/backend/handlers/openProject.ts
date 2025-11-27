import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { shell } from "electron";
import { OpenProjectMode } from "../../constants/Enum";
import { PROGRAMS_PATH } from "../../constants/Global";
import bashCommandExists from "../utils/bashCommandExists";

export default async function openProject(
	projectName: string,
	mode: OpenProjectMode,
) {
	if (/\.{2}|[/\\]/.test(projectName)) {
		console.warn("Invalid project name.");
		return;
	}

	const projectPath = path.resolve(PROGRAMS_PATH, projectName);

	if (!fs.existsSync(projectPath) || !fs.lstatSync(projectPath).isDirectory()) {
		console.warn("Project folder does not exist.");
		return;
	}

	switch (mode) {
		case OpenProjectMode.FILE_EXPLORER:
			shell.openPath(projectPath);
			break;

		case OpenProjectMode.IDE:
			if (!(await bashCommandExists("code"))) {
				throw new Error("VS Code not found on this system.");
			}

			spawn("code", [projectPath], {
				shell: true,
				detached: true,
				stdio: "ignore",
			});

			break;
	}
}
