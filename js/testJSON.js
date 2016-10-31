/**
 * Created by Godai Yuusaku on 10/26/2016.
 */

function initMap() {
    var holePos = {lat: 40.431459252532, lng: -111.905075311661};
    var teePos = {lat: 40.4295033232823, lng: -111.902114152909};
    var centerPos = {lat:((holePos.lat + teePos.lat) / 2), lng:((holePos.lng + teePos.lng) / 2)};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: centerPos,
        mapTypeId: "satellite"
    });
    var markerHole = new google.maps.Marker({
        position: holePos,
        map: map
    });
    var markerTee = new google.maps.Marker({
        position: teePos,
        map: map
    });
}