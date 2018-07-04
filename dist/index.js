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
    var stateCopy = Object.assign({}, this.state);
    this.props.fields.forEach(function (field) {
      stateCopy[field.id] = '';
    });
    var fields = [];
    this.props.fields.forEach(function (field) {
      fields[field.id] = field;
    });

    var _loop = function _loop(i) {
      var addressType = place.address_components[i].types[0];

      if (fields[addressType]) {
        stateCopy[addressType] = place.address_components[i][fields[addressType].google_type];
      } else {
        Object.entries(fields).forEach(function (_ref) {
          var key = _ref[0],
              value = _ref[1];

          if (value.fallbacks && stateCopy[key] === '') {
            for (var j = 0; j < value.fallbacks.length; j += 1) {
              var fallback = value.fallbacks[j];

              if (fallback === addressType) {
                stateCopy[key] = place.address_components[i][fields[key].google_type];
                break;
              }
            }
          }
        });
      }
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
    var _this2 = this;

    return React.createElement("div", {
      key: formType.name,
      style: {
        display: 'flex'
      }
    }, React.createElement("div", {
      style: {
        flex: 0.6
      }
    }, React.createElement("label", null, formType.name, formType.required && '*', ": ")), React.createElement("div", {
      style: {
        flex: 1
      }
    }, !formType.autocomplete ? React.createElement("input", {
      style: formType.inputSize && {
        width: formType.inputSize
      },
      type: "input",
      name: formType.name,
      placeholder: formType.name,
      value: this.state[formType.id],
      onChange: function onChange(e) {
        return _this2.onChange(formType.id, e.target.value);
      }
    }) : React.createElement(Autocomplete, {
      onPlaceSelected: function onPlaceSelected(place) {
        _this2.setState({
          lng: place.geometry.location.lng(),
          lat: place.geometry.location.lat()
        });

        _this2.fillInAddress(place);
      },
      value: this.state.route,
      onChange: function onChange(e) {
        return _this2.onChange(formType.name, e.target.value);
      },
      types: ['address']
    })));
  };

  _proto.render = function render() {
    var _this3 = this;

    var _this$state = this.state,
        lng = _this$state.lng,
        lat = _this$state.lat;
    return React.createElement("div", {
      style: {
        border: '2px solid orange',
        borderRadius: '15px',
        padding: '10px',
        background: 'repeating-linear-gradient(-45deg, #fcfdff, #fcfdff 5px, white 5px, white 10px)'
      }
    }, React.createElement("div", null, this.props.fields.map(function (field) {
      return _this3.renderInput(field);
    })), React.createElement(Map, {
      position: {
        lng: lng,
        lat: lat,
        zoom: 8
      },
      onChange: function onChange(position) {
        return !_this3.state.hasFormBeenEdited && _this3.geocode({
          location: position
        }, _this3);
      }
    }), React.createElement("div", null, React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return _this3.clearForm();
      }
    }, this.props.text.clearButton), React.createElement("button", {
      type: "button",
      onClick: function onClick() {
        return _this3.handleCallback();
      }
    }, this.props.text.okButton)));
  };

  return Index;
}(Component);

Index.defaultProps = {
  fields: [{
    id: 'route',
    name: 'Street name',
    google_label: 'street_name',
    google_type: 'long_name',
    required: true,
    autocomplete: true
  }, {
    id: 'street_number',
    name: 'Street number',
    google_label: 'street_number',
    google_type: 'short_name',
    required: true,
    inputSize: '50%'
  }, {
    id: 'postal_code',
    name: 'Postcode',
    google_label: 'postcode',
    google_type: 'short_name',
    required: true,
    inputSize: '50%'
  }, {
    id: 'postal_town',
    name: 'City',
    google_label: 'city',
    google_type: 'long_name',
    fallbacks: ['locality'],
    required: true
  }, {
    id: 'country',
    name: 'Country',
    google_label: 'country',
    google_type: 'long_name',
    required: true
  }],
  text: {
    clearButton: 'Clear',
    okButton: 'Ok'
  }
};
Index.propTypes = {
  position: PropTypes.shape({
    lng: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired
  }).isRequired,
  text: PropTypes.shape({
    clearButton: PropTypes.string.isRequired,
    okButton: PropTypes.string.isRequired
  }),
  fields: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    required: PropTypes.bool.isRequired,
    google_label: PropTypes.string,
    google_type: PropTypes.string,
    fallbacks: PropTypes.arrayOf(PropTypes.string)
  })),
  callback: PropTypes.func
};
export default Index;