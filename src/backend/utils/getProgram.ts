import fs from "node:fs";
import path from "node:path";
import { PROGRAMS_PATH } from "../../constants/Global";
import Technologies from "../../constants/Technologies";
import getGitStatus from "./getGitStatus";

function recLsDir(dirname: string, blacklist: Set<string>) {
	const found: string[] = [];

	for (const filename of fs.readdirSync(dirname)) {
		if (filename.startsWith(".") || blacklist.has(filename)) continue;
		const _path = path.join(dirname, filename);
		if (!fs.existsSync(_path)) continue;

		if (fs.statSync(_path).isDirectory()) {
			found.push(...recLsDir(_path, blacklist));
		} else {
			found.push(_path);
		}
	}

	return found;
}

export default function getFolderData(dirname: string): Program | null {
	const _path = path.join(PROGRAMS_PATH, dirname);
	if (!fs.existsSync(_path) || !fs.statSync(_path).isDirectory()) return null;

	const lastEdited = fs.statSync(_path).mtime.toISOString();
	const gitStatus = getGitStatus(_path);
	const technologies: Technology[] = [];
	const blacklist = new Set<string>();

	for (const tech of Technologies) {
		const hasIncludedFile = tech.includePaths.some((p) => {
			const [filename] = p.split(":");
			let exists = fs.existsSync(path.join(_path, filename));

			if (filename.includes("*")) {
				const fileRegStr = filename
					.replace(/[.+?^${}()|[\]\\]/g, "\\$&")
					.replace(/\*/g, "(.*)");

				const fileReg = new RegExp(`^${fileRegStr}$`);

				const files = recLsDir(
					_path,
					new Set(blacklist).union(new Set(tech.blacklistedFilenames)),
				);

				exists = files.some((f) => fileReg.test(f));
			}

			if (!exists || !p.includes(":")) return exists;

			const contentRegStr = p.substring(p.indexOf(":") + 1);
			const contentReg = new RegExp(contentRegStr);
			const content = fs.readFileSync(path.join(_path, filename), "utf8");
			exists = contentReg.test(content);
			return exists;
		});

		if (hasIncludedFile) {
			technologies.push(tech);
			tech.blacklistedFilenames.forEach(blacklist.add, blacklist);
		}
	}

	const ignored = new Set(technologies.flatMap((tech) => tech.ignoreTechs));

	ignored.forEach((igTech) => {
		const index = technologies.findIndex((t) => t.id === igTech);
		if (index === -1) return;
		technologies.splice(index, 1);
	});

	technologies.reverse();

	return { path: _path, dirname, technologies, lastEdited, gitStatus };
}
