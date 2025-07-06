const socket = io();
let Name;
do {
    Name = prompt("Enter your Name:");
} while (!Name);

let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area")
let audio = document.getElementById('notificationSound');
let sendButton = document.querySelector(".btn");

sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage(textarea.value);
});

function sendMessage(message) {
    let msg = {
        user: Name,
        message: message.trim()
    }
    appendMessage(msg, 'outgoing');
    scrolltobottom();

    textarea.value = "";
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = '';
    if (type === 'join' || type === 'unjoin') {
        markup = `<p><em>${msg}</em></p>`;
    }
    else {
        markup = `<h4>${msg.user}:</h4> <p>${msg.message}</p>`;
    }

    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
    if (type === 'join' || type === 'unjoin') {
        setTimeout(() => {
            messageArea.removeChild(mainDiv);
        }, 5000);
    }
    if (type === 'incoming') {
        audio.play();
    }
}

socket.on('message', (msg) => {
    appendMessage(msg, 'incoming');
    scrolltobottom();
});

socket.on('user-joined', (Name) => {
    appendMessage(`${Name} has joined the chat`, 'join');
    scrolltobottom();
});

socket.on('disconnected', (Name) => {
    appendMessage(`${Name} has left the chat`, 'unjoin');
    scrolltobottom();
});
function scrolltobottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
socket.emit('user-joined', Name);

window.addEventListener('beforeunload', () => {
    socket.emit('disconnected', Name);
})
