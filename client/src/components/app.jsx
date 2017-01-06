import React from 'react';
import socket from './socketio.js';

class App extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    // socket.on('news', function (data) {
    //   console.log(data);
    //   socket.emit('my other event', { my: 'data' });
    // });
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}






module.exports = App;
