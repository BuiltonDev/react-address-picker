import React from 'react';
import { storiesOf } from '@storybook/react';
import App from '../dist';

storiesOf('Map', module)
  .add('Default', () => (
    <div style={{width: "300px", height: "200px", margin: "auto"}}>
      <App
        position={{
          lat: 59.9165512,
          lng: 10.7365638,
        }}
        callback={console.log}
      />
    </div>
  ))
  .add('With custom form', () => (
    <div style={{width: "300px", height: "200px", margin: "auto"}}>
      <App
        position={{
          lat: 59.9165512,
          lng: 10.7365638,
        }}
        fields={[
          {
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
            required: true
          }, {
            id: 'postal_code',
            name: 'Postcode',
            google_label: 'postcode',
            google_type: 'short_name',
            required: true
          }, {
            id: 'postal_town',
            name: 'City',
            google_label: 'city',
            google_type: 'long_name',
            fallbacks: ['locality'],
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
