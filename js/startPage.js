/**
 * Created by GodaiYuusaku on 11/1/16.
 */
// this is where we build up the course selection page
var RADIUS = 50 / 0.621371;         // that's 50 miles converted to km because you know, America
var courseID = "";
var myAudio;
var API_KEY = "8884a1d7b1c901a208269127c967f782";
var myPosition;


$(document).ready(function () {
    // put splash page up like a modal type thing when starting, remove when courses are loaded up
    myAudio = document.getElementById("myAudio");
    myAudio.loop = true;
    myAudio.play();
    getGeolocation();
    animatethis($("#cylonEye"), 800);

});


function getGeolocation() {
    return new Promise(function (resolve, reject) {
        var options = {
            enableHighAccuracy: true
        };

        function success(pos) {
            myPosition = pos.coords;
            getCoursesByRadius(myPosition).then(function (courses)
                {
                    // setTimeout(function(){
                        $("#splashModal").fadeOut();
                        myAudio.pause();
                    // }, 2000);

                    buildMenu(courses);
                }
            );
            resolve(pos);
        }

        function error(error) {
            reject(error);
        }

        navigator.geolocation.getCurrentPosition(success, error, options);
    });
}

function getCoursesByRadius(positionObj) {
    var courses;
    return new Promise(function (resolve, reject) {
        $.post("http://golf-courses-api.herokuapp.com/courses", {
            latitude: positionObj.latitude,
            longitude: positionObj.longitude,
            radius: RADIUS
        }, function (data) {
            resolve(JSON.parse(data).courses)
        });
    })
}

function getCoursesByLocation(locationObj) {
    var courses;
    return new Promise(function (resolve, reject) {
        $.post("http://golf-courses-api.herokuapp.com/courses/search", locationObj, function (data) {
            resolve(JSON.parse(data).courses)
        });
    })
}

function buildMenu(courses)
{
    $("#courseSelectMenu").html("<option disabled selected value> -- Select a Golf Course -- </option>");

    for (var i = 0; i < courses.length; i++) {
        var courseName = courses[i].name;
        var city = courses[i].city;
        var state = courses[i].state_or_province;
        var optionDiv = "<option value='" + courses[i].id + "'>" + courseName + ", " + city + ", " + state + "</option>";
        $("#courseSelectMenu").append(optionDiv);
    }

    $("#courseSelectMenu").unbind().change(function () {
        $("#courseInfo").html("");
        var currentID = $(this).val();
        var idIndex = 0;
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].id === Number(currentID)) {
                idIndex = i;
                break;
            }
        }
        var currentCourse = courses[idIndex];
        var courseLocDiv = "<div id='courseLoc'></div>";
        var courseWeatherDiv = "<div id='courseWeather'></div>";
        $("#courseInfo").append(courseWeatherDiv);
        $("#courseInfo").append(courseLocDiv);
        var courseNameDiv = "<div id='courseName'>" + currentCourse.name + "</div>";
        var courseAddr1Div = "<div id='courseAddr1'>" + currentCourse.addr_1 + ", " + currentCourse.city + "</div>";
        var courseAddr2Div = "<div id='courseAddr2'>" + currentCourse.state_or_province + ", " + currentCourse.country + "</div>";
        var coursePhoneDiv = "<div id='coursePhone'>" + currentCourse.phone + "</div>";
        var courseZipDiv = "<div id='courseZip'>" + currentCourse.zip_code + "</div>";
        var courseMapDiv = "<div id='courseMap'></div>";

        $("#courseLoc").append(courseNameDiv, courseAddr1Div, courseAddr2Div, coursePhoneDiv, courseZipDiv);
        $("#courseInfo").append(courseMapDiv);
        initCourseMap(currentCourse.location);
        getWeather(currentCourse.location);
        courseID = currentCourse.id;
    })
}

