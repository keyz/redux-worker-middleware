import React, { Component, PropTypes } from 'react';

import Calculator from './Calculator';

export default class Computations extends Component {
  static propTypes = {
    num: PropTypes.number.isRequired,
    normalCalcValue: PropTypes.func.isRequired,
    asyncCalcValue: PropTypes.func.isRequired,
    workerCalcValue: PropTypes.func.isRequired,
  };

  state = {
    times: 2000000000,
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
    const {
      num,
      normalCalcValue,
      asyncCalcValue,
      workerCalcValue,
    } = this.props;

    return (
      <div>
        { `current result = ${num}. ` }
        { 'Let\'s run a loop for n times where n = ' }
        <input
          type="number"
          value={times}
          onChange={this.handleInput}
        />
        <Calculator
          times={times}
          type={'normal'}
          onRun={normalCalcValue}
        />
        <Calculator
          times={times}
          type={'async'}
          onRun={asyncCalcValue}
        />
        <Calculator
          times={times}
          type={'worker'}
          onRun={workerCalcValue}
        />
      </div>
    );
  }
}
