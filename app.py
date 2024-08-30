from flask import Flask, request, jsonify
import math

app = Flask(__name__)

def calculate_distance(start_lat, start_lon, goal_lat, goal_lon):
    """
    A dummy function to calculate distance between two lat/lon points.
    Uses the Haversine formula to compute the great-circle distance.
    """
    R = 6371  # Radius of the Earth in kilometers
    d_lat = math.radians(float(goal_lat) - float(start_lat))
    d_lon = math.radians(float(goal_lon) - float(start_lon))
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(float(start_lat))) * math.cos(math.radians(float(goal_lat))) * math.sin(d_lon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

@app.route('/findroute', methods=['POST'])
def find_route():
    try:
        # Extracting form data from request
        start_lat = request.form.get('start_lat')
        start_lon = request.form.get('start_lon')
        goal_lat = request.form.get('goal_lat')
        goal_lon = request.form.get('goal_lon')

        # Basic validation for input data
        if not all([start_lat, start_lon, goal_lat, goal_lon]):
            return jsonify({"status": "error", "message": "All coordinates must be provided"}), 400
        
        # Calculate the distance
        distance = calculate_distance(start_lat, start_lon, goal_lat, goal_lon)

        # Here you would typically call a real routing service or algorithm
        # For now, we just return the calculated distance as a placeholder
        result = {
            "status": "success",
            "message": "Route found successfully!",
            "start": {"latitude": start_lat, "longitude": start_lon},
            "goal": {"latitude": goal_lat, "longitude": goal_lon},
            "distance_km": distance
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
