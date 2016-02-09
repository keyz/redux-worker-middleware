import React, { Component, PropTypes } from 'react';

export default class Calculator extends Component {
  static propTypes = {
    times: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    onRun: PropTypes.func.isRequired,
  };

  state = {
    startTime: 0,
  };

  render() {
    const { times, type, onRun } = this.props;
    const onRunThunk = () => onRun(times);

    return (
      <div>
        {type} calculator:
        <button onClick={onRunThunk}>run</button>
      </div>
    );
  }
}
