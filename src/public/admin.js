let socket = io()
let logoutButton = document.getElementById("logout")
let editButtons = document.querySelectorAll('.edit-message');
let form = document.querySelector("form")
let input = document.querySelector("input")
let list = document.querySelector("ul")

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

socket.on("chat", (message, messageId) => {
    let item = document.createElement("li");
    item.classList.add("message-item");
    
    // contenido del mensaje
    let messageContent = document.createElement("div");
    messageContent.classList.add("user-name")
    messageContent.textContent = `${userName}: ${message}`;
    
    // div de los botones
    let buttonsDiv = document.createElement("div");

    // botón de eliminar
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-message");
    deleteButton.textContent = "Eliminar";
    deleteButton.setAttribute("data-id", messageId);
    deleteButton.addEventListener('click', function () {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            const messageId = this.getAttribute('data-id');
            socket.emit('deleteMessage', messageId);
        }
    });

    // botón de editar
    let editButton = document.createElement("button");
    editButton.classList.add("edit-message");
    editButton.textContent = "Editar";
    editButton.setAttribute("data-id", messageId);
    editButton.addEventListener('click', function () {
        const newMessage = prompt("Por favor, ingrese el comentario modificado:");
        const messageId = this.getAttribute('data-id');
        if (newMessage) {
            socket.emit('editMessage', messageId, newMessage);
        }
    });

    // añadir los botones al contenedor
    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(editButton);
    
    // añadir el contenido y los botones al elemento de lista
    item.appendChild(messageContent);
    item.appendChild(buttonsDiv);
    
    // añadir el nuevo elemento a la lista
    list.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

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

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-message');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
                const messageId = this.getAttribute('data-id');
                socket.emit('deleteMessage', messageId);
            }
        });
    });
});

socket.on('messageDeleted', (messageId) => {
    try {
        const messageItem = document.querySelector(`.delete-message[data-id="${messageId}"]`).closest('li');
        if (messageItem) {
            messageItem.remove();
        }
    } catch (error) {
        console.log(error)
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.edit-message');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newMessage = prompt("Por favor, ingrese el comentario modificado:");
            const messageId = this.getAttribute('data-id');
            if (newMessage) {
                socket.emit('editMessage', messageId, newMessage);
            }
        });
    });
});

socket.on('messageEdited', (messageId, newMessage, userMessage) => {    
    try {
        const messageItem = document.querySelector(`.edit-message[data-id="${messageId}"]`).closest('li');
        const messageContent = messageItem.querySelector('.user-name'); // Assuming this class holds the entire message content
        messageContent.textContent = `${userMessage}: ${newMessage}`;
    } catch (error) {
        console.log(error)
    }
});