$("input[type=radio][name=courseSearch]").change(function () {
    if (this.value === "radius")
    {
        $("#loading").fadeIn();
        getCoursesByRadius(myPosition).then(function (courses)
            {
                $("#loading").fadeOut();
                buildMenu(courses);
            }
        );
    }
    else
    {
        this.checked = false;
        $("#playerModal").fadeIn();
        $("#modalContent").slideDown();
        $("#modalContent").html("");
        $("#playerSubmitBtn").html("Select Location");
        var addressInput = "<div class='locationLabel'><input id='addressIn' class='nameInputField' type='text'><label for='addressIn'>Course Address</label></div>";
        var nameInput = "<div class='locationLabel'><input id='nameIn' class='nameInputField' type='text'><label for='nameIn'>Course Name</label></div>";
        var cityInput = "<div class='locationLabel'><input id='cityIn' class='nameInputField' type='text'><label for='cityIn'>Course City</label></div>";
        var stateInput = "<div class='locationLabel'><input id='stateIn' class='nameInputField' type='text'><label for='stateIn'>Course State</label></div>";
        var countryInput = "<div class='locationLabel'><input id='countryIn' class='nameInputField' type='text'><label for='countryIn'>Course Country</label></div>";
        $("#modalContent").append(addressInput, nameInput, cityInput, stateInput, countryInput);

        $("#playerSubmitBtn").click(function () {
            submitLocation();
        });

        $("input").keypress(function (event) {
            if (event.which == 13)
            {
                event.preventDefault();
                submitLocation();
            }
        });
    }
});

function submitLocation ()
{
    var valid = true;

    if ($("#countryIn").val() === "" && $("#stateIn").val() === "" && $("#cityIn").val() === "" && $("#nameIn").val() === "" && $("#addressIn").val() === "")
    {
        $("#missingCourseInfo").html("Please fill in at least one field");
        valid = false;
    }
    else
    {
        valid = true;
    }

    if (valid)
    {
        $("#playerModal").fadeOut();
        $("#missingCourseInfo").html("");
        var locationSubmit = {
            country: $("#countryIn").val(),
            state: $("#stateIn").val(),
            city: $("#cityIn").val(),
            name: $("#nameIn").val(),
            address: $("#addressIn").val()
        };

        $("#loading").fadeIn();
        getCoursesByLocation(locationSubmit).then(function (courses)
            {
                $("#loading").fadeOut();
                buildMenu(courses);
            }
        );
    }
}
function animatethis(targetElement, speed) {
    $(targetElement).animate({marginLeft: "+=350px"},
        {
            duration: speed,
            complete: function () {
                targetElement.animate({marginLeft: "-=350px"},
                    {
                        duration: speed,
                        complete: function () {
                            animatethis(targetElement, speed);
                        }
                    });
            }
        });
}


// for adding a map
function initCourseMap(coursePos) {
    var centerPos = {lat: coursePos.lat, lng: coursePos.lng};
    var map = new google.maps.Map(document.getElementById('courseMap'), {
        zoom: 16,
        center: centerPos,
        mapTypeId: "satellite",
        disableDefaultUI: true
    });
    var marker = new google.maps.Marker({
        position: centerPos,
        map: map
    });
}

// weather widget
function getWeather(coursePos)
{
    $("#courseWeather").html("");
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + coursePos.lat + "&lon=" + coursePos.lng + "&units=metric&APPID=" + API_KEY, function (weatherData) {
        var iconSrc = "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
        var image = "<img src='" + iconSrc + "' width='100px'>";
        var tempDiv = "<div>" + weatherData.main.temp + " &deg;C</div>";
        var windDir = weatherData.wind.deg;
        var directionNames = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        windDir = Math.round((windDir / 22.5) + 0.5);
        var direction = directionNames[windDir % 16];
        var windDiv = "<div id='wind'>Wind: " + weatherData.wind.speed + " kph " + direction + "</div>";

        $("#courseWeather").append(image, tempDiv, windDiv);
    });
}

