/**
 * Created by Godai Yuusaku on 10/26/2016.
 */
$.getJSON( "https://golf-courses-api.herokuapp.com/courses/11819", function( data ) {
    // var course = JSON.parse(data);
    // console.log(data.course.holes[0].tee_boxes[0].tee_hex_color);
    var items = [];
    $.each( data.course.tee_types, function( key ) {
        $.each(data.course.tee_types[key], function (tee_key, tee_val)
        {
            if (tee_key === "tee_type" || tee_key === "tee_hex_color")
            items.push( "<li id='" + tee_key + "'>" + tee_key + " : "  +tee_val + "</li>" );
        });

    });

    $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
    }).appendTo( "body" );
});