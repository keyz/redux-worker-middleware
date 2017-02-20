import React, { Component, PropTypes } from 'react';
import ChatHeads from './ChatHeads';
import Computations from './Computations';
import topConnector from './topConnector';

class Main extends Component {
  static propTypes = {
    num: PropTypes.number.isRequired,
    normalCalcValue: PropTypes.func.isRequired,
    asyncCalcValue: PropTypes.func.isRequired,
    workerCalcValue: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <ChatHeads />
        <Computations {...this.props} />
      </div>
    );
  }
}

export default topConnector(Main);
