const { Menu, shell, app } = require('electron');

// Module function to create main app menu
module.exports = (appWin) => {
    // Menu template
    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add new',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        appWin.send('menu-show-modal');
                    },
                },
                {
                    label: 'Open item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item');
                    },
                },
                {
                    label: 'Delete item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item');
                    },
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native');
                    },
                },
                {
                    label: 'Search items',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        appWin.send('menu-focus-search');
                    },
                },
            ],
        },
        {
            role: 'editMenu',
        },
        {
            role: 'windowMenu',
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn more',
                    click: () => {
                        shell.openExternal('https://github.com/PavelAvrusevich/bookmarking-app-electron');
                    },
                },
            ],
        },
    ];

    // Create Mac app menu
    if (process.platform === 'darwin') {
        template.unshift({ role: 'appMenu' });
    }

    // Build menu
    let menu = Menu.buildFromTemplate(template);

    // Set as main app menu
    Menu.setApplicationMenu(menu);
};
