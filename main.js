// Define the service data
const services = {
    "Location Specific Forecast": { duration_days: 3, frequency_hours: 3 },
    "Forecast for the Islands": { duration_days: 7, frequency_hours: 3 },
    "Coastal Forecast": { duration_days: 7, frequency_hours: 3 },
    "Deep Sea Forecast": { duration_days: 7, frequency_hours: 3 },
    "Indian Ocean Forecast": { duration_days: 5, frequency_hours: 6 },
    "Global Forecast": { duration_days: 5, frequency_hours: 6 },
    "Forecast along Ship Tracks": { duration_days: 3, frequency_hours: 6 },
    "Webmap Services": { duration_days: 7, frequency_hours: 6 },
    "Port and Harbour Forecast": { duration_days: 2, frequency_hours: 3 },
    "Forecast for Maldives": { duration_days: 3, frequency_hours: 3 },
    "Oil Spill Advisories": { duration_days: 3, frequency_hours: 3 },
    "High Wave Alert Services": { duration_days: 2, frequency_hours: 3 },
    "Search and Rescue Operations": { duration_days: 1, frequency_hours: 1 },  // Assumed
    "Inland Vessel Limits": { duration_days: 1, frequency_hours: 3 }
};

// Function to generate random weather data
function getWeatherData(serviceType) {
    const { duration_days, frequency_hours } = services[serviceType];
    const timeSteps = Math.floor((duration_days * 24) / frequency_hours);
    const gridSize = 10;

    // Generate random weather data for demonstration
    const weatherData = {
        wind_speed: generateRandomArray(gridSize, timeSteps),
        current_speed: generateRandomArray(gridSize, timeSteps),
        wave_height: generateRandomArray(gridSize, timeSteps)
    };
    return weatherData;
}

// Helper function to generate a random 2D array
function generateRandomArray(gridSize, timeSteps) {
    const array = [];
    for (let i = 0; i < gridSize; i++) {
        const row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(Math.random());
        }
        array.push(row);
    }
    return array;
}

// Function to calculate fuel consumption for a route
function calculateFuelConsumption(route, weatherData) {
    let fuelConsumption = 0.0;
    route.forEach(point => {
        const windSpeed = weatherData.wind_speed[point[0]][0];
        const currentSpeed = weatherData.current_speed[point[0]][0];
        const waveHeight = weatherData.wave_height[point[0]][0];
        fuelConsumption += windSpeed + currentSpeed + waveHeight;
    });
    return fuelConsumption;
}

// Function to initialize the population for the genetic algorithm
function initialPopulation(popSize, gridSize) {
    const population = [];
    for (let i = 0; i < popSize; i++) {
        const route = [];
        for (let j = 0; j < 10; j++) {
            route.push([Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]);
        }
        population.push(route);
    }
    return population;
}

// Function to calculate the fitness of a route
function fitness(route, weatherData) {
    const fuel = calculateFuelConsumption(route, weatherData);
    return 1.0 / (fuel + 1);
}

// Function to perform crossover between two routes
function crossover(route1, route2) {
    const point = Math.floor(Math.random() * (route1.length - 1)) + 1;
    return route1.slice(0, point).concat(route2.slice(point));
}

// Function to mutate a route
function mutate(route, gridSize) {
    const point = Math.floor(Math.random() * route.length);
    route[point] = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
}

// Genetic algorithm to find the optimal route
function geneticAlgorithm(gridSize, weatherData, generations = 100, popSize = 20) {
    let population = initialPopulation(popSize, gridSize);

    for (let generation = 0; generation < generations; generation++) {
        population.sort((a, b) => fitness(b, weatherData) - fitness(a, weatherData));
        const newPopulation = population.slice(0, 2); // Keep top 2
        for (let i = 0; i < popSize / 2 - 1; i++) {
            const parent1 = population[Math.floor(Math.random() * 10)];
            const parent2 = population[Math.floor(Math.random() * 10)];
            const child = crossover(parent1, parent2);
            if (Math.random() < 0.1) {
                mutate(child, gridSize);
            }
            newPopulation.push(child);
        }
        population = newPopulation;
    }

    return population[0];
}

// Event listener for the button click
document.getElementById("calculateButton").addEventListener("click", function() {
    const serviceType = document.getElementById("serviceType").value;
    const weatherData = getWeatherData(serviceType);
    const optimalRoute = geneticAlgorithm(10, weatherData);
    const output = "Optimal Route:\n" + optimalRoute.map(point => `(${point[0]}, ${point[1]})`).join("\n");
    document.getElementById("output").textContent = output;
});
