// global variables

function displayCovidStats() {
    // The Covid Tracking Project API query
    var state = JSON.parse(localStorage.getItem("state"));
    var queryURL = "https://api.covidtracking.com/v1/states/" + state + "/current.json";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        console.log('State: ' + response.state);
        console.log('Positive Cases: ' + response.positive + '.');
        console.log('Negative Cases: ' + response.negative + '.');
        console.log('Total Recovered: ' + response.recovered + '.');
        //dynamically create HTML for the Covid stats
    })
}
$("#validateBtn").on("click", function () {
    $('#screening').attr('class', 'hide');
    $('#checkBoxes').attr('class', 'hide');
    $('#validateBtn').attr('class', 'hide');
    $('#locations').text("");
    var count = 0;
    $(".symptoms").each(function () {
        if (this.checked) {
            count += 1;
        }
    });
    if (count >= 3) {
        $("#message").text("You may have COVID-19. Here is a list of testing centers near you:");
        getNearbyCovidTesting();
    } else {
        $("#message").text("You may not have COVID-19. Here is a list of doctors near you:");
        getNearbyDoctorsOffice();
    }
});

//get lat/long coordinantes of the user

function getCoordinates() {
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            pos = position.coords.latitude + "," + position.coords.longitude;
            localStorage.setItem("position", JSON.stringify(pos));
            getStateCode();
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
    };
    // take the coords variable and convert it to a State code for the COVD tracker API call here
}

function getStateCode() {
    var pos = JSON.parse(localStorage.getItem("position"));
    var reverseGeoURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos + "&key=AIzaSyD3cN9fFq2wZXBnBtB9pCu-nv72cNa4MVE";
    $.ajax({
        url: reverseGeoURL,
        method: "GET"
        //This will return the reverse geolocation data, where we should find the state code to assign to local storage along with the coords
    }).then(function (response) {
        localStorage.setItem("state", JSON.stringify(response.results[0].address_components[5].short_name));
        displayCovidStats();
    }

    )
}

//google API query
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
                var nameEl = $('<h2 id="title">');
                var phoneEl = $('<p>');
                var addressEl = $('<p>');
                console.log(response);
                var name = response.result.name;
                var phone = response.result.formatted_phone_number;
                var address = response.result.vicinity;
                var website = response.result.website;
                nameEl.text(name);
                phoneEl.text(phone);
                addressEl.text(address);
                $('#locations').append(nameEl, phoneEl, addressEl);
                $('<a href="' + website + '" + target="_blank">' + website + '</a>').appendTo($('#locations'));
                console.log(name);
                console.log(phone);
                console.log(address);
                console.log('Website: ', website);
            })
        }
    })

}

// Perform a Places Nearby Search Request for Covid testing
function getNearbyCovidTesting() {
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
                var nameEl = $('<h2 id="title">');
                var phoneEl = $('<p>');
                var addressEl = $('<p>');
                console.log(response);
                var name = response.result.name;
                var phone = response.result.formatted_phone_number;
                var address = response.result.vicinity;
                nameEl.text(name);
                phoneEl.text(phone);
                addressEl.text(address);
                $('#locations').append(nameEl, phoneEl, addressEl);
                console.log(name);
                console.log(phone);
                console.log(address);
            })
        }
    })
}

// un-comment these to test :]
//getCoordinates();
if (localStorage.getItem("position") === null) {
    getCoordinates();
}