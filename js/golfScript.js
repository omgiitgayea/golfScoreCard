/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;           // the alpha for the tee rows
var courseData = null;
var numPlayers = 0;

function initCard() {
    // place the holes header on the screen
    var cardContainer = "<div id='teesContainer'></div>";
    $("#mainContainer").prepend(cardContainer);

    var roundBegun = false;
    var holeHeader = "<header id='holeHeader'>HOLES</header>";
    var currentTee = "";
    var courseHoles = courseData.course.holes;

    $("#teesContainer").append(holeHeader);

    // get the tee type, tee color and add them to the screen (as it is now, I may have to put far too much code in this getJSON function)
    for (var i = 0; i < courseData.course.tee_types.length; i++) {
        var teeID = courseData.course.tee_types[i].tee_type;              // get the name of the tee type
        var tee = "<div id='" + teeID + "' class='tees'></div>";     // creates a div with the id teeID and class tees
        $("#teesContainer").append(tee);
        $("#" + teeID).html(teeID.toUpperCase());
        $("#" + teeID).css("background-color", hexToRgba(courseData.course.tee_types[i].tee_hex_color));
    }

    var parContainer = "<div id='parValues'>PAR</div>";
    $("#teesContainer").append(parContainer);

    // var scoreContainer = "<div id='scoreCard'></div>";
    // $("#mainContainer").append(scoreContainer);
    $("#mainContainer").append("<div id='startRound'><button id='roundStart'>Begin Round</button><div id='missingTeeType'></div></div>");

    $(".tees").click(function () {
        if (!roundBegun) {
            $("#missingTeeType").html("");
            $(".tees").slideToggle();
            $(this).stop();
            if (currentTee === "") {
                currentTee = $(this).attr("id");
            }
            else {
                currentTee = "";
            }
        }
    });

    $("#roundStart").click(function () {
        if (currentTee != "") {
            roundBegun = true;
            $("#startRound").remove();
            $(".tees").css("cursor", "default");
        }
        else {
            $("#missingTeeType").html("Please select your tee");
        }
    });
}

$("#courseSelectBtn").click(function () {
    $("#loading").show();
    setTimeout(function () {
        $.getJSON("https://golf-courses-api.herokuapp.com/courses/11819", function (data) {
            courseData = data;
            $("#courseSelectBtn").remove();
            $("#loading").remove();

            var addPlayer = "<button id='newPlayerBtn'>Add new player</button>";
            var scoreContainer = "<div id='scoreCard'></div>";
            $("#mainContainer").append(scoreContainer);
            $("#scoreCard").append(addPlayer);
            // initCard();

            $("#newPlayerBtn").click(function () {
                if (numPlayers === 0)
                {
                    initCard();
                }
                numPlayers++

            });

        });
    }, 1000);

});







// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}


// $("#whatever").append("<div>Player" + (i + 1) + "</div") - if using a for loop to make a generic player