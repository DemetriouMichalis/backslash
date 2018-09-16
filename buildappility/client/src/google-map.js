import React, { Component } from 'react';
import { Script } from 'vm';

class GoogleMap extends Component {
	state = { key: "AIzaSyAfdSNpS-ea8TiGPChHC1rYkKkUD9jOn7w" }
	render() {
		return (
			<div id="map"></div>
			<script async defer src="https://maps.googleapis.com/maps/api/js?key={this.state.key}%26callback=initMap"></script>
		);
	}
}
/*
AIzaSyAfdSNpS-ea8TiGPChHC1rYkKkUD9jOn7w
*/

export default GoogleMap