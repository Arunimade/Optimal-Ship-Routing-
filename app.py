from flask import Flask, render_template, request, jsonify
import numpy as np
import matplotlib.pyplot as plt
from geopy.distance import geodesic
import requests
from bs4 import BeautifulSoup
from queue import PriorityQueue
import io
import base64

app = Flask(__name__)

class Ship:
    def __init__(self, max_speed, fuel_consumption_rate, comfort_threshold, safety_threshold):
        self.max_speed = max_speed
        self.fuel_consumption_rate = fuel_consumption_rate
        self.comfort_threshold = comfort_threshold
        self.safety_threshold = safety_threshold

def get_weather_data(lat, lon):
    return {'currents': 0.5, 'waves': 2.0, 'wind_speed': 5.0}

def haversine_distance(coord1, coord2):
    return geodesic(coord1, coord2).nautical

def astar_search(start, goal, ship):
    open_set = PriorityQueue()
    open_set.put((0, start))
    came_from = {}
    g_score = {start: 0}
    f_score = {start: haversine_distance(start, goal)}

    while not open_set.empty():
        current = open_set.get()[1]

        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path

        directions = [
            (0.1, 0), (-0.1, 0), (0, 0.1), (0, -0.1),
            (0.1, 0.1), (0.1, -0.1), (-0.1, 0.1), (-0.1, -0.1)
        ]

        for d in directions:
            neighbor = (current[0] + d[0], current[1] + d[1])
            if 0 <= neighbor[0] <= 90 and 0 <= neighbor[1] <= 180:
                temp_g_score = g_score[current] + haversine_distance(current, neighbor)
                weather_data = get_weather_data(neighbor[0], neighbor[1])
                if (weather_data['waves'] <= ship.comfort_threshold and
                    weather_data['wind_speed'] <= ship.safety_threshold):

                    if neighbor not in g_score or temp_g_score < g_score[neighbor]:
                        came_from[neighbor] = current
                        g_score[neighbor] = temp_g_score
                        f_score[neighbor] = temp_g_score + haversine_distance(neighbor, goal)
                        open_set.put((f_score[neighbor], neighbor))

    return None

def adjust_route(route, ship):
    adjusted_route = []
    for waypoint in route:
        weather_data = get_weather_data(waypoint[0], waypoint[1])
        if weather_data['waves'] <= ship.comfort_threshold and weather_data['wind_speed'] <= ship.safety_threshold:
            adjusted_route.append(waypoint)
        else:
            alternative = (waypoint[0] + 0.1, waypoint[1] + 0.1)
            adjusted_route.append(alternative)
    return adjusted_route

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find_route', methods=['POST'])
def find_route():
    data = request.json
    start = tuple(data['start'])
    goal = tuple(data['goal'])
    ship = Ship(max_speed=20, fuel_consumption_rate=0.2, comfort_threshold=3, safety_threshold=10)

    initial_route = astar_search(start, goal, ship)
    if initial_route:
        final_route = adjust_route(initial_route, ship)
        return jsonify({'status': 'success', 'initial_route': initial_route, 'final_route': final_route})
    else:
        return jsonify({'status': 'failure', 'message': 'No route found'})

if __name__ == '__main__':
    app.run(debug=True)
