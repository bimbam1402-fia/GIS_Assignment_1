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
    // const bounds = L.latLngBounds(pointFeature.map(loc => loc.coords));
    // map.fitBounds(bounds, { padding: [40, 40] });
    map.setView([60.48411713603965, 15.428019044555626], 15);
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
    map.fitBounds(polygonFeature.getBounds(), { padding: [40, 40] });
}

// Clear all features
function clearMap() {
    featureGroup.clearLayers();

    pointFeature = null;
    lineFeature = null;
    polygonFeature = null;
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
        info: "Dalarna Science Park är en samverkansplattform för företagsutveckling, utvecklingsprojekt och en självklar mötespunkt för Dalarnas innovationskraft.",
        image: "/static/images/SciencePark.jpg"
    },
    {
        name: "Bjusanstugan",
        coords: [60.49141001965103, 15.324152713185438],
        address: "Unnamed Road, 781 69 Borlänge",
        info: "En rast- och övernattningsstuga som förvaltas av Borlänge kommun. I stugan finns en kamin, bord och bänkar.",
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
        info: "Kvalificerad utbildning och forskning i hjärtat av Dalarna. Studera via distans eller på våra campus i Falun och Borlänge, med närhet till natur",
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

     task3Legend.addTo(map);

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


// legend for Task 3
const task3Legend = L.control({ position: "bottomright" });

task3Legend.onAdd = function () {
    const div = L.DomUtil.create("div", "legend task3-legend");

    div.innerHTML = `
        <h4>Supermarkets 1 km Buffer</h4>
        
        <p><span class="legend-dot orange-dot"></span> Supermarket with overlap</p>
        <p><span class="legend-dot green-dot"></span> Supermarket without overlap</p>
    `;

    return div;
};


function clearTask3() {
    task3Group.clearLayers();
    map.removeControl(task3Legend);
}

/* Task 4: */
var task4Overlay;
var bounds = [[59.3442, 18.0775], [59.3175, 18.1635]];


function showTask4() {
    
    if (task4Overlay) {
        map.removeLayer(task4Overlay);
    }

    task4Overlay=L.imageOverlay('/static/images/Djurgarden_karta.png', bounds, {
        opacity: 0.8,
        interactive: true
    }).addTo(map);
    
    
    map.fitBounds(bounds);
}

function clearTask4() {
    if (task4Overlay) {
        map.removeLayer(task4Overlay);
        task4Overlay = null;
    }
}

// Task 5

let fuelLayer;

// Task 5 - MarkerCluster
function loadFuelCluster() {
    console.log("CLICKED");

    if (fuelLayer && map.hasLayer(fuelLayer)) {
        map.removeLayer(fuelLayer);
    }

    fuelLayer = L.markerClusterGroup();

    fetch("/static/data/fuel.geojson")
        .then(res => {
            return res.json();
        })
        .then(data => {
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    const marker = L.marker(latlng);
                    marker.bindPopup(feature.properties?.name || "No name");
                    return marker;
                }
            }).addTo(fuelLayer);

            fuelLayer.addTo(map);

            map.fitBounds(fuelLayer.getBounds());
        })
}

// Task 5.1 - DonutCluster
function loadFuelDonut() {
    if (fuelLayer && map.hasLayer(fuelLayer)) {
        map.removeLayer(fuelLayer);
    }

    fuelLayer = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            const count = cluster.getChildCount();

            return L.divIcon({
                html: `<div style="
                    background: red;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    color:white;
                    font-weight:bold;
                ">${count}</div>`,
                className: "custom-donut",
                iconSize: L.point(40, 40)
            });
        }
    });

    fetch("/static/data/fuel.geojson")
        .then(res => res.json())
        .then(data => {

            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    const marker = L.marker(latlng);
                    marker.bindPopup(feature.properties?.name || "No name");
                    return marker;
                }
            }).addTo(fuelLayer);

            fuelLayer.addTo(map);
            map.fitBounds(fuelLayer.getBounds());
        })
        .catch(err => console.error(err));
}

// Clear
function clearFuel() {
    if (fuelLayer) {
        map.removeLayer(fuelLayer);
    }
}

// Task 6 - Weather API

let weatherLayer;

const cities = [
    { name: "Borlänge", coords: [60.4858, 15.4371] },
    { name: "Falun", coords: [60.6035, 15.6256] },
    { name: "Gävle", coords: [60.6749, 17.1414] },
    { name: "Uppsala", coords: [59.8586, 17.6389] },
    { name: "Stockholm", coords: [59.3293, 18.0686] }
];

