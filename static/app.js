// --------------------
// Menu logic
// --------------------
document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("side-menu").classList.toggle("hidden");
});

let currentTask = null;

function toggleSubmenu(submenuId) {
    document.getElementById(submenuId).classList.toggle("hidden");

    if (currentTask !== submenuId) {
        hideInfoSidebar();
    }

    currentTask = submenuId;
}

function hideInfoSidebar() {
    const sidebar = document.getElementById("info-sidebar");
    sidebar.classList.add("hidden");
    sidebar.innerHTML = `
        <h3>Location Info</h3>
        <p>Click a Task 2 location marker to see details here.</p>
    `;
}

// --------------------
// Leaflet map
// --------------------
const map = L.map('map').setView([60.4858, 15.4371], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let featureGroup = L.layerGroup().addTo(map);


// Task 1: 
let pointFeature = null;
let lineFeature = null;
let polygonFeature = null;

// Task 1: Point
function addPoint() {
    if (pointFeature) return;
    pointFeature = L.marker([60.48411713603965, 15.428019044555626]);

    pointFeature.bindPopup(`
        <h3>Point Feature</h3>
        <p>This beautiful Borlänge Central Station.</p>
        <img src="/static/images/CentralStation.jpg" alt="Centralstation Borlänge" width="180">
    `);

    pointFeature.addTo(featureGroup);
}

// Task 1: Line
function addLine() {
    if (lineFeature) return;

    const latlngs = [
        [60.48411713603965, 15.428019044555626],
        [60.48190456722427, 15.421187614250112],
        [60.47855617523543, 15.416689067677039]
    ];

    lineFeature = L.polyline(latlngs, { color: 'blue' });

    lineFeature.bindPopup(`
        <h3>Line Feature</h3>
        <p>This is how a bird might fly from Centralstation, pass by Ikea, and land at McDonalds.</p>
        <img src="/static/images/pigeon.jpg" alt="Line image" width="180">
    `);

    lineFeature.addTo(featureGroup);
}

// Task 1: Polygon
function addPolygon() {
    if (polygonFeature) return;

    const latlngs = [
        [60.504602043609104, 15.45340085770427],
        [60.449754891616344, 15.448974004606674],
        [60.494636729315374, 15.359488331276705]
    ];

    polygonFeature = L.polygon(latlngs, {
        color: 'green',
        fillColor: 'lightgreen',
        fillOpacity: 0.5
    });

    polygonFeature.bindPopup(`
        <h3>Polygon Feature</h3>
        <p>This is THE place to be in Sweden.</p>
        <img src="/static/images/dalahorse.jpg" alt="On Dalarhorseback" width="180">
    `);

    polygonFeature.addTo(featureGroup);
}

// Clear all features
function clearMap() {
    featureGroup.clearLayers();
}

// Task 2 locations
let task2Group = L.layerGroup().addTo(map);

const task2Locations = [
    {
        name: "Kupolen Center",
        coords: [60.48475115943656, 15.418341259628184],
        address: "Kupolen 53, 781 70 Borlänge",
        info: "Unique, hemispherical retail complex with 85+ stores & casual dining options on 2 floors..",
        image: "/static/images/Kupolen.jpg"
    },
    {
        name: "Dalarna Science Park",
        coords: [60.48398071854131, 15.410647098563706],
        address: "Forskargatan 3, 781 70 Borlänge",
        info: "The place to be to larp and get free lunch.",
        image: "/static/images/SciencePark.jpg"
    },
    {
        name: "Bjusanstugan",
        coords: [60.49141001965103, 15.324152713185438],
        address: "Unnamed Road, 781 69 Borlänge",
        info: "Publicly accessible beautiful place to hide at during weekdays",
        image: "/static/images/Bjusanstugan.jpg"
    },
    {
        name: "Fritidsbanken",
        coords: [60.48582226966935, 15.433504740174902],
        address: "Borganäsvägen 30, 784 33 Borlänge",
        info: "Can borrow a bicycle and other cool things",
        image: "/static/images/Fritidsbanken.jpeg"
    },
    {
        name: "Uni Dalarna",
        coords: [60.48909355768045, 15.4338153238202],
        address: "Stationsgatan 4, 784 33 Borlänge",
        info: "Fancy, flaired with modern plastic plants for decoration, coffee that is war crime, more students than seats, falsely claims lectures be open to public",
        image: "/static/images/UniDalarna.jpg"
    }
];

function showTask2Locations() {
    task2Group.clearLayers();

    const sidebar = document.getElementById("info-sidebar");
    sidebar.classList.remove("hidden");
    sidebar.innerHTML = `
        <h3>Location Info</h3>
        <p>Click a marker to see details here.</p>
    `;

    task2Locations.forEach(function(location) {
        const marker = L.marker(location.coords);

        marker.on("click", function() {
            const sidebar = document.getElementById("info-sidebar");

            sidebar.innerHTML = `
                <h3>${location.name}</h3>
                <p><strong>Location:</strong> ${location.address}</p>
                <p><strong>Info:</strong> ${location.info}</p>
                <img src="${location.image}" alt="${location.name}">
            `;

            sidebar.classList.remove("hidden");
        });

        marker.bindPopup(`<b>${location.name}</b>`);
        marker.addTo(task2Group);
    });

    const bounds = L.latLngBounds(task2Locations.map(loc => loc.coords));
    map.fitBounds(bounds, { padding: [40, 40] });
}

function clearTask2Locations() {
    task2Group.clearLayers();
    hideInfoSidebar();
}


// Task 3: 

let task3Group = L.layerGroup().addTo(map);

function showTask3() {
    task3Group.clearLayers();

    fetch("/static/data/supermarket.geojson")
        .then(response => response.json())
        .then(data => {
            const features = data.features;
            const buffers = [];

            features.forEach((feature, i) => {
                const buffer = turf.buffer(feature, 1, { units: "kilometers" });
                buffers.push({
                    feature: feature,
                    buffer: buffer,
                    overlaps: false
                });
            });

            for (let i = 0; i < buffers.length; i++) {
                for (let j = i + 1; j < buffers.length; j++) {
                    if (turf.booleanIntersects(buffers[i].buffer, buffers[j].buffer)) {
                        buffers[i].overlaps = true;
                        buffers[j].overlaps = true;
                    }
                }
            }

            buffers.forEach(item => {
                L.geoJSON(item.buffer, {
                    style: {
                        color: item.overlaps ? "orange" : "green",
                        weight: 2,
                        fillOpacity: 0.15
                    }
                }).addTo(task3Group);
            });

            const geojsonLayer = L.geoJSON(data, {
                pointToLayer: function(feature, latlng) {
                    const matched = buffers.find(b => b.feature === feature);

                    return L.circleMarker(latlng, {
                        radius: 7,
                        color: matched.overlaps ? "orange" : "blue",
                        fillColor: matched.overlaps ? "orange" : "limegreen",
                        fillOpacity: 1,
                        weight: 2
                    });
                },
                onEachFeature: function(feature, layer) {
                    const name = feature.properties.name || "Unnamed supermarket";
                    layer.bindPopup(`<b>${name}</b>`);
                }
            }).addTo(task3Group);

            map.fitBounds(geojsonLayer.getBounds(), { padding: [40, 40] });
        })
        .catch(error => console.error("Error loading supermarket GeoJSON:", error));
}

function clearTask3() {
    task3Group.clearLayers();
}