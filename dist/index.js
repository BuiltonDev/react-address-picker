import "core-js/modules/es6.object.keys";
import "core-js/modules/es6.function.name";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es7.object.entries";
import "core-js/modules/es6.object.assign";
import "core-js/modules/web.dom.iterable";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React, { Component } from 'react';
import Autocomplete from 'react-google-autocomplete';
import PropTypes from 'prop-types';
import Map from './Map';
import debounce from './../utils/debounce';
import styles from './styles';

var Index = function (_Component) {
  _inheritsLoose(Index, _Component);

  function Index(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    _this.state = {
      hasFormBeenEdited: false,
      lat: props.position.lat,
      lng: props.position.lng
    };

    _this.props.fields.forEach(function (field) {
      _this.state[field.id] = '';
    }, _assertThisInitialized(_assertThisInitialized(_this)));

    _this.geocode = debounce(_this.geocode, 1500);
    return _this;
  }

  var _proto = Index.prototype;

  _proto.fillInAddress = function fillInAddress(place) {
    var _this2 = this;

    var stateCopy = Object.assign({}, this.state);
    this.props.fields.forEach(function (field) {
      stateCopy[field.id] = '';
    });

    var _loop = function _loop(i) {
      var addressType = place.address_components[i].types[0];
      Object.entries(_this2.props.fields).forEach(function (_ref) {
        var key = _ref[0],
            value = _ref[1];
        var googleTypes = value.googleType;

        if (!Array.isArray(googleTypes) && googleTypes) {
          googleTypes = [value.googleType];
        }

        if (googleTypes && stateCopy[value.id] === '') {
          for (var j = 0; j < googleTypes.length; j += 1) {
            if (googleTypes[j] === addressType) {
              stateCopy[value.id] = place.address_components[i][value.googleLongName ? 'long_name' : 'short_name'];
              break;
            }
          }
        }
      });
    };

    for (var i = 0; i < place.address_components.length; i += 1) {
      _loop(i);
    }

    this.setState(stateCopy);
  };

  _proto.onChange = function onChange(type, value) {
    var _this$setState;

    this.setState((_this$setState = {}, _this$setState[type] = value, _this$setState.hasFormBeenEdited = true, _this$setState));
  };

  _proto.geocode = function geocode(search, context) {
    var geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(search, function (results, status) {
      if (status === 'OK') {
        if (!context.state.hasFormBeenEdited) {
          context.fillInAddress(results[0]);
        }
      }
    });
  };

  _proto.clearForm = function clearForm() {
    var stateCopy = Object.assign({}, this.state);
    this.props.fields.forEach(function (field) {
      stateCopy[field.id] = '';
    });
    this.setState(_objectSpread({}, stateCopy, {
      hasFormBeenEdited: false
    }));
  };

  _proto.handleCallback = function handleCallback() {
    if (this.props.callback) {
      this.props.callback(_objectSpread({}, this.state));
    }
  };

  _proto.renderInput = function renderInput(formType) {
    var _this3 = this;

    return React.createElement("div", {
      key: formType.name,
      style: styles.inputContainer
    }, React.createElement("div", {
      style: styles.formLabel
    }, React.createElement("label", {
      style: styles.inputLabel
    }, formType.name, ": "), !formType.required && React.createElement("span", {
      style: styles.optional
    }, "(", this.props.text.optional, ")")), React.createElement("div", {
      style: styles.formInput
    }, !formType.autocomplete ? React.createElement("input", {
      style: _objectSpread({}, styles.input),
      type: "input",
      name: formType.name,
      placeholder: formType.name,
      value: this.state[formType.id],
      onChange: function onChange(e) {
        return _this3.onChange(formType.id, e.target.value);
      }
    }) : React.createElement(Autocomplete, {
      style: styles.input,
      onPlaceSelected: function onPlaceSelected(place) {
        _this3.setState({
          lng: place.geometry.location.lng(),
          lat: place.geometry.location.lat()
        });

        _this3.fillInAddress(place);
      },
      value: this.state.street_name,
      onChange: function onChange(e) {
        return _this3.onChange(formType.name, e.target.value);
      },
      types: ['address']
    })));
  };

  _proto.render = function render() {
    var _this4 = this;

    var _this$state = this.state,
        lng = _this$state.lng,
        lat = _this$state.lat;
    return React.createElement("div", {
      style: styles.container
    }, React.createElement("div", {
      style: {
        marginBottom: '24px'
      }
    }, this.props.fields.map(function (field) {
      return _this4.renderInput(field);
    })), React.createElement(Map, {
      position: {
        lng: lng,
        lat: lat,
        zoom: 8
      },
      onChange: function onChange(position) {
        return !_this4.state.hasFormBeenEdited && _this4.geocode({
          location: position
        }, _this4);
      },
      geolocation: this.props.geolocation
    }), React.createElement("div", {
      style: {
        marginTop: '24px'
      }
    }, React.createElement("button", {
      style: styles.okButton,
      type: "button",
      onClick: function onClick() {
        return _this4.handleCallback();
      }
    }, this.props.text.okButton), React.createElement("button", {
      style: styles.clearButton,
      type: "button",
      onClick: function onClick() {
        return _this4.clearForm();
      }
    }, this.props.text.clearButton)));
  };

  return Index;
}(Component);

Index.defaultProps = {
  fields: [{
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
  }],
  text: {
    clearButton: 'Clear',
    okButton: 'Ok',
    optional: 'Optional'
  },
  geolocation: true
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
    googleLongName: PropTypes.bool
  })),
  geolocation: PropTypes.bool,
  callback: PropTypes.func
};
export default Index;