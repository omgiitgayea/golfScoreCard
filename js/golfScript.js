/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;           // the alpha for the tee rows
var MAX_PLAYERS = 10;
var courseData = null;
var numPlayers = 0;
var players = [];

function initCard() {
    // place the holes header on the screen


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
            $("#newPlayerBtn").remove();
            $(".removePlayerBtn").remove();
        }
        else {
            $("#missingTeeType").html("Please select your tee");
        }
    });
}

$("#courseSelectBtn").click(function () {
    $("#loading").show();
    // setTimeout(function () {            // setTimeout is only there for testing of loading animation
        $.getJSON("https://golf-courses-api.herokuapp.com/courses/11819", function (data) {
            courseData = data;
            $("#courseSelectBtn").remove();
            $("#loading").remove();

            var newPlayer = "<button id='newPlayerBtn'>Add new player</button>";
            var scoreContainer = "<div id='scoreCard'></div>";
            var courseName = "<div id='courseContainer'>" + courseData.course.name + "</div>";
            var cardContainer = "<div id='teesContainer'></div>";
            $("#mainContainer").append(courseName, cardContainer, scoreContainer);
            $("#scoreCard").append(newPlayer);

            $("#newPlayerBtn").click(function () {
                if (players.length === 0)
                {
                    $("#teesContainer").css("display", "inline-block");
                    initCard();
                }
                $("#scoreCard").prepend(addPlayer(players));
                if (players.length >= MAX_PLAYERS)
                {
                    $("#newPlayerBtn").css("display", "none");
                }


                // need to rejigger the remove part
                // $(".removePlayerBtn").click(function () {
                //     var arrayIndex = $(this).parent().attr("id");
                //     arrayIndex = Number(arrayIndex[arrayIndex.length - 1]) - 1;
                //
                //     players.splice(arrayIndex, 1);
                //     $(this).parent().remove();
                //     console.log(players.length);
                //
                //     // numPlayers--;
                //     // console.log(numPlayers);
                //     // $(this).parent().remove();
                //     // if (numPlayers === 0) {
                //     //     $("#teesContainer").html("");
                //     //     $("#startRound").remove();
                //     // }
                // });
            });

        });
    // }, 1000);

});

function addPlayer(playerArray)
{
    var arrayLength = playerArray.length + 1;
    playerArray.push("Player " + arrayLength);
    return "<div id='Player" + arrayLength + "'>Player " + arrayLength + " <span class='removePlayerBtn'>&times;</span></div>";
}





// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}


// $("#whatever").append("<div>Player" + (i + 1) + "</div") - if using a for loop to make a generic player