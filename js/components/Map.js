import React from 'react';
import Relay from 'react-relay';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";

class Map extends React.Component {
  render() {
    return (
      <section style={{height: "500px"}}>
        <GoogleMapLoader
          containerElement={
            <div
              {...this.props}
              style={{
                height: "100%",
              }}
            />
            }
            googleMapElement={
              <GoogleMap
                ref={(map) => console.log(map)}
                defaultZoom={12}
                defaultCenter={{lat: 37.753, lng: -122.457}}
              >
                {this.props.benches.map((edge, index) => {
                  let bench = edge.node;
                  return (
                    <Marker
                      key={bench.id}
                      position={{lat: bench.lat, lng: bench.lng}}
                      {...bench}
                    />
                    );
                })}
              </GoogleMap>
              }
            />
          </section>
    );
  }
}
export default Map;
//
// export default Relay.createContainer(Map, {
//   fragments: {
//     benches: () => Relay.QL`
//       fragment on Bench @relay(plural: true){
//         lat
//         lng
//         description
//       }
//    `,
//   }
// });
