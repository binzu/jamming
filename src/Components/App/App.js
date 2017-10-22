import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        { id:1, name: 'Lorem', artist: 'Impsum', album: 'Dolor' },
        { id:2, name: 'Lorem', artist: 'Impsum', album: 'Dolor' },
        { id:3, name: 'Lorem', artist: 'Impsum', album: 'Dolor' },
        { id:4, name: 'Lorem new', artist: 'Impsum', album: 'Dolor' },
        { id:5, name: 'Lorem new 2', artist: 'Impsum', album: 'Dolor' }
      ],
      playListName: 'My Playlist',
      playlistTracks: [
        { id:1, name: 'Lorem', artist: 'Impsum', album: 'Dolor' },
        { id:2, name: 'Lorem', artist: 'Impsum', album: 'Dolor' },
        { id:3, name: 'Lorem', artist: 'Impsum', album: 'Dolor' }
      ]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
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

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playListName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
