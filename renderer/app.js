const { ipcRenderer } = require('electron');
const items = require('./items');

let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let itemUrl = document.getElementById('url');
let addItem = document.getElementById('add-item');
let search = document.getElementById('search');

//Filter items with "search"
search.addEventListener('keyup', (e) => {
    //Loop items
    Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
        //Hide items that don't match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    });
});

//Navigate item selection with up/down arrows
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
});

//Disable and enable modal buttons
const toggleModalButtons = () => {
    //Check state of buttons
    if (addItem.disabled) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
};

//Show modal
showModal.addEventListener('click', (e) => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

//Hide modal
closeModal.addEventListener('click', (e) => {
    modal.style.display = 'none';
});

//Handle new item
addItem.addEventListener('click', (e) => {
    if (itemUrl.value) {
        //Send item url to main process
        ipcRenderer.send('new-item', itemUrl.value);

        //Disable buttons
        toggleModalButtons();
    }
});

//Listen for new item from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    //Add new item to "items"
    items.addItem(newItem, true);

    //Enable buttons
    toggleModalButtons();

    //Hide modal and clear value
    modal.style.display = 'none';
    itemUrl.value = '';
});

//Listen for keyboards submit
itemUrl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addItem.click();
    }
});
