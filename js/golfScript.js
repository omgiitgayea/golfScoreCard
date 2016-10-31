/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;           // the alpha for the tee rows
var MAX_PLAYERS = 10;
var courseData = null;
var players = [];
var addedPlayers = 0;
var roundBegun = false;
var currentTee = "";

function initCard() {
    // place the holes header on the screen
    var holeHeader = "<header id='holeHeader'><div class='headers'>HOLES</div></header>";
    var courseHoles = courseData.course.holes;
    var teeArray = [];

    $("#teesContainer").append(holeHeader);
    for (var i = 0; i < courseHoles.length; i++) {
        var holeNumDiv = "<div id='holeNo" + i + "' class='yardage'>" + (i + 1) + "</div>";
        $("#holeHeader").append(holeNumDiv);
        if (i % 9 === 8) {
            var holeLabel = "<div id='holeBreak" + Math.floor(i / 9) + "' class='yardage'></div>";
            $("#holeHeader").append(holeLabel);
            if (i === 8) {
                $("#holeBreak0").html("OUT");
            }
            else {
                $("#holeBreak1").html("IN");
            }
        }
    }
    var totalHeader = "<div id='total' class='yardage'>TOTAL</div>";
    $("#holeHeader").append(totalHeader);

    // get the tee type, tee color and add them to the screen (as it is now, I may have to put far too much code in this getJSON function)
    for (var i = 0; i < courseData.course.tee_types.length; i++) {
        var teeID = courseData.course.tee_types[i].tee_type;              // get the name of the tee type
        teeArray.push(teeID);
        var tee = "<div id='" + teeID + "' class='tees'><div class='headers'>" + teeID.toUpperCase() + "</div></div>";     // creates a div with the id teeID and class tees
        $("#teesContainer").append(tee);
        $("#" + teeID).css("background-color", hexToRgba(courseData.course.tee_types[i].tee_hex_color));
        for (var j = 0; j < courseHoles.length; j++) {
            var teeYardsDiv = "<div id='" + teeID + j + "' class='yardage'>" + courseData.course.holes[j].tee_boxes[i].yards + "</div>";
            $("#" + teeID).append(teeYardsDiv);
            if (j % 9 === 8) {
                var totalYrdsDiv = "<div id='" + teeID + "Total" + (j + 1) + "' class='yardage'>";
                if (j === 8) {
                    totalYrdsDiv += courseData.course.tee_types[i].front_nine_yards + "</div>";
                }
                else if (j === 17) {
                    totalYrdsDiv += courseData.course.tee_types[i].back_nine_yards + "</div>";
                }
                $("#" + teeID).append(totalYrdsDiv);
            }
        }
        var courseYrdsDiv = "<div id='" + teeID + "TotalYrd' class='yardage'>" + courseData.course.tee_types[i].yards + "</div>";
        $("#" + teeID).append(courseYrdsDiv);

    }

    $("#mainContainer").append("<div id='startRound'><button id='roundStart'>Begin Round</button><div id='missingTeeType'></div></div>");

    $(".tees").click(function () {
        if (!roundBegun) {
            $("#missingTeeType").html("");
            $(".tees").slideToggle();
            $(this).stop();
            if (currentTee === "") {
                currentTee = $(this).attr("id");
                var teeIndex = teeArray.indexOf(currentTee);
                //add in par code
                var parContainer = "<div id='parValues'><div class='headers'>PAR</div></div>";
                $("#teesContainer").append(parContainer);
                for (var i = 0; i < courseHoles.length; i++) {
                    var parDiv = "<div id='par" + i + "' class='yardage'>" + courseData.course.holes[i].tee_boxes[teeIndex].par + "</div>";
                    $("#parValues").append(parDiv);
                    if (i % 9 === 8) {
                        var parBreakDIV = "<div id='parBreak" + Math.floor(i / 9) + "' class='yardage'>";
                        if (i === 8) {
                            parBreakDIV += courseData.course.tee_types[teeIndex].front_nine_par + "</div>";
                        }
                        else {
                            parBreakDIV += courseData.course.tee_types[teeIndex].back_nine_par + "</div>";
                        }
                        $("#parValues").append(parBreakDIV);
                    }
                }
                var totalParHeader = "<div id='totalPar' class='yardage'>" + courseData.course.tee_types[teeIndex].par + "</div>";
                $("#parValues").append(totalParHeader);

            }
            else {
                currentTee = "";
                $("#parValues").remove();
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

        var newPlayer = "<div id='newPlayerDiv'><input type='number' id='playerNumbers' min='1' max='" + MAX_PLAYERS + "' value='1'><button id='newPlayerBtn'>Add player(s)</button><span id='invalidPlayersMsg'></span></div>";
        var scoreContainer = "<div id='scoreCard'></div>";
        var courseName = "<div id='courseContainer'>" + courseData.course.name + "</div>";
        var cardContainer = "<div id='teesContainer'></div>";
        $("#mainContainer").append(courseName, cardContainer, scoreContainer);
        $("#scoreCard").append(newPlayer);

        $("#newPlayerBtn").click(function () {
            var addnPlayers = $("#playerNumbers").val();

            if (addnPlayers > 0 && (Number(addnPlayers) + players.length) <= MAX_PLAYERS) {
                $("#invalidPlayersMsg").html("");
                if (players.length <= 0) {
                    $("#teesContainer").css("display", "inline-block");
                    initCard();
                }
                addPlayer(Number(addnPlayers));
            }
            else if (addnPlayers <= 0) {
                $("#invalidPlayersMsg").html("At least one player must play...");
            }
            else if ((Number(addnPlayers) + players.length) > MAX_PLAYERS) {
                $("#invalidPlayersMsg").html("Only " + MAX_PLAYERS + " players can play at a time");
            }

            $("#playerNumbers").val("1");


        });

    });
    // }, 1000);

});

function addPlayer(morePlayers) {
    $("#playerModal").css("display", "block");
    $("#modalContent").html("Enter Player Names:");
    for (var i = 0; i < morePlayers; i++) {
        var nameInput = "<input type='text' id='newPlayer" + i + "' class='nameInputField'>";
        $("#modalContent").append(nameInput);
    }
    $("#modalContent").slideDown();

    var btnText = "Add Player";
    if (morePlayers > 1) {
        btnText += "s"
    }
    $("#playerSubmitBtn").html(btnText);

    $("#playerSubmitBtn").unbind().click(function () {
        var valid = true;
        var compInputs = [];
        for (var i = 0; i < morePlayers; i++) {
            var playerInput = $("#newPlayer" + i);
            if (playerInput.val() === null || $.trim(playerInput.val()) === "" || (players.indexOf(playerInput.val()) != -1 && players.length > 0)) {
                valid = false;
                playerInput.val("");
                playerInput.css("border-color", "red");
                playerInput.css("background-color", "pink");
            }
            if (compInputs.indexOf(playerInput.val()) != -1 && compInputs.length > 0) {
                valid = false;
                playerInput.val("");
                playerInput.css("border-color", "red");
                playerInput.css("background-color", "pink");
            }
            if (playerInput.val != "") {
                compInputs.push(playerInput.val());
            }
        }

        if (valid) {
            $("#playerModal").css("display", "none");
            for (var i = 0; i < morePlayers; i++) {
                players.push($("#newPlayer" + i).val());
                var playerField = "<div id='player" + (i + addedPlayers) + "' class='playerBar'><div class='headers'>" + $('#newPlayer' + i).val() + "<span class='removePlayerBtn'><i class='fa fa-minus-circle'></i></span></div></div>";
                $("#scoreCard").append(playerField);
                for (var j = 0; j < courseData.course.holes.length; j++) {
                    var scoreDiv = "<div class='holeScore'><input id='player" + (i + addedPlayers) + "-" + j + "'type='text' class='scoreField'></div>";
                    $("#player" + (i + addedPlayers)).append(scoreDiv);
                    if (j % 9 === 8) {
                        var scoreTotalDiv = "<div id='player" + (i + addedPlayers) + "Total" + (j + 1) + "' class='yardage'>h</div>";
                        $("#player" + (i + addedPlayers)).append(scoreTotalDiv);
                    }
                }
                var scoreFinalDiv = "<div id='player" + (i + addedPlayers) + "TotalYrd' class='yardage'>h</div>";
                $("#player" + (i + addedPlayers)).append(scoreFinalDiv);
            }
            addedPlayers += morePlayers;
        }

        $(".removePlayerBtn").unbind().click(function () {
            var gonePlayerName = $(this).parent().text();
            players.splice(players.indexOf(gonePlayerName), 1);
            $(this).parent().parent().remove();
            if (players.length === 0) {
                $("#teesContainer").html("");
                $("#startRound").remove();
            }
        });

        $(".scoreField").change(function () {
            if (roundBegun) {
                $(this).removeClass("invalidScore");
                var validScore = true;
                var numOnly = /^[0-9]*$/;
                if (numOnly.test($(this).val())) {
                    if ($(this).val() < 1) {
                        validScore = false;
                    }
                }
                else {
                    validScore = false;
                }

                if (!validScore) {
                    $(this).addClass("invalidScore");
                    $(this).val("");
                }
                else {
                    var currentPlayer = $(this).attr("id");
                    var dashLocation = currentPlayer.indexOf("-");
                    var playerID = currentPlayer.slice(6, dashLocation);
                    var currentHole = Number(currentPlayer.slice(dashLocation + 1));
                    var validField = true;

                    if (currentHole != 0) {
                        for (var testPrev = 0; testPrev < currentHole; testPrev++) {
                            if ($("#player" + playerID + "-" + testPrev).val() === null || $.trim($("#player" + playerID + "-" + testPrev).val()) === "") {
                                validField = false;
                                $("#player" + playerID + "-" + testPrev).addClass("invalidScore");
                            }
                        }
                    }
                    if (validField) {
                        $(".scoreField").removeClass("invalidScore");
                        var activeScoreDivID = "";
                        var roundFinished = false;
                        if (currentHole < 9) {
                            activeScoreDivID = "player" + playerID + "Total" + 9;
                        }
                        else {
                            activeScoreDivID = "player" + playerID + "Total" + 18;
                        }
                        if (currentHole === (courseData.course.holes.length - 1)) {
                            roundFinished = true;
                        }
                    }
                    else {
                        $(this).val("");
                    }


                    // rejigger for lets say readonly status to change for just the ones in that row, not sure how yet...or make it readonly when the final player does it, that's easier
                    // if (roundFinished) {
                    //     $(".scoreField").prop("readonly", true);
                    //     $(".scoreField").css("border", "none");
                    //     console.log("Yay, no more golf!");
                    // }
                }
            }
            else {
                $(this).val("");
            }
        })
    });
}


// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}


// what I still need: tabulate player's score, handicap row, final score relative to par and some message reflecting the score
// what I need to do for the extra stuff: display a map of the hole with tee and hole position, find course within radius of app
// UI stuff that needs doing: course selection page
// yardage and par are wrong - order of tee types for the whole course is different in each hole - will have to find tee type in each hole and get appropriate values