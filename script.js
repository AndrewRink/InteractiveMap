// Get the user's coordinates:                                                              
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
};    

const myMap =  L.map('map', {
    center: [35.5898153,-80.8670589],
    zoom: 12,
});
//adds street tile
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
}).addTo(myMap)
//Finds user Location and pans to
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => myMap.panTo([position.coords.latitude, position.coords.longitude]),
        (err) => console.warn(`Geolocation error (${err.code}): ${err.message}`),
        {timeout: 20000} //Timeout in ms
    );
}

//adds user location marker
navigator.geolocation.getCurrentPosition(position => {
    const { coords: { latitude, longitude }} = position;
    var marker = new L.marker([latitude, longitude], {
      draggable: true,
      autoPan: true
    }).addTo(myMap).bindPopup('<p1><b>Your Current Location</b></p1>').openPopup();

    console.log(marker);
})

//make Go button functional
document.getElementById('go').addEventListener('click', () => {
    let business = document.getElementById('businesses').value
    console.log(business)
})

