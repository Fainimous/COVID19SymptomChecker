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
