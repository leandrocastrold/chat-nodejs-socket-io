const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path');
const socketIO = require('socket.io');
const PORT = 3000;


app.use("/", express.static(path.join(__dirname, 'public')));
app.use(cors())


app.get('/grupo1', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/chat.html'));
});

app.get('/grupo2', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/chat.html'));
});


const server = app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})


const io = socketIO(server);


const groupFactory = (index) => {
    let users = [];
    let messages = [];

    const group = io.of(`grupo${index}`).on('connection', socket => {
        const connectedUser = { id: socket.id, name: null };
        console.log("Novo cliente conectado");

        socket.emit('user_id', connectedUser.id);
        socket.emit('messages_list', messages)

        socket.on("disconnect", () => {
            console.log(connectedUser.id + " se desconectou");
            users = users.filter(user => user.id !== connectedUser.id)
            group.emit('userListUpdate', users);
            group.emit('room_exit', connectedUser.name);
            console.log(users)
        })

        socket.on("change_name", (user) => {
            if (!users) {
                users = [];
            }
            connectedUser.name = user.name === "Anônimo" 
            ? user.name + ' - #' + Number(users.length + 1)
            : user.name;
            console.log("LISTA")
            console.log(users)
            users.push(connectedUser);
            group.emit('userListUpdate', users);
            console.log(users);
        })

        socket.on("new_message", (message => {
            messages.push(message);
            console.log(messages)
            //  console.log(message)
            group.emit('messages_list', messages)
        }))
    })

    return group
}

const group0 = groupFactory(0);
const group1 = groupFactory(1);
const group2 = groupFactory(2);
