$(document).ready(function() {
  var AuthResponse = BlockstackAuth.AuthResponse,
      verifyAuthMessage = BlockstackAuth.verifyAuthMessage,
      decodeToken = BlockstackAuth.decodeToken

  var blockstackResolver = new OnenameClient()

  $('#login-button').click(function() {

    var blockstackID = 'ryan.id'
    blockstackID= $('#blockstack-id-input').val()

    var privateKey = '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f'
    var authResponse = new AuthResponse(privateKey)
    var publicKeychain = 'xpub661MyMwAqRbcFQVrQr4Q4kPjaP4JjWaf39fBVKjPdK6oGBayE46GAmKzo5UDPQdLSM9DufZiP8eauy56XNuHicBySvZp7J5wsyQVpi2axzZ',
        chainPath = 'bd62885ec3f0e3838043115f4ce25eedd22cc86711803fb0c19601eeef185e39'
    authResponse.setIssuer(blockstackID, publicKeychain, chainPath)
    var authResponseToken = authResponse.sign()

    var decodedToken = decodeToken(authResponseToken)

    var decodedBlockstackID = decodedToken.payload.issuer.username
    var username = decodedBlockstackID.split('.')[0]

    request('https://api.onename.com/v1/users/' + username,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var responseJSON = JSON.parse(body)
        var profile = responseJSON[username].profile
        var name = profile.name

        var images = profile.image
        var profileImageUrl = 'https://s3.amazonaws.com/onename/avatar-placeholder.png'
        if (images.length > 0) {
          profileImageUrl = images[0].contentUrl
        }
        for (var i = 0; i < images.length; i++) {
          var currentImage = images[i]
          if (currentImage.name === 'avatar') {
            profileImageUrl = currentImage.contentUrl
          }
        }

        $('.heading-name').html(name)
        var imageSectionHTML = '<img src="' + profileImageUrl + '" class="img-rounded avatar">'
        $('.image-section').html(imageSectionHTML)

        $('#section-1').hide();
        $('#section-2').show();

      }
    })
  });
  $('#logout-button').click(function() {
    $('#section-1').show();
    $('#section-2').hide();
  });
})