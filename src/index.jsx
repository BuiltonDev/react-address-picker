import React, { Component } from 'react';
import Autocomplete from 'react-google-autocomplete';
import PropTypes from 'prop-types';
import Map from './Map';
import debounce from './../utils/debounce';
import styles from './styles'

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasFormBeenEdited: false,
      lat: props.position.lat,
      lng: props.position.lng
    };
    this.props.fields.forEach((field) => {
      this.state[field.id] = ''; // eslint-disable-line react/no-direct-mutation-state
    }, this);
    this.geocode = debounce(this.geocode, 1500);
  }

  fillInAddress(place) {
    const stateCopy = Object.assign({}, this.state);
    this.props.fields.forEach((field) => {
      stateCopy[field.id] = '';
    });

    for (let i = 0; i < place.address_components.length; i += 1) {
      const addressType = place.address_components[i].types[0];
      Object.entries(this.props.fields).forEach(([key, value]) => {
        let googleTypes = value.googleType;
        if (!Array.isArray(googleTypes) && googleTypes) {
          googleTypes = [value.googleType];
        }
        if (googleTypes && stateCopy[value.id] === '') {
          for (let j = 0; j < googleTypes.length; j += 1) {
            if (googleTypes[j] === addressType) {
              stateCopy[value.id] = place.address_components[i][value.googleLongName ? 'long_name' : 'short_name'];
              break;
            }
          }
        }
      });
    }
    this.setState(stateCopy);
  }

  onChange(type, value) {
    this.setState({
      [type]: value,
      hasFormBeenEdited: true
    });
  }

  geocode(search, context) { // eslint-disable-line class-methods-use-this
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(search, (results, status) => {
      if (status === 'OK') {
        if (!context.state.hasFormBeenEdited) { // Can happen before the query resolves.
          context.fillInAddress(results[0]);
        }
      }
    });
  }

  clearForm() {
    const stateCopy = Object.assign({}, this.state);
    this.props.fields.forEach((field) => {
      stateCopy[field.id] = '';
    });
    this.setState({...stateCopy, hasFormBeenEdited: false});
  }

  handleCallback() {
    if (this.props.callback) {
      this.props.callback({
        ...this.state
      });
    }
  }

  renderInput(formType) {
    return (
      <div key={formType.name} style={styles.inputContainer}>
        <div style={styles.formLabel}>
          <label style={styles.inputLabel}>{formType.name}: </label>
          {!formType.required && (
            <span style={styles.optional}>({this.props.text.optional})</span>
          )}
        </div>
        <div style={styles.formInput}>
          {!formType.autocomplete ? (
            <input
              style={{...styles.input}}
              type="input"
              name={formType.name}
              placeholder={formType.name}
              value={this.state[formType.id]}
              onChange={e => this.onChange(formType.id, e.target.value)}
            />
          ) : (
            <Autocomplete
              style={styles.input}
              onPlaceSelected={(place) => {
                this.setState({
                  lng: place.geometry.location.lng(),
                  lat: place.geometry.location.lat()
                });
                this.fillInAddress(place);
              }}
              value={this.state.street_name}
              onChange={e => this.onChange(formType.name, e.target.value)}
              types={['address']}
            />
          )}
        </div>
      </div>
    );
  }

  render() {
    const {lng, lat} = this.state;
    return (
      <div style={styles.container}>
        <div style={{marginBottom: '24px'}}>
          {this.props.fields.map(field => this.renderInput(field))}
        </div>
        <Map
          position={{
            lng,
            lat,
            zoom: 8
          }}
          onChange={ position =>
            !this.state.hasFormBeenEdited && this.geocode({location: position}, this)
          }
          geolocation={this.props.geolocation}
        />
        <div style={{marginTop: '24px'}}>
          <button
            style={styles.okButton}
            type="button"
            onClick={() => this.handleCallback()}
          >
            {this.props.text.okButton}
          </button>
          <button
            style={styles.clearButton}
            type="button"
            onClick={() => this.clearForm()}
          >
            {this.props.text.clearButton}
          </button>
        </div>
      </div>
    );
  }
}

Index.defaultProps = {
  fields: [
    {
      id: 'street_name',
      name: 'Street name',
      googleType: 'route',
      googleLongName: true,
      required: true,
      autocomplete: true
    }, {
      id: 'building',
      name: 'Street number',
      googleType: 'street_number',
      googleLongName: false,
      required: true
    }, {
      id: 'postcode',
      name: 'Postcode',
      googleType: 'postal_code',
      googleLongName: false,
      required: true
    }, {
      id: 'city',
      name: 'City',
      googleType: ['postal_town', 'locality'],
      googleLongName: true,
      required: true
    }, {
      id: 'country',
      name: 'Country',
      googleType: 'country',
      googleLongName: true,
      required: true
    }
  ],
  text: {
    clearButton: 'Clear',
    okButton: 'Ok',
    optional: 'Optional'
  },
  geolocation: true,
};

Index.propTypes = {
  position: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired
  }).isRequired,
  text: PropTypes.shape({
    clearButton: PropTypes.string.isRequired,
    okButton: PropTypes.string.isRequired,
    optional: PropTypes.string.isRequired
  }),
  fields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    required: PropTypes.bool,
    googleType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    googleLongName: PropTypes.bool,
  })),
  geolocation: PropTypes.bool,
  callback: PropTypes.func
};

export default Index;
