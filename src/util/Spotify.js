//need to figure out how to hide this stuff when I push code to github
const client_id = "2dc14281ae1c469cb3bb5ed8c99ab9a5"
const redirect_uri = "http://localhost:3000/";

let user_token;
let Spotify = {
  getAccessToken() {
    if (user_token) {
      return user_token;
    } else {
      
      const access_token = window.location.href.match(/access_token=([^&]*)/);
      const expiration_time = window.location.href.match(/expires_in=([^&]*)/);
    
      if (access_token && expiration_time) {
        user_token = access_token[1];
        const expiresIn = Number(expiration_time[1]);
        
        //Clears parameters when access token expires
        window.setTimeout(() => user_token = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return user_token;
      } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public playlist-modify-private ugc-image-upload&redirect_uri=${redirect_uri}`;
      }
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      { headers: 
        {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        console.log(jsonResponse);
        if (!jsonResponse.tracks) {
          return [];
        } 
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      })  
  },

  savePlaylist(name, trackUris, playlistArt) {
    if (!name || !trackUris.length) {
      return;
    } 
      
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const imageHeaders = 
      { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "image/jpeg"
      }
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      console.log(userId);
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name })
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          const playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({ uris: trackUris }) 
            }).then(() => {
              if (playlistArt) {
                const acceptableArt = playlistArt.substring(23);
                console.log(acceptableArt);
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`,
                  {
                    headers: imageHeaders,
                    method: 'PUT',
                    body: acceptableArt
                  })
              }
            })
        })
    })
  }


};

export default Spotify;
