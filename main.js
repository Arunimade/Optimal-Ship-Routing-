document.getElementById('route-form').addEventListener('submit', function(event) {
    event.preventDefault();
    findRoute();
});

function findRoute() {
    const startLat = parseFloat(document.getElementById('start_lat').value);
    const startLon = parseFloat(document.getElementById('start_lon').value);
    const goalLat = parseFloat(document.getElementById('goal_lat').value);
    const goalLon = parseFloat(document.getElementById('goal_lon').value);

    const data = {
        start: [startLat, startLon],
        goal: [goalLat, goalLon]
    };

    fetch('/find_route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            displayResult(data.initial_route, data.final_route, data.plot);
            plotMap(data.initial_route, data.final_route);
        } else {
            document.getElementById('result').innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayResult(initialRoute, finalRoute, plot) {
    document.getElementById('result').innerHTML = `
        <h2>Route Found</h2>
        <p>Initial Route: ${initialRoute}</p>
        <p>Final Route: ${finalRoute}</p>
        <img src="data:image/png;base64,${plot}" alt="Route Plot">
    `;
}

function plotMap(initialRoute, finalRoute) {
    const map = L.map('map').setView([initialRoute[0][0], initialRoute[0][1]], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const initialLine = L.polyline(initialRoute, { color: 'red' }).addTo(map);
    const finalLine = L.polyline(finalRoute, { color: 'blue' }).addTo(map);

    map.fitBounds(finalLine.getBounds());
}
