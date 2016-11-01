/**
 * Created by GodaiYuusaku on 11/1/16.
 */
var API_KEY = "8884a1d7b1c901a208269127c967f782"

function getGeolocation()
{
    return new Promise(function(resolve, reject)
    {
        var options = {
            enableHighAccuracy: true
        };

        function success(pos) {
            var coordinates = pos.coords;
            var lat = coordinates.latitude;
            var lng = coordinates.longitude;

            $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=" + API_KEY, function (weatherData) {
                displayWeather(weatherData);
            });
            resolve(coordinates);
        }

        function error(error) {
            reject(error);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
}

getGeolocation();

function displayWeather(weatherObj)
{
    $("#city").html(weatherObj.name);
    $("#weatherType").html("Outside the weather is " + weatherObj.weather[0].description);
    $("#currentTemp").html("The current temperature is " + (Math.round((weatherObj.main.temp - 273.15) * 10) / 10) + "&deg;C");
}