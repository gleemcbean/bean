import path from "node:path";
import { app, BrowserWindow, ipcMain } from "electron";
import started from "electron-squirrel-startup";
import { TitleBarAction } from "./constants/Enum";

if (started) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1080,
		height: 720,
		titleBarStyle: "hidden",
		frame: false,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(
			path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
		);
	}

	ipcMain.handle("title-bar-action", (_e, action) => {
		let maximized = mainWindow.isMaximized();

		switch (action) {
			case TitleBarAction.CLOSE_WINDOW:
				mainWindow.close();
				break;

			case TitleBarAction.MAXIMIZE_WINDOW:
				if (maximized) mainWindow.unmaximize();
				else mainWindow.maximize();
				maximized = !maximized;
				break;

			case TitleBarAction.MINIMIZE_WINDOW:
				mainWindow.minimize();
				break;
		}

		return maximized;
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
