/**
 * Created by GodaiYuusaku on 10/26/16.
 */
$("#pro").click(function () {
    $("#champion").slideUp();
    $("#men").slideUp();
    $("#women").slideUp();
});

$("#champion").click(function () {
    $("#pro").slideUp();
    $("#men").slideUp();
    $("#women").slideUp();
});

$("#pro").click(function () {
    $("#champion").slideUp();
    $("#champion").css("display", "none");
    $("#men").slideUp();
    $("#women").slideUp();
});

$("#pro").click(function () {
    $("#champion").slideUp();
    $("#champion").css("display", "none");
    $("#men").slideUp();
    $("#women").slideUp();
});