function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapsWrapper from './MapsWrapper';
import Marker from '../resources/marker';
var pointerSize = 40;

var Map = function (_Component) {
  _inheritsLoose(Map, _Component);

  function Map(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.map = React.createRef();
    return _this;
  }

  var _proto = Map.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (navigator.geolocation && this.props.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var _position$coords = position.coords,
            latitude = _position$coords.latitude,
            longitude = _position$coords.longitude;

        _this2.panTo({
          lat: latitude,
          lng: longitude
        });

        var currentMap = _this2.map.current.state.map;
        currentMap.setZoom(18);
      });
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (prevProps.position.lat !== this.props.position.lat || prevProps.position.lng !== this.props.position.lng) {
      this.panTo({
        lat: this.props.position.lat,
        lng: this.props.position.lng
      });
    }
  };

  _proto.panTo = function panTo(position) {
    var currentMap = this.map.current.state.map;
    var latLng = new window.google.maps.LatLng(position.lat, position.lng);
    currentMap.panTo(latLng);
  };

  _proto.render = function render() {
    var _this3 = this;

    var position = this.props.position;
    return React.createElement("div", {
      style: {
        position: 'relative',
        marginTop: '10px',
        marginBottom: '10px'
      }
    }, React.createElement(GoogleMapsWrapper, {
      ref: this.map,
      isMarkerShown: true,
      loadingElement: React.createElement("div", {
        style: {
          height: '100%'
        }
      }),
      containerElement: React.createElement("div", {
        style: {
          height: '300px'
        }
      }),
      mapElement: React.createElement("div", {
        style: {
          height: '100%'
        }
      }),
      defaultZoom: position.zoom,
      defaultCenter: {
        lat: position.lat,
        lng: position.lng
      },
      onBoundsChanged: function onBoundsChanged() {
        var map = _this3.map.current.state.map;

        if (map.zoom >= 15) {
          var lat = map.center.lat();
          var lng = map.center.lng();

          _this3.props.onChange({
            lat: lat,
            lng: lng
          });
        }
      }
    }), React.createElement("div", {
      style: {
        position: 'absolute',
        height: pointerSize + "px",
        width: pointerSize + "px",
        top: '50%',
        left: '50%',
        marginTop: "-" + pointerSize / 2 + "px",
        marginLeft: "-" + pointerSize / 2 + "px"
      }
    }, React.createElement(Marker, null)));
  };

  return Map;
}(Component);

Map.propTypes = {
  position: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired
  }).isRequired,
  onChange: PropTypes.func,
  geolocation: PropTypes.bool
};
export default Map;