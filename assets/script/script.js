// global variables

// The Covid Tracking Project API query
var state = "nc";
var queryURL = "https://api.covidtracking.com/v1/states/" + state + "/current.json";


//COVID-19 symptoms
var symptoms = ["fever", " dry cough", "tiredness", "aches", "sore throat", "diarrhea", "conjunctivitis", "headache", "loss of taste or smell", "rash",
    "discoloration of fingers or toes", "difficulty breathing or shortness of breath", "chest pain or pressure", "loss of speech of movement"];

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    console.log(response);
    console.log('State: ' + response.state);
    console.log('Positive Cases: ' + response.positive + '.');
    console.log('Negative Cases: ' + response.negative + '.');
    console.log('Total Recovered: ' + response.recovered + '.');
})

//google API query

//get lat/long coordinants of the user
//this is getting the coords, but it doesnt seem to be saving the results to the global varibale "pos" I set above...

function getCoordinates() {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        pos = position.coords.latitude + "," + position.coords.longitude;
        localStorage.setItem("position", JSON.stringify(pos));
    }, () => {
        // Browser supports geolocation, but user has denied permission
        console.log("user has denied permission for Geolocation");
    });
    } else {
    // Browser doesn't support geolocation
    console.log("Browser does not support Geolocation");
    }
}


// Perform a Places Nearby Search Request for doctors offices
function getNearbyDoctorsOffice() {
    var pos = JSON.parse(localStorage.getItem("position"));
    console.log(pos);
    var doctorQueryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyD3cN9fFq2wZXBnBtB9pCu-nv72cNa4MVE&location=" + pos + "&keyword=doctors%20office&rankby=distance";
    console.log(doctorQueryURL);
//    $.ajax({
//        url: doctorQueryURL,
//        method: "GET"
//    }).then(function (response) {
//        console.log(response);
//    }) 
}

// Perform a Places Nearby Search Request for Covid testing
function getNearbyCovidTesting(position) {
    var pos = JSON.parse(localStorage.getItem("position"));
    var covidQueryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyD3cN9fFq2wZXBnBtB9pCu-nv72cNa4MVE&location=" + pos + "&keyword=covid%20testing&rankby=distance";
    $.ajax({
        url: covidQueryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    }) 
}

// un-comment these to test :]
//getNearbyDoctorsOffice();
//getNearbyCovidTesting();
//getCoordinates();


