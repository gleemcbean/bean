import React, { useState } from "react";
import {
	VscChromeMaximize,
	VscChromeMinimize,
	VscChromeRestore,
	VscClose,
} from "react-icons/vsc";
import { TitleBarAction } from "../../../constants/Enum";
import styles from "./component.module.scss";

export default function TitleBar() {
	const [maximized, setMaximized] = useState(false);

	return (
		<header className={styles.header}>
			<div className={styles.leftContainer}>
				<img
					src="/images/favicon.png"
					alt="Favicon"
					className={styles.appIcon}
				/>
				<div className={styles.appTextInfo}>
					<h1 className={styles.appName}>{window.electronAPI.appName}</h1>
					<span className={styles.appVersion}>
						(v{window.electronAPI.appVersion})
					</span>
				</div>
			</div>
			<div className={styles.titleBarButtons}>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.MINIMIZE_WINDOW)
							.then(setMaximized)
					}
				>
					<VscChromeMinimize />
				</button>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.MAXIMIZE_WINDOW)
							.then(setMaximized)
					}
				>
					{maximized ? <VscChromeRestore /> : <VscChromeMaximize />}
				</button>
				<button
					type="button"
					className={styles.titleBarButton}
					onClick={() =>
						window.electronAPI
							.titleBarAction(TitleBarAction.CLOSE_WINDOW)
							.then(setMaximized)
					}
				>
					<VscClose />
				</button>
			</div>
		</header>
	);
}
