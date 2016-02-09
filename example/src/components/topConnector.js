import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  workerCalcValue,
  normalCalcValue,
  asyncCalcValue,
} from '../actions';

// as-is
const mapStateToProps = (storeState) => storeState;

// bind action creators here
const mapDispatchToProps = (dispatch) => bindActionCreators({
  workerCalcValue,
  normalCalcValue,
  asyncCalcValue,
}, dispatch);

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps, // this is just a number for now
  ...dispatchProps,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps);
