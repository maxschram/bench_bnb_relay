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
                ref={m => this.map = m}
                onIdle={() => {
                  let mapBounds = this.map.getBounds();
                  let bounds = {
                    northEastLat: mapBounds.getNorthEast().lat(),
                    northEastLng: mapBounds.getNorthEast().lng(),
                    southWestLat: mapBounds.getSouthWest().lat(),
                    southWestLng: mapBounds.getSouthWest().lng()
                  };
                  this.props.onIdle(bounds);
                }}
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
