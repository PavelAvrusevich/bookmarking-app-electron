const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const readItem = require('./readItem');
const appMenu = require('./menu');

let mainWindow;

//Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
    readItem(itemUrl, (item) => {
        e.sender.send('new-item-success', item);
    });
});

// Create a new BrowserWindow when `app` is ready
function createWindow() {
    let state = windowStateKeeper({
        defaultWidth: 500,
        defaultHeight: 650,
    });

    mainWindow = new BrowserWindow({
        width: state.width,
        height: state.height,
        x: state.x,
        y: state.y,
        minWidth: 350,
        maxWidth: 650,
        minHeight: 300,
        webPreferences: {
            // Disable 'contextIsolation' to allow 'nodeIntegration'
            // 'contextIsolation' defaults to "true" as from Electron v12
            contextIsolation: false,
            nodeIntegration: true,
        },
    });

    // Create main app menu
    appMenu();

    mainWindow.loadFile('renderer/main.html');

    state.manage(mainWindow);

    mainWindow.webContents.openDevTools();

    // Listen for window being closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow();
});
