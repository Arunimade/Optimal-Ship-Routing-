document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('route-form');
    const map = L.map('map').setView([0, 0], 2);

    // Initialize the tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Event listener for form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const startLat = parseFloat(document.getElementById('start_lat').value);
        const startLon = parseFloat(document.getElementById('start_lon').value);
        const goalLat = parseFloat(document.getElementById('goal_lat').value);
        const goalLon = parseFloat(document.getElementById('goal_lon').value);

        // Validate input coordinates
        if (isNaN(startLat) || isNaN(startLon) || isNaN(goalLat) || isNaN(goalLon)) {
            alert('Please enter valid coordinates.');
            return;
        }

        // Set the view on the map based on the start coordinates
        map.setView([startLat, startLon], 10);

        // Add markers for start and goal points
        L.marker([startLat, startLon]).addTo(map)
            .bindPopup('Start Point')
            .openPopup();

        L.marker([goalLat, goalLon]).addTo(map)
            .bindPopup('Goal Point');

        // Draw a line between the start and goal points
        L.polyline([
            [startLat, startLon],
            [goalLat, goalLon]
        ]).addTo(map);

        // Make a request to the server to fetch route details
        try {
            const response = await fetch('/findroute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'start_lat': startLat,
                    'start_lon': startLon,
                    'goal_lat': goalLat,
                    'goal_lon': goalLon,
                })
            });

            const result = await response.json();

            // Display the result message
            document.getElementById('result').innerHTML = `
                <h2>Route Details</h2>
                <p>${result.message}</p>
                <p>Start Latitude: ${startLat}</p>
                <p>Start Longitude: ${startLon}</p>
                <p>Goal Latitude: ${goalLat}</p>
                <p>Goal Longitude: ${goalLon}</p>
            `;
        } catch (error) {
            alert('An error occurred while fetching the route details.');
            console.error('Error:', error);
        }
    });
});
