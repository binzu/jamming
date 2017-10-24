const clientId = '0f24352711b74c99bb4d33ec4605a5c4';
const secret = '7023178483744da6b6ebb3a33a68d42f';
// const redirectURI = 'http://localhost:3000/'; // localhost
const redirectURI = 'http://binzu-jamming.surge.sh/'; // production

let accessToken;
let expiresIn;
let tracks;

const Spotify = {
  // method to get access token
  getAccessToken: function() {
    // check for access token
    if (accessToken) {
      // return access token if present
      return accessToken;
    }
    // if there is no access token but is present in window.location.href
    if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
      // set access token value
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      // set variable for expire time
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      // clear the value for the for expiration time
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      // redirect to authentication url
      window.location.href = encodeURI(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },

  search: function(term) {

    const accessToken = this.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      methos: 'GET',
      headers: {Authorization: `Bearer ${accessToken}`}
     })
    .then(response => { return response.json()})
    .then(jsonResponse => {
     if(jsonResponse.tracks.items) {
       // parse tracks
       let res = jsonResponse.tracks.items.map(track => ({
           id: track.id,
           name: track.name,
           artist: track.artists[0].name,
           album: track.album.name,
           uri: track.uri
         })
       );
       return res;
     }
    });
  },

  savePlaylist: function(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }

    let token, headers, userId, playlistId;

    // get access token
    token = this.getAccessToken();

    // get userId
    headers = {Authorization: `Bearer ${token}`};

    // get user id
    return fetch(`https://api.spotify.com/v1/me`,{
       method: 'GET',
       headers: headers
      })
     .then(response => { return response.json()})
     .then(jsonResponse => {
        userId = jsonResponse.id;
      })
      // post a new playlist
      .then(() => {
        fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
         method: 'POST',
         headers: headers,
         body: JSON.stringify({name: playlistName}),
         json: true
        })
       .then(response => { return response.json()})
       .then(jsonResponse => {
          playlistId = jsonResponse.id;
        })
        // post track URIs
        .then(() => {
          fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
           method: 'POST',
           headers: headers,
           body: JSON.stringify({uris: trackURIs}),
           json: true
          })
         .then(response => { return response.json()})
         .then(jsonResponse => {
            playlistId = jsonResponse.id;
          })
        })
      });
  }
}

export default Spotify;
