// global variables

// The Covid Tracking Project API query
var state = "nc";
var queryURL = "https://api.covidtracking.com/v1/states/" + state + "/current.json";

$("#validateBtn").on("click", function () {
    var count = 0;
$(".symptoms").each(function(){
    if (this.checked){
        count +=1;
    }
});
if (count >= 3) {
    $("#message").text("You may have COVID-19. Here is a list of testing centers near you:");
} else {
    $("#message").text("You may not have COVID-19. Here is a list of doctors near you:");
}
});

// //COVID-19 symptoms
// var symptoms = ["fever", " dry cough", "tiredness", "aches", "sore throat", "diarrhea", "conjunctivitis", "headache", "loss of taste or smell", "rash",
//     "discoloration of fingers or toes", "difficulty breathing or shortness of breath", "chest pain or pressure", "loss of speech of movement"];

$("#btn").on("click", function (userSymptoms) {
    var userSymptoms = [$("#userSymptoms").val()];
    var symptoms = ["fever", " dry cough", "tiredness", "aches", "sore throat", "diarrhea", "conjunctivitis", "headache", "loss of taste or smell", "rash",
    "discoloration of fingers or toes", "difficulty breathing or shortness of breath", "chest pain or pressure", "loss of speech of movement"];
    console.log(userSymptoms);
    var count;
    for (var i = 0; i < userSymptoms.length; i++) {
        for (var j = 0; j < symptoms.length; j++) {
            if (userSymptoms[i] == symptoms[j]) {
                count ++;
            } else {
                continue;
            }
        }
    }
    console.log(count);
    if (count >= 3) {
        alert('Go to the hospital for Covid treatment!');
        return;
    } else {
        alert('Please see your nearest general practice physician.');
        return;
    }
})

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
        navigator.geolocation.getCurrentPosition(position => {
            pos = position.coords.latitude + "," + position.coords.longitude;
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
    //get the nearby doctors offices via doctor query API
    $.ajax({
        url: doctorQueryURL,
        method: "GET"
        //this will return the 20 nearest locations.  We need to get the first 5 Plcae_ids to make another call and get more detailed information.
    }).then(function (response) {
        console.log(response);
        //create an array of the first 5 place_ids
        var places = [];
        for (var i = 0; i < 5; i++) {
            places.push(response.results[i].place_id);
        }
        //now make an API call for each of the detailed place IDs:
        for (var j = 0; j < 5; j++) {
            var placesIDURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyD3cN9fFq2wZXBnBtB9pCu-nv72cNa4MVE&place_id=" + places[j] + "&fields=adr_address,formatted_phone_number,vicinity,website,name";
            $.ajax({
                url: placesIDURL,
                method: "GET"
            }).then(function (response) {
                //dynamically create HTML results here
                console.log(response);
            })
            }
    })
    
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
        //create an array of the first 5 place_ids
        var places = [];
        for (var i = 0; i < 5; i++) {
            places.push(response.results[i].place_id);
        }
        //now make an API call for each of the detailed place IDs:
        for (var j = 0; j < 5; j++) {
            var placesIDURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyD3cN9fFq2wZXBnBtB9pCu-nv72cNa4MVE&place_id=" + places[j] + "&fields=adr_address,formatted_phone_number,vicinity,website,name";
            $.ajax({
                url: placesIDURL,
                method: "GET"
            }).then(function (response) {
                //dynamically create HTML results here
                console.log(response);
            })
            }
    })
}

// un-comment these to test :]
getNearbyDoctorsOffice();
console.log
getNearbyCovidTesting();
//getNearbyDoctorsOffice();
//getNearbyCovidTesting();
//getCoordinates();
if (localStorage.getItem("position") === null) {
    getCoordinates();
  };
//getNearbyDoctorsOffice();
//getNearbyDoctorsOffice();