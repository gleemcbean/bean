import fs from "node:fs";
import path from "node:path";
import { contextBridge, shell } from "electron";
import getProgram from "./backend/utils/getProgram";
import { PROGRAMS_PATH } from "./constants/Global";

if (!fs.existsSync(PROGRAMS_PATH)) {
	fs.mkdirSync(PROGRAMS_PATH, { recursive: true });
}

contextBridge.exposeInMainWorld("electronAPI", {
	projects: () => fs.readdirSync(PROGRAMS_PATH).map(getProgram),
	revealProject: (projectName: string) => {
		if (/\.{2}|[/\\]/.test(projectName)) {
			console.warn("Invalid project name.");
			return;
		}

		const projectPath = path.resolve(PROGRAMS_PATH, projectName);

		if (
			!fs.existsSync(projectPath) ||
			!fs.lstatSync(projectPath).isDirectory()
		) {
			console.warn("Project folder does not exist.");
			return;
		}

		shell.openPath(projectPath);
	},
});
