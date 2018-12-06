import React, { Component } from 'react';
import SwaggerUI from 'swagger-ui';

class Docs extends Component {
  componentDidMount = () => {
    SwaggerUI({
      dom_id: '#ui',
      url: 'localhost:3000/swagger.json',
    });
  };

  render = () => <div id="ui" />;
}

export default Docs;
