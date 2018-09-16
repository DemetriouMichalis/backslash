const fs = require('fs');
const xmljs = require('xml-js');
const geolib = require('geolib');
console.time('load')
const zones = require('./abc.json');
const rawair = xmljs.xml2json(fs.readFileSync("C:\\code\\hackathon\\test\\air.xml"), { compact: true, ignoreCdata: true })
const airpollution = JSON.parse(rawair);
//fs.writeFileSync('air-pollution.json', JSON.stringify(JSON.parse(rawair), null, '\t'))
console.timeEnd('load')
//corrdinates
console.time('preprocess')
for (var i = 0; i < zones.features.length; i += 1) {
	var elem = zones.features[i].geometry.coordinates;
	for (var ii; ii < elem.length; ii += 1) {
		elem[ii] = elem[ii].map((v) => {
			return { latitude: v[1], longitude: v[0] }
		})
	}
}
airpollution.air_quality.stations.station = airpollution.air_quality.stations.station.map((v) => {
	var newV = {};
	Object.keys(v).forEach(vv => newV[vv] = v[vv]._text);
	return newV;
})
airpollution.air_quality.pollutants.pollutant = airpollution.air_quality.pollutants.pollutant.map((v) => {
	var newV = {};
	Object.keys(v).forEach(vv => newV[vv] = v[vv]._text);
	return newV;
})
/*
data.features.map((v, i) => {
	v.geometry.coordinates = v.geometry.coordinates.map((v) => {
		if (v.length < 1 || typeof v != 'map') { console.log(i, 'or not a map'); return v }
		return v.map(vv => {
			return { latitude: vv[1], longitude: vv[1] }
		});
	})
	return v;
});
*/
console.timeEnd('preprocess')

console.time('search');
const referencePoint = //{ latitude: 35.104096, longitude: 33.346391 };
	//{ latitude: 34.690072, longitude: 33.036531 };
	{ latitude: parseFloat(process.argv[2]), longitude: process.argv[3] };


let zoneCodes = [];
for (var i = 0; i < zones.features.length; i += 1) {
	if (geolib.isPointInside(
		referencePoint,
		zones.features[i].geometry.coordinates[0]
	)) {
		//console.log(zones.features[i].properties.name, "polygon edges", zones.features[i].geometry.coordinates.length);
		zoneCodes.push(zones.features[i].properties);
		//break;
	}
}

var stations = airpollution.air_quality.stations.station.reduce((p, v) => {
	if (!p.find((vv) => vv.station_code == v.station_code)) {
		p.push(v);
	}
	return p;
}, []);

var closestStation = stations.slice(1).reduce((p, c) => {
	let cLoc = { latitude: parseFloat(c.station_latitude), longitude: c.station_longitude };
	let pLoc = { latitude: parseFloat(p.station_latitude), longitude: p.station_longitude };
	return geolib.getDistance(referencePoint, cLoc) < geolib.getDistance(referencePoint, pLoc) ? c : p;
}, stations[0])

var measurements = airpollution.air_quality.stations.station.filter(v => v.station_code == closestStation.station_code);
measurements.map((v) => {
	var pollutant = airpollution.air_quality.pollutants.pollutant.find(vv => vv.id == v.pollutant_code)
	v.pollutant_name = pollutant.name_en
	return v;
})
console.timeEnd('search');

console.log("urbal planning zone:", JSON.stringify(zoneCodes, null, '\t'));
console.log("air pollution:", JSON.stringify(measurements, null, '\t'));