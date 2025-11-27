import fs from "node:fs";
import { contextBridge } from "electron";
import getProjects from "./backend/handlers/getProjects";
import openProject from "./backend/handlers/openProject";
import { PROGRAMS_PATH } from "./constants/Global";

if (!fs.existsSync(PROGRAMS_PATH)) {
	fs.mkdirSync(PROGRAMS_PATH, { recursive: true });
}

contextBridge.exposeInMainWorld("electronAPI", {
	getProjects,
	openProject,
} as typeof window.electronAPI);
