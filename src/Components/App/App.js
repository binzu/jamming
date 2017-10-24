import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);

    console.log('app pathname: ', window.location.href);

    this.state = {
      searchResults: [
        { id:1, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' },
        { id:2, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' },
        { id:3, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' },
        { id:4, name: 'Lorem new', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' },
        { id:5, name: 'Lorem new 2', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' }
      ],
      playListName: 'My Playlist',
      playlistTracks: [
        { id:1, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:3W3KtDwAIg3mAruSpnfG3Q' },
        { id:2, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:7b71WsDLb8gG0cSyDTFAEW' },
        { id:3, name: 'Lorem', artist: 'Impsum', album: 'Dolor', uri:'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' }
      ]
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
    console.log('found track index: ', index);
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
    console.log('found track index: ', index);
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
      console.log('saved: ', results);
      this.setState({searchResults: []});
      this.updatePlaylistName('');
    });
    // console.log('saved: ', this.state.playListName, this.state.playlistTracks);
  }

  // search Spotify
  search(term) {
    console.log('search term: ',term);
    Spotify.search(term).then((results) => {
      if (results) {
        console.log('search app tracks: ', results);
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
