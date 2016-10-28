/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;           // the alpha for the tee rows
var MAX_PLAYERS = 10;
var courseData = null;
var numPlayers = 0;
var players = [];
var addedPlayers = 0;

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
            $("#newPlayerDiv").remove();
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

            var newPlayer = "<div id='newPlayerDiv'><input type='number' id='playerNumbers' min='1' max='10' value='1'><button id='newPlayerBtn'>Add player(s)</button><span id='invalidPlayersMsg'></span></div>";
            var scoreContainer = "<div id='scoreCard'></div>";
            var courseName = "<div id='courseContainer'>" + courseData.course.name + "</div>";
            var cardContainer = "<div id='teesContainer'></div>";
            $("#mainContainer").append(courseName, cardContainer, scoreContainer);
            $("#scoreCard").append(newPlayer);

            $("#newPlayerBtn").click(function () {
                var addnPlayers = $("#playerNumbers").val();

                if (addnPlayers > 0 && (Number(addnPlayers) + players.length) <= 10)
                {
                    $("#invalidPlayersMsg").html("");
                    if (players.length <= 0) {
                        $("#teesContainer").css("display", "inline-block");
                        initCard();
                    }
                    addPlayer(Number(addnPlayers));
                }
                else if (addnPlayers <= 0)
                {
                    $("#invalidPlayersMsg").html("At least one player must play...");
                }
                else if ((Number(addnPlayers) + players.length) > 10)
                {
                    $("#invalidPlayersMsg").html("Only 10 players can play at a time");
                }

                $("#playerNumbers").val("1");


            });

        });
    // }, 1000);

});

function addPlayer(morePlayers)
{
    $("#playerModal").css("display", "block");
    $("#modalContent").html("Enter Player Names:");
    for (var i = 0; i < morePlayers; i++) {
        var nameInput = "<input type='text' id='newPlayer" + i + "' class='nameInputField'>";
        $("#modalContent").append(nameInput);
    }
    $("#modalContent").slideDown();

    var btnText = "Add Player";
    if (morePlayers > 1)
    {
        btnText += "s"
    }
    $("#playerSubmitBtn").html(btnText);

    $("#playerSubmitBtn").unbind().click(function () {
        var valid = true;
        var compInputs = [];
        for (var i = 0; i < morePlayers; i++) {
            var playerInput = $("#newPlayer" + i);
            if (playerInput.val() === null || $.trim(playerInput.val()) === "" || (players.indexOf(playerInput.val()) != -1 && players.length > 0))
            {
                valid = false;
                playerInput.val("");
                playerInput.css("border-color", "red");
                playerInput.css("background-color", "pink");
            }
            if (compInputs.indexOf(playerInput.val()) != -1 && compInputs.length > 0)
            {
                valid = false;
                playerInput.val("");
                playerInput.css("border-color", "red");
                playerInput.css("background-color", "pink");
            }
            if (playerInput.val != "") {
                compInputs.push(playerInput.val());
            }
        }
        compInputs = [];

        if (valid) {
            $("#playerModal").css("display", "none");
            for (var i = 0; i < morePlayers; i++) {
                players.push($("#newPlayer" + i).val());
                var playerField = "<div id='player" + (i + addedPlayers) + "'>" + $('#newPlayer' + i).val() + "<span class='removePlayerBtn'><i class='fa fa-minus-circle'></i></span></div>";
                $("#scoreCard").append(playerField);
            }
            addedPlayers += morePlayers;
        }

        $(".removePlayerBtn").unbind().click(function () {
            var gonePlayerName = $(this).parent().text();
            players.splice(players.indexOf(gonePlayerName), 1);
            $(this).parent().remove();
            if (players.length === 0)
            {
                $("#teesContainer").html("");
                $("#startRound").remove();
            }
        });
    });
}





// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}


// $("#whatever").append("<div>Player" + (i + 1) + "</div") - if using a for loop to make a generic player