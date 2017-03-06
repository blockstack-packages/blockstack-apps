$(document).ready(function() {
  var currentHost = window.location.origin
  var appManifest = {
    name: "Hello, Blockstack",
    start_url: currentHost,
    description: "A simple demo of blockstack auth",
    icons: [{
      "src": "https://raw.githubusercontent.com/blockstack/blockstack-portal/master/app/images/app-hello-blockstack.png",
      "sizes": "192x192",
      "type": "image/png"
    }]
  }
  var signingKey = null

  $('#login-button').click(function() {
    blockstack.requestSignIn(signingKey, appManifest)
  })
  $('#logout-button').click(function() {
    blockstack.signUserOut(window.location.origin)
  })

  function showProfile(username, profile) {
    var person = new blockstack.Person(profile)
    $('#heading-name').html(person.name())
    $('#avatar-image').attr("src", person.avatarUrl())
    $('#section-1').hide()
    $('#section-2').show()
  }

  if (blockstack.isUserSignedIn()) { // User signed in? Get the session.
    blockstack.loadSession(function(session) {
      showProfile(session.username, session.profile)
    })
  } else if (blockstack.isSignInPending()) { // Auth token present? Sign in the user.
    blockstack.signUserIn(function(session) {
      window.location = currentHost
    })
  }
})