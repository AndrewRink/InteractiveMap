const myMap = {
    coordinates: [],
    businesses: [],
    map: {},
    markers: {},

    buildMap() {
        this.map = L.map('map', {
            center: this.coordinates,
            zoom: 12,
        });
        //adds street tile
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: '15',
        }).addTo(this.map)

        const marker = L.marker (this.coordinates)
        marker
            .addTo(this.map)
            .bindPopup(`<p1><b>Your Current Location</b><br></p1>`)
            .openPopup()
    },

    //add business markers
    addMarkers () {
        for (var i = 0; i < this.businesses.length; i++) {
            this.markers = L.marker([
                this.businesses[i].lat,
                this.businesses[i].long,
            ])
            .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
            .addTo(this.map)
        }

    },
}


// Get the user's coordinates:                                                              
async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
} 

//using Foursquare Api
async function foursquare(business) {
    const options = {
        method: 'GET',
        headers:{
           Accept: 'application/json',
           Authorization: 'fsq3u3NABI2FseBdvmlZCNRGhRf8ufQqEZN5yQhPwk1AEP0='
        }
    }
    let limit = 5
    let lat = myMap.coordinates[0]
    let lon = myMap.coordinates[1]
    let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
    let data = await response.text()
    let parsedData = JSON.parse(data)
    let businesses = parsedData.results
    return businesses
}
 
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}  
// //Finds user Location and pans to
// if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//         (position) => myMap.panTo([position.coords.latitude, position.coords.longitude]),
//         (err) => console.warn(`Geolocation error (${err.code}): ${err.message}`),
//         {timeout: 20000} //Timeout in ms
//     );
// }

// //adds user location marker
// navigator.geolocation.getCurrentPosition(position => {
//     const { coords: { latitude, longitude }} = position;
//     var marker = new L.marker([latitude, longitude], {
//       draggable: true,
//       autoPan: true
//     }).addTo(myMap).bindPopup('<p1><b>Your Current Location</b></p1>').openPopup();

//     console.log(marker);
// })

window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
document.getElementById('goButton').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await foursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})



