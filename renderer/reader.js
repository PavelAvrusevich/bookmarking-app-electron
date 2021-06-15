// Create "Done" button in remote content
let closeButton = document.createElement('div');
closeButton.innerText = 'Done';

// Style button
closeButton.style.position = 'fixed';
closeButton.style.bottom = '15px';
closeButton.style.right = '15px';
closeButton.style.padding = '5px 10px';
closeButton.style.fontSize = '20px';
closeButton.style.fontWeight = 'bold';
closeButton.style.background = 'dodgerblue';
closeButton.style.color = 'white';
closeButton.style.borderRadius = '5px';
closeButton.style.cursor = 'default';
closeButton.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
closeButton.style.zIndex = '9999';

// Append button to body
document.getElementsByTagName('body')[0].append(closeButton);
