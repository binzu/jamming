const clientId = '0f24352711b74c99bb4d33ec4605a5c4';
const secret = '7023178483744da6b6ebb3a33a68d42f';
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
      console.log('access token: ', accessToken);
      console.log('expires in: ', expiresIn);
      return new Promise((resolve) => resolve(accessToken));
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
      return new Promise((resolve) => resolve(accessToken));
    }
    if (!accessToken) {
      // redirect to authentication url
      window.location.href = encodeURI(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },

  search: function(term) {
    return this.getAccessToken().then(() => {
      console.log('access token: ', accessToken);
      console.log('expires in: ', expiresIn);
     fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${term}`,{
       method: 'GET',
       headers: {Authorization: `Bearer ${accessToken}`}
     })
     .then(response => {
       if (response.ok) {
         return response.json();
       }
       throw new Error('Request failed!');
     }, networkError => console.log(networkError.message)
   ).then(jsonResponse => {
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
         console.log('json response mapped: ', res);
         return res;
       }
     })
    });
  },

  savePlaylist: function(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }
    let token, headers, userId, playlistId;
    // get access token
    return this.getAccessToken().then(() => {
      console.log('access token: ', accessToken);
      token = accessToken;
      headers = {Authorization: `Bearer ${token}`};
      // get user id
      fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`,{
       method: 'GET',
       headers: headers
      })
      .then(response => {
       if (response.ok) {
         return response.json();
       }
       throw new Error('Request failed!');
      }, networkError => console.log(networkError.message))
      // set user id
      .then(jsonResponse => {
        userId = jsonResponse.id;
          console.log("my user id:",userId,jsonResponse);
      })
      // post a new playlist
      .then(() => {
        fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists`,{
         method: 'POST',
         headers: headers,
         body: JSON.stringify({name: playlistName}),
         json: true
        })
        .then(response => {
         if (response.ok) {
           return response.json();
         }
         throw new Error('Request failed!');
        }, networkError => console.log(networkError.message))
        // set user id
        .then(jsonResponse => {
          playlistId = jsonResponse.id;
          console.log("my new playlist id:",jsonResponse.id,jsonResponse);
        })
        // post track URIs
        .then(() => {
          fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
           method: 'POST',
           headers: headers,
           body: JSON.stringify({uris: trackURIs}),
           json: true
          })
          .then(response => {
           if (response.ok) {
             return response.json();
           }
           throw new Error('Request failed!');
          }, networkError => console.log(networkError.message))
          // set user id
          .then(jsonResponse => {
            playlistId = jsonResponse.id;
            console.log("my saved playlist:",jsonResponse);
          })
        })
      })
    });
  }
}

export default Spotify;
