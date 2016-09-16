$(document).ready(function() {
  $('#login-button').click(function() {
    $('#section-1').hide();
    $('#section-2').show();
  });
  $('#logout-button').click(function() {
    $('#section-1').show();
    $('#section-2').hide();
  });
})