import React, { Component, PropTypes } from 'react';

export default class Calculator extends Component {
  static propTypes = {
    times: PropTypes.number.isRequired,
  };

  state = {
    startTime: 0,
  };

  render() {
    const { times } = this.props;

    return (
      <div>
        {times}
      </div>
    );
  }
}
