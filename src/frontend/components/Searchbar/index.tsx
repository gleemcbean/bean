import React from "react";
import { IoSearch } from "react-icons/io5";
import styles from "./component.module.scss";

export default function Searchbar() {
	return (
		<form className={styles.searchbar}>
			<input
				type="text"
				className={styles.searchContent}
				placeholder="Project name"
			/>
			<button type="button" className={styles.searchButton}>
				<IoSearch />
			</button>
		</form>
	);
}
