import React, { useEffect, useImperativeHandle, useState } from "react";
import styles from "./component.module.scss";

type ModalProps = {
	children?: React.ReactNode | React.ReactNode[];
	closeOnOutsideClick?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export type ModalRef = {
	open: () => void;
	close: () => void;
	isOpen: () => boolean;
};

export default React.forwardRef<ModalRef, ModalProps>(function Modal(
	{ children, closeOnOutsideClick = true, ...props },
	ref,
) {
	const [visible, setVisible] = useState(false);

	useImperativeHandle(ref, () => ({
		open: () => setVisible(true),
		close: () => setVisible(false),
		isOpen: () => visible,
	}));

	useEffect(() => {
		const keyHandler = (e: KeyboardEvent) =>
			e.key === "Escape" && setVisible(false);

		window.addEventListener("keydown", keyHandler);

		return () => {
			window.removeEventListener("keydown", keyHandler);
		};
	}, []);

	return (
		<section
			className={`${styles.container}${visible ? ` ${styles.visible}` : ""}`}
		>
			<button
				type="button"
				onMouseDown={closeOnOutsideClick ? () => setVisible(false) : undefined}
				className={styles.backdrop}
			/>
			<div className={styles.modal} {...props}>
				{children}
			</div>
		</section>
	);
});
