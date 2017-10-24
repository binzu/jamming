import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: 'New Playlist',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // add a track
  addTrack(track) {
    let playlist = this.state.playlistTracks;
    let index = playlist.findIndex(x => x.id === track.id);
    // check if it exists in playlist
    if (index === -1) {
      playlist.push(track);
      this.setState({playlistTracks:playlist});
      this.render();
    }
  }

  // remove a track
  removeTrack(track) {
    let playlist = this.state.playlistTracks;
    let index = playlist.findIndex(x => x.id === track.id);
    if (index > -1) {
      playlist.splice(index,1);
      this.setState({playlistTracks:playlist});
      this.render();
    }
  }

  // update playlist name
  updatePlaylistName(name) {
    this.setState({playListName:name});
  }

  // save playlist name
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playListName, trackURIs).then((results) => {
        this.setState({
            searchResults: [],
            playListName: 'New Playlist',
            playlistTracks: []
        });
      });
  }

  // search Spotify
  search(term) {
    Spotify.search(term).then((results) => {
      if (results) {
        this.setState({ searchResults: results });
      }
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playListName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
