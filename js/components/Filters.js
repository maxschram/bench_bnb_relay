import React from 'react';
import Relay from 'react-relay';

class Filters extends React.Component {
  render() {
    return (
      <div>
        <label>Min seats</label>
        <input
          type="number"
          name="minSeating"
          value={this.props.minSeating}
          onChange={e => {
            this.props.onChange(e.target.name, e.target.value);
          }}/>
        <br />
        <label>Min seats</label>
        <input
          type="number"
          name="maxSeating"
          value={this.props.maxSeating}
          onChange={e => {
            this.props.onChange(e.target.name, e.target.value);
          }}
        />
       </div>
    );
  }
}

export default Relay.createContainer(Filters, {
  fragments: {
  }
});

