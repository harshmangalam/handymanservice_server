const Chat = require("./models/chat.model");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");


module.exports = (io) => {
  io.use(async (socket, next) => {
    try {
      const header = socket.handshake.auth.token;
      if (!header) {
        const err = new Error("not authorized");
        err.data = { content: "Please login " };
        next(err);
        return;
      }
      const token = header.split("Bearer ")[1];

      if (!token) {
        const err = new Error("not authorized");
        err.data = { content: "Please login " };
        next(err);
        return;
      }
      const { userId } = jwt.verify(token, JWT_SECRET);

      if (!userId) {
        const err = new Error("NOT_FOUND");
        err.data = { content: "User does not exists " };
        next(err);
        return;
      }

      const user = await User.findById(userId);
      user.socketId = socket.id;
      await user.save();
      socket.currentUser = user;

      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", async (data) => {
      try {
        const receiver = await User.findById(data.receiverId);
        const chat = new Chat({
          sender: socket.currentUser._id,
          receiver: data.receiverId,
          body: data.body,
        });
        let saveChat = await chat.save();

        saveChat = await saveChat
          .populate("sender", "name profilePic")
          .populate("receiver", "name profilePic")
          .execPopulate();

        socket.to(receiver.socketId).emit("message", saveChat);

        socket.emit("message", saveChat);
      } catch (error) {
        console.log(error);
        return err;
      }
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
