var socket = io();
var replyTo = null;

function submitMsg() {
    var username = document.getElementById('username').value;
    var msg = document.getElementById('usermsg').value;
    if (msg.trim() !== '') {
        document.cookie = 'username=' + username;
        var data = { username: username, msg: msg, replyTo: replyTo };
        socket.emit('chat message', data);
        document.getElementById('usermsg').value = '';
        replyTo = null;
    }
}

document.getElementById('usermsg').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        submitMsg();
    }
});

socket.on('chat message', function (data) {
    var chatbox = document.getElementById('chatbox');
    var newMessage = document.createElement('p');

    var usernameStrong = document.createElement('strong');
    usernameStrong.textContent = data.username + ': ';
    newMessage.appendChild(usernameStrong);

    var msgTextNode = document.createTextNode(data.msg);
    newMessage.appendChild(msgTextNode);

    var replyButton = document.createElement('button');
    replyButton.innerText = 'Reply';
    replyButton.onclick = function () {
        replyTo = data.username;
    };

    var copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.onclick = function () {
        navigator.clipboard.writeText(data.msg);
    };

    newMessage.appendChild(replyButton);
    newMessage.appendChild(copyButton);
    chatbox.appendChild(newMessage);
    chatbox.scrollTop = chatbox.scrollHeight;

    if (data.replyTo === document.getElementById('username').value) {
        newMessage.style.backgroundColor = 'yellow';
    }
});

window.onload = function () {
    var username = getCookie('username');
    if (username) {
        document.getElementById('username').value = username;
    }

    var color = getCookie('bgColor');
    if (color) {
        document.body.style.backgroundColor = color;
        document.getElementById('colorSelect').value = color;
    }
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function changeColor() {
    var color = document.getElementById('colorSelect').value;
    document.body.style.backgroundColor = color;
    document.cookie = 'bgColor=' + color;
}
var lastMessageTime = {};


