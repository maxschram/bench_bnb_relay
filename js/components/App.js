import React from 'react';
import Relay from 'react-relay';

import Map from './Map';
import Filters from './Filters';

class App extends React.Component {
  setFilter(name, value) {
    this.props.relay.setVariables({
      [name]: parseInt(value)
    });
  }
  setBounds(bounds) {
    this.props.relay.setVariables({
      ...bounds
    });
  }
  render() {
    let variables = this.props.relay.variables;
    return (
      <div>
        <h1>BenchBnB</h1>
        <section>
          <Filters {...variables} onChange={(name, value) => this.setFilter(name, value)}/>
          <ul>
            {this.props.viewer.benches.edges.map(edge => {
              let bench = edge.node;
              return <li key={bench.id}>{bench.description}{bench.seating}</li>
              })
            }
          </ul>
        </section>
        <Map onIdle={(bounds) => this.setBounds(bounds)} benches={this.props.viewer.benches.edges}/>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  initialVariables: {
    minSeating: 1,
    maxSeating: 4,
    northEastLat: 0,
    northEastLng: 0,
    southWestLat: 0,
    southWestLng: 0
  },
  fragments: {
    viewer: () => Relay.QL`
    fragment on User {
      benches(minSeating: $minSeating, maxSeating: $maxSeating, first: 10, northEastLat: $northEastLat, northEastLng: $northEastLng, southWestLat: $southWestLat, southWestLng: $southWestLng) {
        edges {
          node {
           id
           description
           seating
           lat
           lng
          }
        }
     }
    }
    `,
  },
});
