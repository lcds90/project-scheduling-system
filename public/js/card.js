function formatPhotoHTML(post) {
  var html = '<div class="container">';

  var photos_per_row = 3;
  for (var row = 0; row < appos.length; row += photos_per_row) {
    html += '<div class="row">';
    for (var i = row; i < row + photos_per_row; i++) {
      var photo = post[i];
      html += '<div class="span4 col-6">';
      html += post[i].cpf;
      html += "</div>";
    }
    html += "</div>";
  }

  html += "</div>";
  return html;
}

$(function(){
    var html = formatPhotoHTML(appos);
    $('').html(html);
});