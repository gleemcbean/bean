import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ini from "ini";
import { GitStatus } from "../../constants/Enum";
import bashCommandExists from "./bashCommandExists";

type GitInfo = {
	status: GitStatus;
	url: string | null;
};

function isRepoClean(repoPath: string): Promise<boolean> {
	return new Promise((resolve) => {
		exec(
			"git status --porcelain",
			{
				cwd: repoPath,
				encoding: "utf8",
			},
			(err, stdout) => {
				if (err) return resolve(false);
				resolve(stdout.trim().length === 0);
			},
		);
	});
}

export default async function getGitInfo(
	repoPath: string,
): Promise<GitInfo | null> {
	if (!(await bashCommandExists("git"))) return null;

	const git = path.join(repoPath, ".git");
	if (!fs.existsSync(git)) return null;

	const data = ini.parse(fs.readFileSync(path.join(git, "config"), "utf8"));
	const url = data?.['remote "origin"']?.url ?? null;

	return {
		status: (await isRepoClean(repoPath))
			? GitStatus.CLEAN
			: GitStatus.MODIFIED,
		url,
	};
}
