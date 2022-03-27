const room = window.location.pathname.replace(/\//g, '');
console.log(room
)
const socket = io(`http://localhost:3000/${room}`);

const form = document.forms['message_form'];
const div_messages = document.querySelector("#div_messages")
const userForm = document.forms['user_form']
let user = {
    id: null,
    name: null,
    color: null
};

const showUserListOnScreen = (userList) => {
    let userContentHtml = '';
    userList.forEach(user => {
        userContentHtml += `<div class="participant"> ${user.name}</div>`;
    })
    document.querySelector('.div_portrait').innerHTML = userContentHtml;
    console.log("aaa" + userContentHtml)
}

document.addEventListener('DOMContentLoaded', (e) => {
    if (user.name) {
        document.querySelector("#div_user").style.display = 'none';
    }
    socket.on("ip", ip => {
        console.log(ip);
    })
})

form.addEventListener("submit", e => {
    e.preventDefault();
        let currentMessage = form['msg'].value;
        if (currentMessage.trim() != null && currentMessage.trim() != "") {
            socket.emit("new_message", { user: user, msg: currentMessage });
            clearMessageInput();
        }
})

const requestUserNamePrompt = () => {
    let userName = prompt("Por Favor, digite seu nome");
    if (!userName) {
        userName = "Anônimo";
    }
    user.name = userName;
    socket.emit('change_name', user)
    console.log(userName);
    document.querySelector('#div_user').innerHTML = `<h3>${user.name}</h3><span>Bem vindo(a)!</span>`
}

socket.on('messages_list', (messages) => {
    showMessageOnScreen(messages);
})

socket.on('user_id', (id) => {
    user.id = id;
    console.log("ID atual: " + user.id)
    requestUserNamePrompt();
})

socket.on('room_exit', (name) => {
alert(name + " saiu da sala!")
})

socket.on('userListUpdate', (list) => {
    showUserListOnScreen(list)
    console.log(list)

})

const showMessageOnScreen = (messages) => {
    let messagesHtml = '<div>';
    messages.forEach(message => {
        let divClass = 'card'
        if (message.user.id == user.id) {
            divClass = 'card yourMessage';
            messagesHtml += `<div class="${divClass}"><span class="user-name" style="color:black" >${message.user.name}</span></br><div class="message-body">${message.msg}</div></div>`
        } else {
            messagesHtml += `<div class="${divClass}"><span class="user-name" style="color:blue" >${message.user.name}</span></br><div class="message-body">${message.msg}</div></div>`
        }

    })
    messagesHtml += `</div>`
    div_messages.innerHTML = messagesHtml;
}

function submitOnEnter(event){
    if(event.which === 13){
        event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
        event.preventDefault(); 
    }
}

document.getElementById("message-field").addEventListener("keypress", submitOnEnter);

const clearMessageInput = () => {
    form['msg'].value = '';
}

const generateRandomColor = () => {
    return "#" + ((1 << 24) * Math.random() | 0).toString(16);
}
