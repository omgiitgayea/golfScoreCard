/**
 * Created by GodaiYuusaku on 11/1/16.
 */
// this is where we build up the course selection page
var RADIUS = 50 / 0.621371;         // that's 50 miles converted to km because you know, America
var courseID = "";
var myAudio;

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
            getCourses(pos.coords).then(function (courses)
                {
                    setTimeout(function(){
                        $("#splashModal").fadeOut();
                        myAudio.pause();
                    }, 2000);

                    for (var i = 0; i < courses.length; i++) {
                        var courseName = courses[i].name;
                        var city = courses[i].city;
                        var optionDiv = "<option value='" + courses[i].id + "'>" + courseName + ", " + city + "</option>";
                        $("#courseSelectMenu").append(optionDiv);
                    }

                    $("#courseSelectMenu").change(function () {
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
                        console.log(currentCourse);
                        var courseNameDiv = "<div id='courseName'>" + currentCourse.name + "</div>";
                        var courseAddr1Div = "<div id='courseAddr1'>" + currentCourse.addr_1 + ", " + currentCourse.city + "</div>";
                        var courseAddr2Div = "<div id='courseAddr2'>" + currentCourse.state_or_province + ", " + currentCourse.country + "</div>";
                        var coursePhoneDiv = "<div id='coursePhone'>" + currentCourse.phone + "</div>";
                        var courseZipDiv = "<div id='courseZip'>" + currentCourse.zip_code + "</div>";
                        var courseMapDiv = "<div id='courseMap'></div>";

                        $("#courseInfo").append(courseNameDiv, courseAddr1Div, courseAddr2Div, coursePhoneDiv, courseZipDiv, courseMapDiv);
                        initCourseMap(currentCourse.location);
                        courseID = currentCourse.id;
                    })
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



