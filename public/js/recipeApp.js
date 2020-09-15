$(document).ready(() => {
    $("#modal-button").click(() => {
      $(".modal-body").html("");
      $.get("api/courses", (results = {}) => {
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
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
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