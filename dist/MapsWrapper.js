import "core-js/modules/es6.object.assign";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
export default withGoogleMap(function (props) {
  return React.createElement(GoogleMap, _extends({}, props, {
    ref: props.onMapMounted
  }), props.children);
});