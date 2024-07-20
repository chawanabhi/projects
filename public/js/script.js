const socket=io();


if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
        const{latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,

    }

);
}

const map=L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"done"
}).addTo(map);


const markers={};


socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}=data;
    if (markers[id]) {
        // Update the existing marker's position
        markers[id].setLatLng([latitude, longitude]);
    } else {
        // Create a new marker for this user
        markers[id] = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`User ID: ${id}`)
            .openPopup();
    }
    map.setView([latitude,longitude],16);
   
});

socket.om("user-disconnect",(id)=>{
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});