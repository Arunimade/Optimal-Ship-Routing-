document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('route-form');
    const map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const startLat = parseFloat(document.getElementById('start_lat').value);
        const startLon = parseFloat(document.getElementById('start_lon').value);
        const goalLat = parseFloat(document.getElementById('goal_lat').value);
        const goalLon = parseFloat(document.getElementById('goal_lon').value);

        if (isNaN(startLat) || isNaN(startLon) || isNaN(goalLat) || isNaN(goalLon)) {
            alert('Please enter valid coordinates.');
            return;
        }

        map.setView([startLat, startLon], 10);

        L.marker([startLat, startLon]).addTo(map)
            .bindPopup('Start Point')
            .openPopup();

        L.marker([goalLat, goalLon]).addTo(map)
            .bindPopup('Goal Point');

        L.polyline([
            [startLat, startLon],
            [goalLat, goalLon]
        ]).addTo(map);

        document.getElementById('result').innerHTML = `
            <h2>Route Details</h2>
            <p>Start Latitude: ${startLat}</p>
            <p>Start Longitude: ${startLon}</p>
            <p>Goal Latitude: ${goalLat}</p>
            <p>Goal Longitude: ${goalLon}</p>
        `;
    });
});
