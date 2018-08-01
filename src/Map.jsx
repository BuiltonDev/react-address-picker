import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsWrapper from './MapsWrapper';
import Marker from '../resources/marker';

const pointerSize = 40;

class Map extends Component {
  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  componentDidMount() {
    if (navigator.geolocation && this.props.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        this.panTo({lat: latitude, lng: longitude});
        const currentMap = this.map.current.state.map;
        currentMap.setZoom(18);
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.position.lat !== this.props.position.lat ||
        prevProps.position.lng !== this.props.position.lng) {
      this.panTo({lat: this.props.position.lat, lng: this.props.position.lng});
    }
  }

  panTo(position) {
    const currentMap = this.map.current.state.map;
    const latLng = new window.google.maps.LatLng(position.lat, position.lng);
    currentMap.panTo(latLng);
  }

  render() {
    const {position} = this.props;
    return (
      <div style={{
        position: 'relative',
        marginTop: '10px',
        marginBottom: '10px',
      }}>
        <GoogleMapsWrapper
          ref={this.map}
          isMarkerShown
          loadingElement={<div style={{ height: '100%' }} />}
          containerElement={<div style={{ height: '300px' }} />}
          mapElement={<div style={{ height: '100%' }} />}
          defaultZoom={position.zoom }
          defaultCenter={{ lat: position.lat, lng: position.lng }}
          onBoundsChanged={() => {
            const { map } = this.map.current.state;
            if (map.zoom >= 15) {
              const lat = map.center.lat();
              const lng = map.center.lng();
              this.props.onChange({ lat, lng });
            }
          }}
        />
        <div
          style={{
            position: 'absolute',
            height: `${pointerSize}px`,
            width: `${pointerSize}px`,
            top: '50%',
            left: '50%',
            marginTop: `-${(pointerSize / 2)}px`,
            marginLeft: `-${(pointerSize / 2)}px`
          }}
        >
          <Marker />
        </div>
      </div>
    );
  }
}

Map.propTypes = {
  position: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func,
  geolocation: PropTypes.bool
};

export default Map;
