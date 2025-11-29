import moment from "moment";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaGitAlt, FaRegFolderOpen, FaThList } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { IoGrid } from "react-icons/io5";
import { MdCreate } from "react-icons/md";
import { VscVscode } from "react-icons/vsc";
import { OpenProjectMode } from "../../../constants/Enum";
import Modal, { type ModalRef } from "../../components/Modal";
import Searchbar from "../../components/Searchbar";
import TechContainer from "../../components/TechContainer";
import TitleBar from "../../components/TitleBar";
import styles from "./page.module.scss";

type ProjectProps = {
	project: Program;
};

function Project({ project }: ProjectProps) {
	return (
		<li className={styles.project}>
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
	);
}

export default function Home() {
	const [projects, setProjects] = useState<Program[]>([]);
	const [projectMenuVisible, setProjectMenuVisible] = useState(false);

	const [selectedStyleIndex, setSelectedStyleIndex] = useState(
		parseInt(window.localStorage.getItem("selected-style-index") ?? "0", 10),
	);

	const menuRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<ModalRef>(null);

	useEffect(() => {
		window.localStorage.setItem(
			"selected-style-index",
			selectedStyleIndex.toString(),
		);
	}, [selectedStyleIndex]);

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

	const createRepo = () => {
		modalRef.current.open();
	};

	return (
		<React.Fragment>
			<TitleBar />
			<Modal ref={modalRef}>
				<h2 className={styles.modalTitle}>Create a project</h2>
			</Modal>
			<main className={styles.container}>
				<div className={styles.toolbar}>
					<div className={styles.addProject}>
						<div>
							<button
								type="button"
								className={styles.newProjectButton}
								onClick={() =>
									!projectMenuVisible && setProjectMenuVisible(true)
								}
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
							<button
								type="button"
								className={styles.menuButton}
								onClick={() => {
									createRepo();
									setProjectMenuVisible(false);
								}}
							>
								<MdCreate className={styles.createIcon} />
								<span>Create a project</span>
							</button>
							<button type="button" className={styles.menuButton}>
								<FaGitAlt className={styles.gitIcon} />
								<span>Clone Git repo</span>
							</button>
						</div>
					</div>
					<div className={styles.displayStyle}>
						<div className={styles.buttonWrapper}>
							<button
								type="button"
								className={styles.choice}
								onClick={() => setSelectedStyleIndex(0)}
							>
								<FaThList />
							</button>
							<button
								type="button"
								className={styles.choice}
								onClick={() => setSelectedStyleIndex(1)}
							>
								<IoGrid />
							</button>
						</div>
						<span
							className={styles.selected}
							data-selectedidx={selectedStyleIndex}
						/>
					</div>
					<Searchbar />
				</div>
				<ul
					className={
						[styles.projectList, styles.projectGrid][selectedStyleIndex]
					}
				>
					{projects.map((project) => (
						<Project key={project.dirname} project={project} />
					))}
				</ul>
			</main>
		</React.Fragment>
	);
}
