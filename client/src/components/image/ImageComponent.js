import React, { Component } from 'react';
import './ImageComponent.css';
import Spinner from './Spinner';
import Images from './Images';
import Buttons from './Buttons';

export default class ImageComponent extends Component {
  state = {
    uploading: false,
    image: null,
  };

  onChange = e => {
    const files = Array.from(e.target.files);
    this.setState({ uploading: true });

    const formData = new FormData();

    files.forEach((file, i) => {
      formData.append(i, file);
    });

    fetch(`http://localhost:3000/api/images/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(image => {
        this.setState({
          uploading: false,
          image,
        });
      });
  };

  removeImage = id => {
    this.setState({
      image: null,
    });
  };

  render() {
    const { uploading, image } = this.state;

    const content = () => {
      switch (true) {
        case uploading:
          return <Spinner />;
        case image:
          return <Images image={image} removeImage={this.removeImage} />;
        default:
          return <Buttons onChange={this.onChange} />;
      }
    };

    return (
      <div>
        <div className="buttons">{content()}</div>
      </div>
    );
  }
}
