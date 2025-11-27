import React from "react";
import styles from "./component.module.scss";

type TechProps = {
	tech: Technology;
	first: boolean;
};

type TechContainerProps = {
	techs: Technology[];
};

function Tech({ tech, first }: TechProps) {
	return (
		<li key={tech.id} className={styles.tech}>
			<a
				href={tech.documentationURL}
				target="_blank"
				className={styles.techUrl}
			>
				<img
					src={`/images/icons/${tech.id}.png`}
					alt={tech.name}
					className={styles.techIcon}
				/>
				<p className={first ? styles.techName : styles.techNameHover}>
					{tech.name}
				</p>
			</a>
		</li>
	);
}

export default function TechContainer({ techs }: TechContainerProps) {
	return (
		<ul className={styles.techs}>
			{techs.map((tech, index) => (
				<Tech key={tech.id} tech={tech} first={index === 0} />
			))}
		</ul>
	);
}
