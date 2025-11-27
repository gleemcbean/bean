import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaGitAlt, FaRegFolderOpen } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { MdCreate } from "react-icons/md";
import { VscVscode } from "react-icons/vsc";
import { OpenProjectMode } from "../../../constants/Enum";
import TechContainer from "../../components/TechContainer";
import styles from "./page.module.scss";

export default function Home() {
	const [projects, setProjects] = useState<Program[]>([]);
	const [projectMenuVisible, setProjectMenuVisible] = useState(false);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		window.electronAPI.getProjects().then((projects) => setProjects(projects));

		function handleClick(event: MouseEvent) {
			if (!menuRef.current.contains(event.target as Node)) {
				setProjectMenuVisible(false);
			}
		}

		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<main className={styles.container}>
			<div className={styles.toolbar}>
				<form>
					<input type="text" />
					<button type="button">Search</button>
				</form>
				<div className={styles.addProject}>
					<div>
						<button
							type="button"
							className={styles.newProjectButton}
							onClick={() => !projectMenuVisible && setProjectMenuVisible(true)}
						>
							<FiPlus />
							<span>New project</span>
						</button>
					</div>
					<div
						className={styles.addProjectMenu}
						aria-hidden={!projectMenuVisible}
						ref={menuRef}
					>
						<button type="button" className={styles.menuButton}>
							<MdCreate className={styles.createIcon} />
							<span>Create a project</span>
						</button>
						<button type="button" className={styles.menuButton}>
							<FaGitAlt className={styles.gitIcon} />
							<span>Clone Git repo</span>
						</button>
					</div>
				</div>
			</div>
			<ul className={styles.projects}>
				{projects.map((project) => (
					<li key={project.dirname} className={styles.project}>
						<div className={styles.projectHeader}>
							<h3 className={styles.title}>/{project.dirname}</h3>
							<p className={styles.date}>
								{moment(project.lastEdited).format("ddd. D MMM. YYYY")}
							</p>
						</div>
						{project.gitInfo && (
							<a
								className={styles.gitStatus}
								data-gitstatus={project.gitInfo.status}
								href={project.gitInfo.url}
								target="_blank"
							>
								<FaGitAlt className={styles.gitIcon} />
								<span>{project.gitInfo.status}</span>
							</a>
						)}
						<div className={styles.projectFooter}>
							<TechContainer techs={project.technologies} />
							<div className={styles.buttons}>
								<button
									type="button"
									className={styles.revealFileExplorer}
									onClick={() =>
										window.electronAPI.openProject(
											project.dirname,
											OpenProjectMode.FILE_EXPLORER,
										)
									}
								>
									<FaRegFolderOpen className={styles.icon} />
									<span>Open in file explorer</span>
								</button>
								<button
									type="button"
									className={styles.openVSCode}
									onClick={() =>
										window.electronAPI.openProject(
											project.dirname,
											OpenProjectMode.IDE,
										)
									}
								>
									<VscVscode className={styles.icon} />
									<span>Open to IDE</span>
								</button>
							</div>
						</div>
					</li>
				))}
			</ul>
		</main>
	);
}
