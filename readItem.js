const { BrowserWindow } = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
    //Create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
        },
    });

    //Load item url
    offscreenWindow.loadURL(url);

    //Wait for content finish loading
    offscreenWindow.webContents.on('did-finish-load', (e) => {
        //Get page title
        let title = offscreenWindow.getTitle();

        //Get screenshot
        offscreenWindow.webContents.capturePage().then((image) => {
            //Get image as dataUrl
            let screenshot = image.toDataURL();
            callback({ title, screenshot, url });

            //Clean up
            offscreenWindow.close();
            offscreenWindow = null;
        });
    });
};
