/**
 * Created by GodaiYuusaku on 11/1/16.
 */
// this is where we build up the course selection page
var RADIUS = 50 / 0.621371;         // that's 50 miles converted to km because you know, America

$(document).ready(function () {
    // put splash page up like a modal type thing when starting, remove when courses are loaded up
    getGeolocation();
});


function getGeolocation() {
    return new Promise(function (resolve, reject) {
        var options = {
            enableHighAccuracy: true
        };

        function success(pos) {
            getCourses(pos.coords).then(function (courses) {
                    //what to do with the data
                    for (var i = 0; i < courses.length; i++) {
                        var courseName = courses[i].name;
                        var city = courses[i].city;
                        var optionDiv = "<option value='" + courses[i].id + "'>" + courseName + ", " + city + "</option>";
                        $("#courseSelectMenu").append(optionDiv);
                        // this stuff that was consoled out will be put in some sort of div for address
                        // also would like to put on a map of the course and weather widget
                        // console.log(courses[i].addr_1);
                        // console.log(courses[i].state_or_province);
                        // console.log(courses[i].phone);
                        // console.log(courses[i].zip_code);
                        // console.log(courses[i].country);
                    }
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

function getCourses(positionObj) {
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

