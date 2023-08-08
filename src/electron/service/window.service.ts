import { BrowserWindow, dialog } from "electron";
import { EVENT_APPEND_LOG } from "../../constants";
import LogService from "../../model/LogService";

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

class WindowService implements LogService {
  mainWindow: BrowserWindow;

  createMainWindow() {
      if (!this.mainWindow || this.mainWindow.isDestroyed()) {
        this.mainWindow = new BrowserWindow({
          height: 605,
          width: 740,
          autoHideMenuBar: true,
          webPreferences: {
              preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
          },
        });

        this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

      }
      this.mainWindow.show();
  }

  async openFolderSelection(title: string, buttonLabel: string, defaultPath: string = ''){
    return dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory', 'createDirectory', 'promptToCreate', 'dontAddToRecent'],
        buttonLabel,
        defaultPath,
        title,
      });
  }

  async openFileSelection(title: string, buttonLabel: string, defaultPath: string = ''){
    return dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile', 'createDirectory', 'promptToCreate', 'dontAddToRecent'],
        buttonLabel,
        defaultPath,
        title,
      });
  }

  private exists() {
    return this.mainWindow && !this.mainWindow.isDestroyed();
  }
  
  emitEvent(event: string, ...args: any[]) {
    if (this.exists()) {
      this.mainWindow.webContents.send(event, ...args);
    }
  }

  appendLog(mensagem: string) {
    this.emitEvent(EVENT_APPEND_LOG, mensagem);
  }

  log(mensagem: string) {
    this.emitEvent('log', mensagem);
  }
}

export default new WindowService;
