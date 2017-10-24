import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {
          /* <!-- You will add a map method that renders a set of Track components  --> */
          this.props.tracks.map((track, index) =>
            <Track key={index} track={track} onAdd={this.props.onAdd} onRemove={this.props.onRemove} />
          )
        }
      </div>
    );
  }
}

export default TrackList;
