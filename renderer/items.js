const fs = require('fs');

let items = document.getElementById('items');

// Get reader.js content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

//Track items in storage
exports.storage = JSON.parse(localStorage.getItem('items')) || [];

window.addEventListener('message', (e) => {
    // Check for correct message
    if (e.data.action === 'delete-reader-item') {
        // Delete item if given index
        this.delete(e.data.itemIndex);
    }

    // Close the reader window
    e.source.close();
});

// Delete item
exports.delete = (itemIndex) => {
    // Remove item from DOM
    items.removeChild(items.childNodes[itemIndex]);

    // Remove item from storage
    this.storage.splice(itemIndex, 1);

    // Persist storage
    this.save();

    // Select previous or new top item
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // Select item at new index
    items.childNodes[newSelectedItemIndex].classList.add('selected');
};

// Get selected item
exports.getSelectedItem = () => {
    // Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    // Get item index
    let itemIndex = 0;
    let child = currentItem;
    while ((child = child.previousElementSibling != null)) itemIndex++;

    // Return selected item and index
    return { node: currentItem, index: itemIndex };
};

//Persist storage
exports.save = () => {
    localStorage.setItem('items', JSON.stringify(this.storage));
};

// Set item as selected
exports.select = (e) => {
    // Remove current selected class
    this.getSelectedItem().node.classList.remove('selected');

    // Add selected class to clicked item
    e.currentTarget.classList.add('selected');
};

// Move selection to next or previous item
exports.changeSelection = (direction) => {
    //Get current selected item
    let currentItem = this.getSelectedItem();

    //Handle up/down arrows
    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
        currentItem.node.classList.remove('selected');
        currentItem.node.previousElementSibling.classList.add('selected');
    } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
        currentItem.node.classList.remove('selected');
        currentItem.node.nextElementSibling.classList.add('selected');
    }
};

// Open selected item
exports.open = () => {
    //Only if we have items (case of menu open)
    if (!this.storage.length) return;

    //Get selected item
    let selectedItem = this.getSelectedItem();

    //Get url from item
    let url = selectedItem.node.dataset.url;

    // Open item in proxy BrowserWindow
    let proxyWin = window.open(
        url,
        '',
        `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
    `
    );

    // Inject js with specific item index (selectedItem.index)
    proxyWin.eval(readerJS.replace('{{index}}', selectedItem.index));
};

// Add new item
exports.addItem = (item, isNew = false) => {
    //Create new Dom mode
    let itemNode = document.createElement('div');

    //Assign "read-item" class
    itemNode.setAttribute('class', 'read-item');

    // Set item url as data attribute
    itemNode.setAttribute('data-url', item.url);

    //Add inner html
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

    //Append itemNode to "items"
    items.appendChild(itemNode);

    //Attach click handler to select item
    itemNode.addEventListener('click', this.select);

    // Attach doubleclick handler to open
    itemNode.addEventListener('dblclick', this.open);

    // If this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    //Add new item to storage and save to localStorage
    if (isNew) {
        this.storage.push(item);
        this.save();
    }
};

// Add item from localStorage when window reload
this.storage.forEach((item) => {
    this.addItem(item);
});
