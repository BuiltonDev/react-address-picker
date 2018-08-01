import React from 'react';
import { storiesOf } from '@storybook/react';
import AddressReact from '../dist';

storiesOf('Map', module)
  .add('Default', () => (
    <div style={{width: "300px", height: "200px", margin: "auto"}}>
      <AddressReact
        position={{
          lat: 59.9165512,
          lng: 10.7365638,
        }}
        callback={console.log}
      />
    </div>
  ))
  .add('Without geolocation', () => (
    <div style={{width: "300px", height: "200px", margin: "auto"}}>
      <AddressReact
        position={{
          lat: 59.9165512,
          lng: 10.7365638,
        }}
        geolocation={false}
        callback={console.log}
      />
    </div>
  ))
  .add('With custom form', () => (
    <div style={{width: "300px", height: "200px", margin: "auto"}}>
      <AddressReact
        position={{
          lat: 59.9165512,
          lng: 10.7365638,
        }}
        fields={[
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
          }, {
            id: 'organisation',
            name: 'Organisation'
          }
        ]}
        callback={console.log}
      />
    </div>
  ));
