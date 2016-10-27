/**
 * Created by GodaiYuusaku on 10/26/16.
 */
var TEES_ALPHA = 0.8;

// actual code will almost certainly create the #pro id, but at the very least should get a color for it that needs to be changed to rgba
$("#pro").css("background-color", hexToRgba("#443C30"));
$("#champion").css("background-color", hexToRgba("#6e869e"));
$("#men").css("background-color", hexToRgba("#ffffff"));
$("#women").css("background-color", hexToRgba("#ff0000"));

$(".tees").click(function () {
    $(".tees").slideToggle();
    $(this).stop();
});








// for changing hex color to rgba color
function hexToRgba(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return "rgba(" + parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16) + ", " + TEES_ALPHA + ")";
}