function getWeather(city) {
    const apiKey = "434fff5ba80447475db3da21854d9f4b";
    
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords[0]}&lon=${city.coords[1]}&appid=${apiKey}&units=metric`)
    .then(res => res.json());
}

 function getForecast(city) {
        const apiKey = "434fff5ba80447475db3da21854d9f4b";
        
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.coords[0]}&lon=${city.coords[1]}&appid=${apiKey}&units=metric`)
        .then(res => res.json());
 }

function loadWeather() {

    if (weatherLayer && map.hasLayer(weatherLayer)) {
        map.removeLayer(weatherLayer);
    }

    weatherLayer = L.layerGroup();

    cities.forEach(city => {
        getWeather(city).then(data => {

            const marker = L.marker(city.coords);

            marker.bindPopup(`
                <b>${city.name}</b><br>
                Temp: ${data.main.temp} °C<br>
                Weather: ${data.weather[0].description}
            `);

        marker.on("click", () => {
            getForecast(city).then(forecast => {
                showWeatherSidebar(city, data, forecast);
            });
        });

        weatherLayer.addLayer(marker);

        const bounds = L.latLngBounds(cities.map(c => c.coords));
        map.fitBounds(bounds, { padding: [40, 40] });
    });
});

weatherLayer.addTo(map);
}

function showWeatherSidebar(city, data, forecast) {
    const sidebar = document.getElementById("info-sidebar");

    let forecastHtml = "<h4>Forecast</h4>";

    forecast.list.slice(0, 5).forEach(item => {
        forecastHtml += `
            <p>
            ${item.dt_txt}<br>
            Temp: ${item.main.temp} °C
            </p>
        `;
    });

    sidebar.innerHTML = `
    <button onclick="closeSidebar()" style="float:right;">X</button>
        <h3>${city.name}</h3>
        <p> Temp: ${data.main.temp} °C</p>
        <p> Wind: ${data.wind.speed} m/s</p>
        <p> ${data.weather[0].description}</p>
        <p> Humidity: ${data.main.humidity}%</p>
        ${forecastHtml}
    `;

    sidebar.classList.remove("hidden");
    }

    // Clear
function clearWeather() {
    if (weatherLayer && map.hasLayer(weatherLayer)) {
        map.removeLayer(weatherLayer);
    }
        const sidebar = document.getElementById("info-sidebar");
        sidebar.classList.add("hidden");
}

    function closeSidebar() {
    const sidebar = document.getElementById("info-sidebar");
    sidebar.classList.add("hidden");
}

function toggleSubmenu(id) {
    var submenu = document.getElementById(id);
    if (submenu.classList.contains('hidden')) {
        submenu.classList.remove('hidden');
    } else {
        submenu.classList.add('hidden');
    }
};


// Task 7

const schoolClusterGroup = L.layerGroup().addTo(map);

function showSchoolClusters() {
    schoolClusterGroup.clearLayers();
    legend.addTo(map);

    fetch("/school-clusters")
        .then(response => response.json())
        .then(data => {
            const schools = data.schools;
            const centroids = data.centroids;

            const clusterColors = {
                0: "red",
                1: "blue",
                2: "green",
                3: "purple"
            };

            schools.forEach(function(school) {
                const lat = school.ycoord;
                const lon = school.xcoord;
                const cluster = school.cluster;

                const marker = L.circleMarker([lat, lon], {
                    radius: 7,
                    color: clusterColors[cluster],
                    fillColor: clusterColors[cluster],
                    fillOpacity: 0.8
                });

                marker.bindPopup(`
                    <strong>${school.Name}</strong><br>
                    ${school.description}<br>
                    <strong>Cluster:</strong> ${cluster}
                `);

                marker.addTo(schoolClusterGroup);
            });

            centroids.forEach(function(center) {
                const centroidMarker = L.circleMarker([center.ycoord, center.xcoord], {
                    radius: 14,
                    color: "black",
                    fillColor: clusterColors[center.cluster],
                    fillOpacity: 0.35,
                    weight: 3
                    //interactive: false
                });

                centroidMarker.on('click', function(e) {
                    e.originalEvent.stopPropagation();
                });

                centroidMarker.bindPopup(`
                    <strong>Cluster ${center.cluster} centroid</strong><br>
                    Longitude: ${center.xcoord.toFixed(4)}<br>
                    Latitude: ${center.ycoord.toFixed(4)}
                `);

                centroidMarker.addTo(schoolClusterGroup);
                centroidMarker.bringToBack();
            });

            const bounds = L.latLngBounds(
                schools.map(school => [school.ycoord, school.xcoord])
            );

            map.fitBounds(bounds, { padding: [40, 40] });
        });
}

