import React, { Component } from 'react';
import './Track.css';

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: `Track-action ${this.props.onAdd ? 'isAdd' : 'isRemoval'}`
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack() {
    if (this.props.onAdd) {
      this.props.onAdd(this.props.track);
    }
  }

  removeTrack() {
    if (this.props.onRemove) {
      this.props.onRemove(this.props.track);
    }
  }

  render() {

    let button = null;
    if (this.props.onAdd) {
      button = <a className={this.state.classes} onClick={this.addTrack}>+</a>
    } else {
      button = <a className={this.state.classes} onClick={this.removeTrack}>-</a>
    }

    return (
      <div className="Track">
        <div className="Track-information">
          <h3>
            {this.props.track.name}
          </h3>
          <p>
            {this.props.track.artist} | {this.props.track.album}
          </p>
        </div>
          {button}
        {/* <a className={this.state.classes} onClick={this.addTrack}>
          {this.renderAction()}
        </a> */}
      </div>
    );
  }
}

export default Track;
