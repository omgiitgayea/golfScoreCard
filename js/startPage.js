/**
 * Created by GodaiYuusaku on 11/1/16.
 */
// this is where we build up the course selection page
var RADIUS = 15;

$(document).ready(function()
{
    getGeolocation();

    // function getCourses(lat, lng, rad) {
    //     return new Promise(function(resolve, reject) {
    //         $.post("http://golf-courses-api.herokuapp.com/courses"), {
    //             latitude: lat,
    //             longitude: lng,
    //             radius: rad
    //         }, function (data) {
    //             console.log(data);
    //         }
    //     });
    // }
});


function getGeolocation()
{
    return new Promise(function(resolve, reject)
    {
        var options = {
            enableHighAccuracy: true
        };

        function success(pos) {
            getCourses(pos.coords).then(function(courses) {
                //what to do with the data
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

function getCourses(positionObj)
{
    var courses;
    return new Promise(function(resolve, reject) {
        console.log(positionObj.latitude);
        $.post("http://golf-courses-api.herokuapp.com/courses"), {
            latitude: positionObj.latitude,
            longitude: positionObj.longitude,
            radius: RADIUS
        }, function (data) {
            resolve(JSON.parseJSON(data).courses)
        };
    })
}

// $.getJSON("https://golf-courses-api.herokuapp.com/courses/11819", function (coursesData) {
//     console.log("called");
//     var courseName = coursesData.course.name;
//     var optionDiv = "<option value='11819'>"+ courseName + "</option>";
//     $("#courseSelectMenu").append(optionDiv);
// });



// need promise for post for getting the data
// need promise for geolocation

// function asyncZatannaSpell(stringArray)
// {
//     promise = new Promise(execute);
//     return promise;
//
//     function execute(resolve, reject) {
//         setTimeout(function ()
//         {
//             if (stringArray.length <= 0)
//             {
//                 reject("How can she say a spell with no words!?")
//             }
//             zatanna(stringArray);
//             resolve();
//         }, 3000);
//     }
// }

