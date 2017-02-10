$(document).ready(function() {
var defaultIDProviderURL = "https://blockstack-dashboard.firebaseapp.com/auth"
var nameResolverURL = "https://api.blockstack.com/v1/users/"
var blockstack = new BlockstackAuth.AuthAgent(defaultIDProviderURL, nameResolverURL)
var currentHost = window.location.origin
$('#login-button').click(function() { blockstack.requestLogin() })
$('#logout-button').click(function() { blockstack.logout() })

function showProfile(username, profile) {
  var person = new Person(profile)
  $('#heading-name').html(person.name())
  $('#avatar-image').attr("src", person.avatarUrl())
  $('#section-1').hide()
  $('#section-2').show()
}

if (blockstack.isUserLoggedIn()) { // User logged in? Get the session.
  blockstack.loadSession(function(session) {
    showProfile(session.username, session.profile)
  })
} else if (blockstack.isLoginPending()) { // Auth token present? Login the user.
  blockstack.completeLogin(function(session) {
    window.location = currentHost
  })
}
})