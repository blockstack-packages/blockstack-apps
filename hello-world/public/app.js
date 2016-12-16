$(document).ready(function() {
  var identityProviderURL = "https://blockstack-dashboard.firebaseapp.com/auth"
  var nameResolverURL = "https://api.blockstack.com/v1/users/"
  var authAgent = new AuthAgent(identityProviderURL, nameResolverURL)
  window.authAgent = authAgent

  $('#logout-button').click(authAgent.logout);
  $('#login-button').click(function() {
    authAgent.requestAuthentication()
  });

  function showProfile(username, profile) {
    var person = new Person(profile)
    $('.heading-name').html(person.name())
    $('#avatar-image').attr("src", person.avatarURL())
    $('#section-1').hide()
    $('#section-2').show()
  }

  function runApp() {
    if (authAgent.isUserLoggedIn()) {
      var blockstackData = JSON.parse(localStorage.getItem(authAgent.localStorageKeyName))
      showProfile(blockstackData.username, blockstackData.profile)
    } else {
      if (authAgent.getAuthResponseToken()) {
        var authResponseToken = authAgent.getAuthResponseToken()
        authAgent.loadUser(authResponseToken, function(username, profile) {
          authAgent.recordSession(authResponseToken, username, profile)
          window.location = currentHost
        })
      }
    }
  }

  runApp()
})
