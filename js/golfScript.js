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
        var holeNumDiv = "<div id='holeNo" + i + "' class='yardage hole'>" + (i + 1) + "</div>";
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

    // get the tee type, tee color and add them to the screen
    for (var i = 0; i < courseData.course.tee_types.length; i++) {
        var teeID = courseData.course.tee_types[i].tee_type;              // get the name of the tee type
        teeArray.push(teeID);
        var tee = "<div id='" + teeID + "' class='tees'><div class='headers'>" + teeID.toUpperCase() + "</div></div>";     // creates a div with the id teeID and class tees
        $("#teesContainer").append(tee);
        $("#" + teeID).css("background-color", hexToRgba(courseData.course.tee_types[i].tee_hex_color));

        // populate yardage
        for (var j = 0; j < courseHoles.length; j++) {
            var teeYardsDiv = "<div id='" + teeID + j + "' class='yardage'>";

            // find the right tee yardage
            for (var k = 0; k < courseHoles[j].tee_boxes.length; k++) {
                var teeBoxObj = courseHoles[j].tee_boxes[k].tee_type;
                if (teeBoxObj === teeID) {
                    teeYardsDiv += courseHoles[j].tee_boxes[k].yards + "</div>";
                    break;
                }
            }
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
                var holePosArray = [];

                //populate par and handicap
                var parContainer = "<div id='parValues'><div class='headers'>PAR</div></div>";
                var hcpContainer = "<div id='hcpValues'><div class='headers'>HANDICAP</div></div>";
                $("#teesContainer").append(parContainer, hcpContainer);

                for (var i = 0; i < courseHoles.length; i++) {
                    var parDiv = "<div id='par" + i + "' class='yardage'>";
                    var hcpDiv = "<div id='hcp" + i + "' class='yardage'>";
                    for (var k = 0; k < courseHoles[i].tee_boxes.length; k++) {
                        var teeBoxObj = courseHoles[i].tee_boxes[k].tee_type;
                        if (teeBoxObj === teeID) {
                            parDiv += courseHoles[i].tee_boxes[k].par + "</div>";
                            hcpDiv += courseHoles[i].tee_boxes[k].hcp + "</div>";
                            // insert code for pushing lat and lng to hole position array
                            break;
                        }
                    }
                    $("#parValues").append(parDiv);
                    $("#hcpValues").append(hcpDiv);
                    if (i % 9 === 8) {
                        var parBreakDIV = "<div id='parBreak" + Math.floor(i / 9) + "' class='yardage'>";
                        var hcpBreakDIV = "<div class='yardage'>";
                        if (i === 8) {
                            parBreakDIV += courseData.course.tee_types[teeIndex].front_nine_par + "</div>";
                        }
                        else {
                            parBreakDIV += courseData.course.tee_types[teeIndex].back_nine_par + "</div>";
                        }
                        $("#parValues").append(parBreakDIV);
                        $("#hcpValues").append(hcpBreakDIV);
                    }
                }
                var totalParHeader = "<div id='totalPar' class='yardage'>" + courseData.course.tee_types[teeIndex].par + "</div>";
                var totalHcp = "<div class='yardage'>";
                $("#parValues").append(totalParHeader);
                $("#hcpValues").append(totalHcp);

                $(".hole").click(function ()
                {
                    var holeIndex = $(this).attr("id").slice(6);
                    // insert code for showing maps modal
                });
            }
            else {
                currentTee = "";
                $("#parValues").remove();
                $("#hcpValues").remove();
                $(".hole").off("click");
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
    $("#playerModal").fadeIn();
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
            $("#playerModal").fadeOut();
            for (var i = 0; i < morePlayers; i++) {
                players.push($("#newPlayer" + i).val());
                var playerField = "<div id='player" + (i + addedPlayers) + "' class='playerBar'><div class='headers'>" + $('#newPlayer' + i).val() + "<span class='removePlayerBtn'><i class='fa fa-minus-circle'></i></span></div></div>";
                $("#scoreCard").append(playerField);
                for (var j = 0; j < courseData.course.holes.length; j++) {
                    var scoreDiv = "<div class='holeScore'><input id='player" + (i + addedPlayers) + "-" + j + "'type='text' class='scoreField'></div>";
                    $("#player" + (i + addedPlayers)).append(scoreDiv);
                    if (j % 9 === 8) {
                        var scoreTotalDiv = "<div id='player" + (i + addedPlayers) + "Total" + (j + 1) + "' class='yardage'></div>";
                        $("#player" + (i + addedPlayers)).append(scoreTotalDiv);
                    }
                }
                var scoreFinalDiv = "<div id='player" + (i + addedPlayers) + "TotalYrd' class='yardage'></div>";
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

        $(".scoreField").unbind().change(function () {
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
                            activeScoreDivID = $("#player" + playerID + "Total9");
                        }
                        else {
                            activeScoreDivID = $("#player" + playerID + "Total18");
                        }
                        if (activeScoreDivID.html() === null || $.trim(activeScoreDivID.html()) === "")
                        {
                            activeScoreDivID.html($(this).val());
                        }
                        else
                        {
                            activeScoreDivID.html(Number(activeScoreDivID.html()) + Number($(this).val()));
                        }

                        if (currentHole === (courseData.course.holes.length - 1)) {
                            roundFinished = true;
                        }
                    }
                    else {
                        $(this).val("");
                    }
                    // use $("scoreCard).length to dynamically populate results table as each golfer finishes
                    if (roundFinished) {
                        var playerRow = $(this).parent().parent().attr("id");
                        $("#" + playerRow).children(".holeScore").children(".scoreField").prop("readonly", true);
                        $("#" + playerRow).children(".holeScore").children(".scoreField").css("border", "none");
                        $("#player" + playerID + "TotalYrd").html(Number($("#player" + playerID + "Total9").html()) + Number($("#player" + playerID + "Total18").html()));

                        var strokesPar = Number($("#player" + playerID + "TotalYrd").html()) - Number($("#totalPar").html());
                        var endGameMsg = "";
                        if (strokesPar <= -20)
                        {
                            endGameMsg = "Watch out early 2000s Tiger Woods!"
                        }
                        else if (strokesPar < 0)
                        {
                            endGameMsg = "Yay, the happy side of par!"
                        }
                        else if (strokesPar <= 10)
                        {
                            endGameMsg = "Not too shabby!"
                        }
                        else
                        {
                            endGameMsg = "It looks like Charles Barkley was on the course today..."
                        }
                        var playerName = $("#player" + playerID).children(".headers").html();
                        var playerResult = "<div id='finalScore" + playerID + "' class='scoreDisplay'>" + playerName + " has a score of " + strokesPar + ". " + endGameMsg + "</div>";
                        $("#scoreCard").append(playerResult);
                    }
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


// what I need to do for the extra stuff: display a map of the hole with tee and hole position, find course within radius of app
// UI stuff that needs doing: course selection page, different color for hcp and need a height for empty fields in hcp and players
// need a close button for the modal if they want to quit without adding a new player