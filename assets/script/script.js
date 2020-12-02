// global variables

//BetterDoctor API query
var queryURL = "https://api.betterdoctor.com/2016-03-01/"
var apiKey = "ab008c398f6e29934b87e7fd85a69f06";


//var resource_url = 'https://api.betterdoctor.com/2016-03-01/doctors?location=37.773,-122.413,100&skip=2&limit=10&user_key=' + api_key;


//var resource_url = 'https://api.betterdoctor.com/2016-03-01/practices?location=37.773,-122.413,10&skip=2&limit=10&user_key=' + api_key;


    $.ajax({
        url: queryURL + "doctors?location=28214&skip=2&limit=5&user_key=" + apiKey,
        method: "GET"
      }).then(function(response) {
          console.log(response);
      })
