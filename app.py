from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/findroute', methods=['POST'])
def find_route():
    start_lat = request.form.get('start_lat')
    start_lon = request.form.get('start_lon')
    goal_lat = request.form.get('goal_lat')
    goal_lon = request.form.get('goal_lon')
    
    # Route calculation logic goes here
    # Dummy implementation for example purposes
    result = {
        "status": "success",
        "message": "Route found successfully!",
        "start": (start_lat, start_lon),
        "goal": (goal_lat, goal_lon)
    }
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
