$(document).ready(() => {
  //Chat:
  const socket = io();

    $("#chatForm").submit(() => {
      let text = $("#chat-input").val(),
        userId = $("#chat-user-id").val();
        userName =$("#chat-user-name").val()
      socket.emit("message", {
        content: text,
        userId: userId,
        userName: userName
      });
      $("#chat-input").val("");
      return false;
    });

    socket.on("user disconnected", () => {
     // displayMessage({userName: "Notice", content: "User left chat"});
     console.log("Notice: User left chat");
    });

    socket.on("load all messages", (data) => {
      data.forEach(message => {
        displayMessage(message);
      });
    });

    socket.on("message", message => {
      displayMessage(message);
      for(let i = 0; i < 2; i++) {
        $(".chat-icon").fadeOut(200).fadeIn(200);
      }
    });

    let displayMessage = (message) => {
      $("#chat").append(
        `<div style="padding: 5px 10px">
          <span class="message ${getCurrentUserClass(message.user)}">
          <strong>${message.userName}: </strong>${message.content}</span><br>
          <span class='text-muted small'>${formatDate(message.createdAt)}</span>
        </div>`
      );
    };

    let getCurrentUserClass = (id) => {
      let userId = $("#chat-user-id").val();
      return userId === id ? "current-user": "";
    }

    let formatDate = (timestamp) => {
      if(timestamp) {
        let tempArray = timestamp.split("T");
      return tempArray[0];
      } else return "just now";
    }

    //Modal:
    $("#modal-button").click(() => {
      $(".modal-body").html("");
      $.get(`/api/courses/no-jwt`, (results = {}) => {
        let data = results.data;
        if (!data || !data.courses) return;
        data.courses.forEach(course => {
          $(".modal-body").append(
            `<div>
                <span class="course-title">${course.title}</span>
                <div class="course-description small text-muted">${course.description}</div><br/>
                <button class="btn join-btn ${course.joined ? 'disabled' : 'btn-success'}" data-id='${course._id}'>${course.joined ? 'Joined' : 'Join'}</button>
            </div><br/><hr/>`
          );
        });
      })
      .then(() => {
        addJoinButtonListener()
      })
    });
  });

let addJoinButtonListener = () => {
  $(".join-btn").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");
    $.get(`/api/courses/no-jwt/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined")
          .addClass("disabled")
          .removeClass("btn-success");
      }
      else {
        $button.text("Try Again");
      }
    });
  });
}