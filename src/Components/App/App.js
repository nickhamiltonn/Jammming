import React from 'react';

import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.addArt = this.addArt.bind(this);

    this.state =
    { searchResults: [],
      playlistName: "New Playlist",
      playlistTracks: [],
      playlistArt: null
    };
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}
                      onAddArt={this.addArt}/>
          </div>
        </div>
      </div>
    );
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.setState({playlistTracks: [...this.state.playlistTracks, track]});
    }
  }

  removeTrack(track) {
    const updatedTracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
    if (updatedTracks.length !== this.state.playlistTracks.length) {
      this.setState({playlistTracks: updatedTracks});
    }
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    console.log(trackURIs);
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistArt).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      });
    });
  }

  addArt(image) {
    this.setState({ playlistArt: image });
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults });
    });
  }
}

export default App;
