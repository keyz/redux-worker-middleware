import React, { Component } from 'react';
import { StaggeredMotion, spring, presets } from 'react-motion';
import range from 'lodash.range';

import headImg0 from '../../assets/0.jpg';
import headImg1 from '../../assets/1.jpg';
import headImg2 from '../../assets/2.jpg';
import headImg3 from '../../assets/3.jpg';
import headImg4 from '../../assets/4.jpg';
import headImg5 from '../../assets/5.jpg';

const allHeadImgs = [ headImg0, headImg1, headImg2, headImg3, headImg4, headImg5 ];

const styles = {
  container: {
    width: 400,
    height: 400,
    position: 'relative',
    borderRadius: 5,
    background: '#EEE',
  },
  balls: {
    borderRadius: 99,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    border: '3px solid white',
    position: 'absolute',
    backgroundSize: 50,
  },
};

const calcPos = (radius, angle, [ centerX, centerY ]) => ({
  x: Math.sin(angle) * radius + centerX,
  y: Math.cos(angle) * radius + centerY,
});

export default class ChatHeads extends Component {
  constructor(...args) {
    super(...args);
    this.intervalRef = null;
  }

  state = {
    angle: 0,
  };

  componentDidMount() {
    this.intervalRef = window.setInterval(() => {
      this.setState({
        angle: Math.PI / 45 + (this.state.angle >= Math.PI * 2 ? 0 : this.state.angle),
      });
    }, 30);
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalRef);
  }

  getStyles = (prevStyles) => {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => i === 0 ?
      calcPos(100, this.state.angle, [ 200, 200 ]) : {
        x: spring(prevStyles[i - 1].x, presets.gentle),
        y: spring(prevStyles[i - 1].y, presets.gentle),
      });

    return endValue;
  };

  render() {
    return (
      <StaggeredMotion
        defaultStyles={range(6).map(() => ({ x: 50, y: 50 }))}
        styles={this.getStyles}
      >
        {
          (balls) => (
            <div style={styles.container}>
              {
                balls.map(({ x, y }, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.balls,
                      backgroundImage: `url(${allHeadImgs[i]})`,
                      WebkitTransform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                      transform: `translate3d(${x - 25}px, ${y - 25}px, 0)`,
                      transition: 'transform 0.1s linear',
                      zIndex: balls.length - i,
                    }}
                  />
                ))
              }
            </div>
          )
        }
      </StaggeredMotion>
    );
  }
}
