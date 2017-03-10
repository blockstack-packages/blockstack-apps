$(document).ready(function() {
  var signingKey = null
  var appManifest = {
    name: "Hello, Blockstack",
    start_url: currentHost,
    description: "A simple demo of Blockstack Auth",
    icons: [{
      src: "https://raw.githubusercontent.com/blockstack/blockstack-portal/master/app/images/app-hello-blockstack.png",
      sizes: "192x192",
      type: "image/png"
    }]
  }

  $('#signin-button').click(function() {
    blockstack.requestSignIn(signingKey, appManifest)    
  })
  $('#signout-button').click(function() {
    blockstack.signUserOut(window.location.origin)
  })

  function showProfile(profile) {
    var person = new blockstack.Person(profile)
    $('#heading-name').html(person.name())
    $('#avatar-image').attr('src', person.avatarUrl())
    $('#section-1').hide()
    $('#section-2').show()
  }

  if (blockstack.isUserSignedIn()) {
    blockstack.loadSession(function(session) {
      showProfile(session.profile)
    })
  } else if (blockstack.isSignInPending()) {
    blockstack.signUserIn(function(session) {
      window.location = currentHost
    })
  } else {
    // do nothing
  }

})