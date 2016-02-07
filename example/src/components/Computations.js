import React, { Component, PropTypes } from 'react';

import Calculator from './Calculator';

export default class Computations extends Component {
  static propTypes = {

  };

  state = {
    times: 1000000,
  };

  handleInput = (evt) => {
    const { value } = evt.target;
    const times = parseInt(value, 10);
    this.setState({
      times: isNaN(times) ? 0 : times,
    });
  };

  render() {
    const { times } = this.state;

    return (
      <div>
        { 'Let\'s run a loop for n times where n = ' }
        <input
          type="number"
          value={times}
          onChange={this.handleInput}
        />
        <Calculator times={times}/>
        <Calculator times={times}/>
        <Calculator times={times}/>
      </div>
    );
  }
}
