import React, { Component } from "react";
import { withGoogleMap, withScriptjs, GoogleMap } from "react-google-maps";

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  render() {
    const GoogleMapExample = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          ref={map => {
            this.map = map;
          }}
          onIdle={props.onMapIdle}
          defaultCenter={{ lat: 54.6989093, lng: -113.7108127 }}
          defaultZoom={3}
        />
      ))
    );
    return (
      <div>
        <GoogleMapExample
          onMapIdle={() => {
            let ne = this.map.getBounds().getNorthEast();
            let sw = this.map.getBounds().getSouthWest();
            console.log(ne.lat() + ";" + ne.lng());
            console.log(sw.lat() + ";" + sw.lng());
          }}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBkQkbyeCIhTDf2nKPBYQVl2CN_VFjTBDU"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default Map;
