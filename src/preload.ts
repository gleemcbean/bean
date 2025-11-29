import fs from "node:fs";
import { contextBridge } from "electron";
import packageJSON from "../package.json";
import getProjects from "./backend/handlers/getProjects";
import openProject from "./backend/handlers/openProject";
import titleBarAction from "./backend/handlers/titleBarAction";
import { PROGRAMS_PATH } from "./constants/Global";

if (!fs.existsSync(PROGRAMS_PATH)) {
	fs.mkdirSync(PROGRAMS_PATH, { recursive: true });
}

contextBridge.exposeInMainWorld("electronAPI", {
	appName: packageJSON.productName,
	appVersion: packageJSON.version,
	theme: "dark",
	getProjects,
	openProject,
	titleBarAction,
} as typeof window.electronAPI);
