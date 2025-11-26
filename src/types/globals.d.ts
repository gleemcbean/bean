import type { GitStatus } from "../constants/Global";

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
		gitStatus: GitStatus;
	}

	interface Window {
		electronAPI: {
			projects: () => Program[];
			revealProject: (programName: string) => void;
		};
	}
}
