"use strict";

const Message = require("../models/message");
const User = require("../models/user");

module.exports = io => {
  io.on("connection", client => {
    
    Message.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .then(messages => {
        client.emit("load all messages", messages.reverse());
    })

    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected")
    });

    client.on("message", (data) => {
      let messageAttriburtes = {
        content: data.content,
        userName: data.userName,
        user: data.userId
      };
    User.findById(messageAttriburtes.user)
      .then(() => {
          let m = new Message(messageAttriburtes);
          m.save()
            .then(() => {
              io.emit("message", messageAttriburtes);
          })
            .catch(error => console.log(`error: ${error.message}`))
      })
      .catch(error => {
        console.log("user ID does not exists");
      })
    });
  });
};