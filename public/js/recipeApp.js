$(document).ready(() => {
  //Chat functinality:   
  const socket = io();

    $("#chatForm").submit(() => {
      socket.emit("message");
      $("#chat-input").val("");
      return false;
    });

    socket.on("message", message => {
      displayMessage(message.content);
    });

    let displayMessage = message => {
     // $("#chat").prepend($("<span class='text-muted small'>").html(timestamp));
     // $("#chat").append($("<span>").html(message));
     // $("#chat").append($("<br>"));
      $("#chat").append(
        `<div style="padding: 5px 10px">
          <span class='text-muted small'>${timestamp}:</span>
          <span>${message}</span>
        </div>`
      );
    };

    // modal functionality
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

//time stamp functionality: 
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var d = new Date();
var day = days[d.getDay()];
var hr = d.getHours();
var min = d.getMinutes();
if (min < 10) {
    min = "0" + min;
}
var ampm = "am";
if( hr > 12 ) {
    hr -= 12;
    ampm = "pm";
}
var date = d.getDate();
var month = months[d.getMonth()];
var year = d.getFullYear();
var timestamp = day + " " + hr + ":" + min + ampm + " " + date + " " + month + " " + year;
