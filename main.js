document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([10, 78], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    }).addTo(map);

    const start = [8.0, 77.0];
    const goal = [12.0, 82.0];

    fetch('/find_route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, goal }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const { initial_route, final_route } = data;

            const initialRoutePolyline = L.polyline(initial_route, { color: 'blue' }).addTo(map);
            const finalRoutePolyline = L.polyline(final_route, { color: 'red' }).addTo(map);

            map.fitBounds(finalRoutePolyline.getBounds());
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});
