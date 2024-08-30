import static spark.Spark.*;
import org.json.JSONObject;

public class ShipRouteFinder {
    public static void main(String[] args) {
        port(4567); // Set the port number

        // Define a route for handling route finding requests
        post("/findroute", (request, response) -> {
            // Initialize a JSON response object
            JSONObject jsonResponse = new JSONObject();

            try {
                // Extract parameters from the request
                String startLat = request.queryParams("start_lat");
                String startLon = request.queryParams("start_lon");
                String goalLat = request.queryParams("goal_lat");
                String goalLon = request.queryParams("goal_lon");

                // Validate input parameters
                if (startLat == null || startLon == null || goalLat == null || goalLon == null) {
                    response.status(400);
                    jsonResponse.put("status", "error");
                    jsonResponse.put("message", "Missing required parameters: start_lat, start_lon, goal_lat, goal_lon");
                    return jsonResponse.toString();
                }

                // Perform route calculation (dummy implementation)
                String result = findRoute(startLat, startLon, goalLat, goalLon);

                // Set response type and return result
                response.type("application/json");
                response.status(200);
                jsonResponse.put("status", "success");
                jsonResponse.put("message", result);
                return jsonResponse.toString();

            } catch (Exception e) {
                // Handle exceptions and return an error response
                response.status(500);
                jsonResponse.put("status", "error");
                jsonResponse.put("message", "An internal server error occurred: " + e.getMessage());
                return jsonResponse.toString();
            }
        });

        // Set up a default route for handling invalid paths
        get("/*", (request, response) -> {
            response.status(404);
            return "404 Not Found";
        });
    }

    private static String findRoute(String startLat, String startLon, String goalLat, String goalLon) {
        // Logic to find the route goes here
        // For now, this is a dummy response for illustration purposes
        return "Route calculated successfully from (" + startLat + ", " + startLon + ") to (" + goalLat + ", " + goalLon + ")";
    }
}
