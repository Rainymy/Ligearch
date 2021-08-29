import React from "react";

class clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date()
    };
  }
  componentDidMount = () => {
    this.timerID = setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }
  componentWillUnmount = () => {
    clearInterval(this.timerID);
  }
  render = () => {
    return(
      <div>
        <span>{this.state.date.toLocaleString()}</span>
      </div>
    );
  }
}

export default clock;