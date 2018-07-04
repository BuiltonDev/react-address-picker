import React from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';

export default withGoogleMap(props => <GoogleMap {...props} ref={props.onMapMounted}>{props.children}</GoogleMap>);
