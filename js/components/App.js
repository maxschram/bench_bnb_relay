import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>BenchBnB</h1>
        <ul>
          {this.props.viewer.benches.map(bench => {
            return <li key={bench.id}>{bench.description}{bench.seating}</li>
           })
          }
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        benches {
          id
          description
          seating
        }
      }
    `,
  },
});
