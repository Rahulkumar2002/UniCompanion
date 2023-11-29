const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    console.log("Users data is added : " , users)
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    //When connect
    console.log("a user is connected.");
    console.log("Socket: ", socket.id);

    //take userId and socketId from user .
    socket.on("addUser", (userId) => {
        console.log("userId ", userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //Send and get message 
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        console.log("Receiver Id : " , receiverId , " SenderId : " , senderId , " text ", text)
        const user = getUser(receiverId);
        console.log(users)
        console.log("User data : " , user) 
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text
        });
    });

    //When disconnect 
    socket.on("disconnect", () => {
        console.log("a user is disconnected");
        removeUser(socket.id);
    })
});