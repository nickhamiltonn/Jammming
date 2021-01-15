import React from 'react';

import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.handleAddArt = this.handleAddArt.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);

  }

  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'}
               onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.playlistTracks}
                   onRemove={this.props.onRemove}
                   isRemoval={true}/>
        <b className="Upload-text">
          Please select jpg file for playlist art below.
        </b>
        <input type="file"
               name="image"
               id="file"
               accept=".jpeg, .jpg" 
               onChange={this.handleAddArt}/>
        <button className="Playlist-save"
                onClick={this.props.onSave}>
          SAVE TO SPOTIFY
        </button>
      </div>
    );
  }

  async handleAddArt(event) {
    let file = event.target.files[0];
    const file64 = await this.convertBase64(file);
    this.props.onAddArt(file64);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }
}

export default Playlist;
