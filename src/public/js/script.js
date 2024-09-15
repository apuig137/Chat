let socket = io()
let form = document.querySelector("form")
let input = document.querySelector("input")
let list = document.querySelector("ul")
let logoutButton = document.getElementById("logout")

list.scrollTop = list.scrollHeight;

logoutButton.addEventListener("click", (e) => {
    e.preventDefault()
    fetch('https://livechat-zk2w.onrender.com/user/logout', {
        method: 'GET',
        credentials: 'same-origin'
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = '/login';
        } else {
            console.error('Error al cerrar sesión');
        }
    })
})

function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

let userName = getCookie('username');

form.addEventListener("submit", (e) => {
    e.preventDefault()
    if(input.value){
        socket.emit("chat", input.value, userName)
        input.value = ""
    }
})

socket.on("chat", (message, messageId, user) => {
    let item = document.createElement("li");
    item.textContent = `${user}: ${message}`;
    item.classList.add("message-item");
    item.setAttribute("data-id", messageId);
    list.appendChild(item);
    list.scrollTop = list.scrollHeight;
});

socket.on('messageDeleted', (messageId) => {
    try {
        const messageItem = document.querySelector(`.message-item[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.remove();
        }
    } catch (error) {
        console.log(error);
    }
});

socket.on('messageEdited', (messageId, newMessage, userMessage) => {
    try {
        const messageItem = document.querySelector(`.message-item[data-id="${messageId}"]`);
        if (messageItem) {
            messageItem.textContent = `${userMessage}: ${newMessage}`;
        }
    } catch (error) {
        console.log(error);
    }
});