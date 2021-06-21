const Chat = require("../models/chat.model");

exports.fetchMessages = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .populate("sender", "name profilePic")
      .populate("receiver", "name profilePic");

    res.status(200).json({
      type: "success",
      message: "getting chat messages between two users",
      data: {
        chats,
      },
    });
  } catch (error) {
    next(error);
  }
};
