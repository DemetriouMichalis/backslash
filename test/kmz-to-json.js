const kmzgeojson = require('kmz-geojson');
const http = require('http');
const xmljs = require('xml-js');
const URL = require('url');
const fs = require('fs')

var data_sources = [
	{ name: "postal-codes", type: "kmz", url: "https://www.data.gov.cy/sites/default/files/%CE%8C%CF%81%CE%B9%CE%B1%20%CE%A4%CE%B1%CF%87%CF%85%CE%B4%CF%81%CE%BF%CE%BC%CE%B9%CE%BA%CF%8E%CE%BD%20%CE%A4%CE%BF%CE%BC%CE%AD%CF%89%CE%BD%20-%20%CE%A6%CE%B5%CE%B2%CF%81%CE%BF%CF%85%CE%AC%CF%81%CE%B9%CE%BF%CF%82%202018%20%282%29.kmz" },
	{ name: "urban-planning-zones", type: "kmz", url: "https://www.data.gov.cy/sites/default/files/%CE%A0%CE%BF%CE%BB%CE%B5%CE%BF%CE%B4%CE%BF%CE%BC%CE%B9%CE%BA%CE%AD%CF%82%20%CE%96%CF%8E%CE%BD%CE%B5%CF%82%20-%20%CE%9C%CE%AC%CF%81%CF%84%CE%B9%CE%BF%CF%82%202016.kmz" },
	{ name: "air-pollution", type: "xml", url: "http://178.62.245.17/air/airquality.php" }
]
/*
const url = "https://www.data.gov.cy/sites/default/files/%CE%8C%CF%81%CE%B9%CE%B1%20%CE%94%CE%AE%CE%BC%CF%89%CE%BD%20%E2%80%93%20%CE%9A%CE%BF%CE%B9%CE%BD%CE%BF%CF%84%CE%AE%CF%84%CF%89%CE%BD%20%E2%80%93%20%CE%95%CE%BD%CE%BF%CF%81%CE%B9%CF%8E%CE%BD%20%28%CE%91%CE%B3%CE%B3%CE%BB%CE%B9%CE%BA%CE%AC%29.kmz";
const url2 = "https://www.data.gov.cy/sites/default/files/%CE%A0%CE%BF%CE%BB%CE%B5%CE%BF%CE%B4%CE%BF%CE%BC%CE%B9%CE%BA%CE%AD%CF%82%20%CE%96%CF%8E%CE%BD%CE%B5%CF%82%20-%20%CE%9C%CE%AC%CF%81%CF%84%CE%B9%CE%BF%CF%82%202016.kmz"

kmzgeojson.toGeoJSON(url, function (err, json) {
	if (err) {
		return console.log('while getting json', err);
	}
	require('fs').writeFile('municipalities.json', JSON.stringify(json), 'utf8', (e) => {
		if (e) {
			console.log('while writing file to disk', e);
		}
	})
});
//*/
//*
const GetGeoJSONFromKMZ = (url) => new Promise((res, rej) => kmzgeojson.toGeoJSON(url, (e, json) => e ? res(e) : rej(json)));
const GetGeoJSONFromXML = (url) => new Promise((res, rej) => {
	var parsedUrl = URL.parse(url);
	http.get({
		hostname: parsedUrl.hostname,
		path: parsedUrl.path,
	}, (incmsg) => {
		const chunks = [];
		incmsg.on('error', e => rej(e));
		incmsg.on('data', c => chunks.push(c));
		incmsg.on('end', () => {
			console.log('got response')
			let xml = chunks.join().trim();
			fs.writeFile(xml, 'air.xml', 'utf8', (e) => {
				if (e) console.log(e)
				//res(xmljs.xml2json(xml.replace('\n', '')));
			});

		});
	})
});
const writeToDiskAsync = (data, filepath) => new Promise((res, rej) => fs.writeFile(filepath, JSON.stringify(data), 'utf8', (e) => e ? rej(e) : res()));

(async () => {
	try {
		let data = await GetGeoJSONFromXML(data_sources[2].url);
		await writeToDiskAsync(data, `${data_sources[2].name}.json`);
	} catch (e) {
		console.log(e);
	}
})()


/*
(async () => {
	for (var i = 0; i < data_sources.length; i += 1) {
		let data;
		if (data_sources[i].type == "kmz") {
			data = await GetGeoJSONFromKMZ(data_sources[i].url);
		} else {
			data = await GetGeoJSONFromXML(data_sources[i].url);
		}
	}
})()


/*
data_sources.forEach((v) => {
	if (v.type == "kmz") {
		GetGeoJSONFromKMZ(v.url).then((data) => {
			writeToDiskAsync(data, `${v.name}.json`).catch((e) => { console.log(e) });
		});
	} else {
		GetGeoJSONFromXML(v.url).then((data) => {
			writeToDiskAsync(data, `${v.name}.json`).catch((e) => { console.log(e) });
		}).catch((e) => { console.log(e) })
	}
});
//*/