var element = document.getElementById("calendar");
var calendar = new FullCalendar.Calendar(element, {
  initialView: "dayGridMonth",
  locale: "pt-br",
  themeSystem: "bootstrap",
  events: "appointments",
  eventClick: function (info) {
    window.location.href = "/event/" + info.event.id;
  },
  /*   close: 'fa-times',
  prev: 'fas fa-arrow-alt-circle-left',
  next: 'fas fa-arrow-alt-circle-right',
  prevYear: 'fa-angle-double-left',
  nextYear: 'fa-angle-double-right' */
});

calendar.render();
