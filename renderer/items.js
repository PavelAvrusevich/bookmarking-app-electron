let items = document.getElementById('items');

//Track items in storage
exports.storage = JSON.parse(localStorage.getItem('items')) || [];

//Persist storage
exports.save = () => {
    localStorage.setItem('items', JSON.stringify(this.storage));
};

// Add new item
exports.addItem = (item, isNew = false) => {
    //Create new Dom mode
    let itemNode = document.createElement('div');

    //Assign "read-item" class
    itemNode.setAttribute('class', 'read-item');

    //Add inner html
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

    //Append itemNode to "items"
    items.appendChild(itemNode);

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
