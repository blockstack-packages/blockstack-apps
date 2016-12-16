$(document).ready(function() {
  var identityProviderURL = "https://blockstack-dashboard.firebaseapp.com/auth",
      nameResolverURL = "https://api.blockstack.com/v1/users/",
      currentHost = window.location.origin
  var blockstack = new BlockstackAuth.AuthAgent(identityProviderURL, nameResolverURL);
  $('#logout-button').click(function() { blockstack.logout() })
  $('#login-button').click(function() { blockstack.requestLogin() })
  
  function showProfile(username, profile) {
    var person = new Person(profile)
    $('.heading-name').html(person.name())
    $('#avatar-image').attr("src", person.avatarUrl())
    $('#section-1').hide()
    $('#section-2').show()
  }
  
  if (blockstack.isUserLoggedIn()) { // If the user is logged in, get the session
    blockstack.loadSession(function(session) {
      showProfile(session.username, session.profile)
    })
  } else if (blockstack.isLoginPending()) { // If there's an auth token, login the user
    blockstack.completeLogin(function(session) {
      window.location = currentHost
    })
  }
})