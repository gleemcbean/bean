import type { TitleBarAction } from "src/constants/Enum";
import type { GitStatus, OpenProjectMode } from "../constants/Global";

declare global {
	interface Technology {
		id: string;
		name: string;
		documentationURL: string | null;
		includePaths: string[];
		blacklistedFilenames: string[];
		ignoreTechs: string[];
		weight: number;
	}

	interface Program {
		path: string;
		dirname: string;
		technologies: Technology[];
		lastEdited: string;
		gitInfo: { status: GitStatus; url: string | null } | null;
	}

	interface Window {
		electronAPI: {
			appName: string;
			appVersion: string;
			theme: "dark" | "light";
			getProjects: () => Promise<Program[]>;
			openProject: (programName: string, mode: OpenProjectMode) => void;
			titleBarAction: (action: TitleBarAction) => Promise<boolean>;
		};
	}
}
