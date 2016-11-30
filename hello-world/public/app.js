$(document).ready(function() {
  $('#logout-button').click(logout);
  $('#login-button').click(requestAuthentication);

  var localStorageKeyName = "blockstack"
  var currentHost = location.origin
  var identityHost = "http://blockstack-dashboard.firebaseapp.com/auth"
  var apiHost = "https://api.blockstack.com"

  function getAuthResponseToken() {
    var queryDict = queryString.parse(location.search)
    return queryDict.authResponse
  }

  function isUserLoggedIn() {
    return localStorage.getItem(localStorageKeyName) ? true : false
  }

  function requestAuthentication() {
    var payload = {
      appURI: currentHost,
      issuedAt: new Date().getTime()
    }
    var authRequest = base64url.encode(JSON.stringify(payload))
    location = identityHost + "?authRequest=" + authRequest
  }

  function showProfile(username, profile) {
    var person = new Person(profile)
    $('.heading-name').html(person.name())
    $('#avatar-image').attr("src", person.avatarUrl())
    $('#section-1').hide()
    $('#section-2').show()
  }

  function recordSession(authResponseToken, username, profile) {
    var blockstackData = {
      profile: profile,
      username: username,
      authResponseToken: authResponseToken,
    }
    localStorage.setItem(localStorageKeyName, JSON.stringify(blockstackData))
  }

  function loadUser(authResponseToken, callback) {
    var username = getUsernameFromToken(authResponseToken)
    var requestURL = apiHost + '/v1/users/' + username
    request(requestURL, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var profile = JSON.parse(body)[username].profile
        callback(username, profile)
      }
    })
  }

  function logout() {
    localStorage.removeItem(localStorageKeyName)
    window.location = currentHost
  }

  function getUsernameFromToken(authResponseToken) {
    var decodedToken = BlockstackAuth.decodeToken(authResponseToken)
    var decodedBlockstackID = decodedToken.payload.issuer.username
    return decodedBlockstackID.split('.')[0]
  }

  function runApp() {
    if (isUserLoggedIn()) {
      var blockstackData = JSON.parse(localStorage.getItem(localStorageKeyName))
      showProfile(blockstackData.username, blockstackData.profile)
    } else {
      if (getAuthResponseToken()) {
        var authResponseToken = getAuthResponseToken()
        loadUser(authResponseToken, function(username, profile) {
          recordSession(authResponseToken, username, profile)
          window.location = currentHost
        })
      }
    }
  }

  runApp()
})
