const messageBoxes = document.getElementsByClassName('message');

if (messageBoxes.length > 0) {
    setTimeout(() => {
        for (let i = 0; i < messageBoxes.length; i++) {
            messageBoxes[i].style.display = 'none';
        }
    }, 3000);
    for (let i = 0; i < messageBoxes.length; i++) {
        messageBoxes[i].addEventListener('click', () => {
            messageBoxes[i].style.display = 'none';
        });
    }
}