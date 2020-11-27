{const ipField = document.getElementById('ip');
const locationField = document.getElementById('location');
const timezoneField = document.getElementById('timezone');
const ispField = document.getElementById('isp');
const btn = document.getElementById('searchBtn');
const inputField = document.getElementById('input');
const dataField = document.getElementById('data');

//Creating a marker on the layer and not directly on the map, we do that so we can 
//easily delete earlier markers before going to new location.
let markers = new L.FeatureGroup();

//Instantiating a map at default lat and lng
let map = L.map('map').setView([51.5, -0.09], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


async function fetchIpData(ip){
    const response = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_uoG07zaOSIGD3Q6jsVDi0TPWiIN6S&ipAddress=${ip}`);
    const data = await response.json();

    return data;
}


function updateUi(data){
    ipField.innerText = data.ip;
    locationField.innerText = data.location.country + ", " + data.location.region;
    timezoneField.innerText = "UTC " + data.location.timezone;
    ispField.innerText = data.isp;
}

function clearSearch(){
    inputField.value = '';
}

function updateMap(lat, log){
    addMarker(lat, log);
    goTo(lat, log);
}

function goTo(lat, log){
    map.flyTo([lat, log], 13);
}

function clearMarker(){
    markers.clearLayers();
}

function addMarker(lat, log){
    clearMarker(); 

    marker = L.marker([lat, log]);
    markers.addLayer(marker);
    map.addLayer(markers);
}

function isValidIp(ip){
    let pattern = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    return ip.match(pattern);
}


function onClick(e){
    e.preventDefault();
    const input = getUserInput();
    
    resolveData(input);

    clearSearch();
}

function fadeDivIn(){
    if(!data.classList.contains('show')) data.classList.add('show');
}

function resolveData(input){
    if(isValidIp(input)){
        fetchIpData(input).then(data => {
            fadeDivIn();
            updateMap(data.location.lat, data.location.lng);
            updateUi(data);
        }).catch(err => alert(`Something went wrong ${err}`));
    }else{
        alert("Invalid ip address, try again...");
    }
}

function getUserInput(){
    return inputField.value;
}

btn.addEventListener('click', onClick);
}