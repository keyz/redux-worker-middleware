import React, { Component } from 'react';
import ChatHeads from './ChatHeads';
import Computations from './Computations';

export default class Main extends Component {
  render() {
    return (
      <div>
        <ChatHeads />
        <Computations />
      </div>
    );
  }
}