// make a legend of clusters
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");

    const colors = {
        0: "red",
        1: "blue",
        2: "green",
        3: "purple"
    };

    div.innerHTML = "<strong>School Clusters</strong><br>";

    for (const key in colors) {
        div.innerHTML += `
            <i style="background:${colors[key]}; width:12px; height:12px; display:inline-block; margin-right:5px;"></i>
            Cluster ${key}<br>
        `;
    }

    return div;
};

//legend.addTo(map);

function clearSchoolClusters() {
    schoolClusterGroup.clearLayers();
    map.removeControl(legend);
}

/* Task 8 */ 
// 1. Skapa en LayerGroup för Task 8 (lägg denna högst upp i app.js)
let task8LayerGroup = L.layerGroup();

// 2. Själva analysfunktionen
async function solveTask8() {
    console.log("Task 8: Startar...");
    if (typeof turf === 'undefined') {
        alert("Turf saknas!");
        return;
    }

    task8LayerGroup.clearLayers();
    task8LayerGroup.addTo(map);
    task8Legend.addTo(map);

    try {
        const schoolData = await loadCSV("static/data/school_locations.csv", ",");
        const popData = await loadCSV("static/data/Stockholm_pop.csv", ";");

        // 1. Skapa skolor
        const schoolFeatures = schoolData
            .filter(d => d.xcoord && d.ycoord)
            .map(d => turf.point([parseFloat(d.xcoord), parseFloat(d.ycoord)]));

        // 2. Skapa befolkning
        const popFeatures = popData
            .filter(d => d.Longitude && d.Latitude)
            .map(d => turf.point([parseFloat(d.Longitude), parseFloat(d.Latitude)], { pop: d.Population }));

        // 3. Skapa buffertar
        const schoolBuffers = schoolFeatures.map(f => turf.buffer(f, 2, { units: 'kilometers' }));

        // 4. ERSÄTT UNION MED COMBINE (Mycket stabilare)
        // Combine skapar en enda MultiPolygon av alla små cirklar
            const combinedResult = turf.combine(turf.featureCollection(schoolBuffers));
            const finalBufferArea = combinedResult.features[0]; 

        // 5. Filtrera punkter
        // Vi kollar om punkten ligger inuti vår sammanslagna MultiPolygon
        const outsidePoints = popFeatures.filter(p => {
            return !turf.booleanPointInPolygon(p, finalBufferArea);
        });

        console.log("Analys klar. Hittade " + outsidePoints.length + " punkter.");

        // 6. Rita ut buffert-ytan
        L.geoJSON(finalBufferArea, {
            style: { color: 'blue', weight: 1, fillOpacity: 0.1, interactive: false}
        }).addTo(task8LayerGroup);

        // 7. Rita ut de röda punkterna
        const resLayer = L.geoJSON(turf.featureCollection(outsidePoints), {
            pointToLayer: (f, latlng) => L.circleMarker(latlng, {
                radius: 7,
                fillColor: "#ff0000",
                color: "#fff",
                weight: 2,
                fillOpacity: 0.9
            })
        }).bindPopup(l => `Befolkning: ${l.feature.properties.pop}`).addTo(task8LayerGroup);

        if (outsidePoints.length > 0) {
            map.fitBounds(resLayer.getBounds());
        }

    } catch (error) {
        console.error("Task 8 misslyckades kapitalt:", error);
        alert("Något gick fel: " + error.message);
    }
}

const task8Legend = L.control({ position: "bottomright" });

task8Legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");

    const colors = {
        0: "blue",
        1: "red",

    };
        const labels = {
        0: "2 km buffert",
        1: "Non-overlapping population points"
    };

    div.innerHTML = "<strong>Task 8 legend</strong><br>";

    for (const key in colors) {
        div.innerHTML += `
            <i style="background:${colors[key]}; width:12px; height:12px; display:inline-block; margin-right:5px;"></i>
            ${labels[key]}<br>
        `;
    }

    return div;
};


function clearTask8() {
    task8LayerGroup.clearLayers();
    map.removeLayer(task8LayerGroup);
}
function loadCSV(url, delimiter) {
    // Tvinga URL:en att utgå från serverns rot
    const absoluteUrl = window.location.origin + (url.startsWith('/') ? '' : '/') + url;
    
    return new Promise((resolve, reject) => {
        Papa.parse(absoluteUrl, {
            download: true,
            header: true,
            delimiter: delimiter,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    console.log("SUCCESS: Laddade " + results.data.length + " rader från " + url);
                    resolve(results.data);
                } else {
                    reject(new Error("Filen är tom eller kunde inte tolkas: " + url));
                }
            },
            error: (err) => {
                console.error("PAPA PARSE ERROR:", err);
                reject(err);
            }
        });
    });
}