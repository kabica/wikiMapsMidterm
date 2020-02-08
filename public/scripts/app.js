$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    Object.keys(users).forEach(user => {
      $("<div>").text(user.name).appendTo($("body"));
    })
  });
});
