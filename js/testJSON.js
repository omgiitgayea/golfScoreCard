/**
 * Created by Godai Yuusaku on 10/26/2016.
 */

$("input[type=radio][name=courseSearch]").change(function () {
    if (this.value === "radius")
    {
        console.log("Radius!")
    }
    else
    {
        console.log("Location!")
    }
});