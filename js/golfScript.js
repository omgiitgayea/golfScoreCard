/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;           // the alpha for the tee rows

function initCard() {
    // place the holes header on the screen
    var roundBegun = false;
    var holeHeader = "<header id='holeHeader'>I'm where the titles go!</header>";
    var currentTee = "";
    $("#teesContainer").append(holeHeader);

    // get the tee type, tee color and add them to the screen (as it is now, I may have to put far too much code in this getJSON function)
    $.getJSON("https://golf-courses-api.herokuapp.com/courses/11819", function (data) {
        for (var i = 0; i < data.course.tee_types.length; i++) {
            var teeID = data.course.tee_types[i].tee_type;              // get the name of the tee type
            var tee = "<div id='"+ teeID + "' class='tees'></div>";     // creates a div with the id teeID and class tees
            $("#teesContainer").append(tee);
            $("#" + teeID).html(teeID);
            $("#" + teeID).css("background-color", hexToRgba(data.course.tee_types[i].tee_hex_color));
        }

        var scoreContainer = "<div id='scoreCard'></div>";
        $("#teesContainer").append(scoreContainer);
        $("#mainContainer").append("<div id='startRound'><button id='roundStart'>Begin Round</button><span id='missingTeeType'></span></div>");

        $(".tees").click(function () {
            if (!roundBegun) {
                $("#missingTeeType").html("");
                $(".tees").slideToggle();
                $(this).stop();
                if (currentTee === "")
                {
                    currentTee = $(this).attr("id");
                }
                else {
                    currentTee = "";
                }
            }
        });

        $("#roundStart").click(function ()
        {
            if(currentTee != "") {
                roundBegun = true;
                $("#startRound").remove();
                $(".tees").css("cursor", "default");
            }
            else
            {
                $("#missingTeeType").html("Please select your tee");
            }
        })
    });
}

$("#justAButton").click(function () {
    $("#justAButton").remove();
    initCard();
});

// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}


// $("#whatever").append("<div>Player" + (i + 1) + "</div") - if using a for loop to make a generic player