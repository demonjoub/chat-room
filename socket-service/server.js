const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});
server.listen(1234);
const rooms = {};
io.on("connection", (socket) => {
  console.log("connection", rooms);
  socket.on("new-user", (room, name) => {
    console.log("new-user", rooms);
    socket.join(room);
    // rooms[room].users[socket.id] = name;
    socket.to(room).emit("user-connected", name);
  });
  socket.on("send-chat-message", (room, message, userId) => {
    console.log(room, message, userId);
    socket.in(room).emit("chat-message", {
      message: message,
      name: userId,
    });
  });
  socket.on("disconnect", () => {
    getUserRooms(socket).forEach((room) => {
      const myRoom = _.get(rooms, `${room}`);
      const users = _.get(myRoom, "users");
      const userName = _.get(users, `${socket.id}`);

      socket.broadcast.emit("user-disconnected", userName);
      delete userName;
    });
  });
  socket.on("room-created", (room) => {
    rooms[room] = {
      users: {},
    };
  });
});

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) {
      names.push(name);
    }
    return names;
  }, []);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
