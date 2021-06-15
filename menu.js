const { Menu } = require('electron');

// Module function to create main app menu
module.exports = () => {
    // Menu template
    let template = [
        {
            label: 'Items',
            submenu: [],
        },
        {
            role: 'editMenu',
        },
        {
            role: 'windowMenu',
        },
        {
            role: 'help',
            submenu: [],
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
