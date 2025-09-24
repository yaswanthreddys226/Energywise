/**
 * Energy Wise - Simulation Mode JavaScript
 * Provides functionality for the simulation mode interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize simulation
    initSimulation();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show welcome notification
    showNotification('Welcome to Simulation Mode', 'Adjust parameters to see how they affect energy consumption and costs.', 'info');
});

// Simulation state
const simulationState = {
    running: true,
    speed: 1440, // Default 1440x (1 min = 1 day)
    currentDate: new Date('2024-05-15T14:30:00'),
    household: {
        size: 4,
        type: 'medium-house',
        location: 'mumbai'
    },
    weather: {
        temperature: 28,
        condition: 'sunny',
        solarIntensity: 80
    },
    appliances: {
        'ac': {
            on: true,
            power: 1.5,
            mode: 'cool',
            temperature: 24,
            currentUsage: 0.98,
            dailyUsage: 7.8
        },
        'refrigerator': {
            on: true,
            power: 0.15,
            setting: 'normal',
            currentUsage: 0.12,
            dailyUsage: 2.4
        },
        'tv': {
            on: true,
            power: 0.1,
            mode: 'standard',
            currentUsage: 0.08,
            dailyUsage: 0.4
        },
        'washing-machine': {
            on: false,
            power: 0.5,
            cycle: 'normal',
            load: 'medium',
            currentUsage: 0,
            dailyUsage: 0.5
        },
        'lights': {
            on: true,
            power: 0.2,
            brightness: 80,
            currentUsage: 0.16,
            dailyUsage: 1.2
        },
        'fan': {
            on: true,
            power: 0.08,
            speed: 3,
            currentUsage: 0.06,
            dailyUsage: 0.8
        }
    },
    results: {
        totalConsumption: 1.4,
        dailyConsumption: 13.1,
        estimatedCost: 105.60,
        monthlyCost: 3168,
        solarGeneration: 0.8,
        dailySolarGeneration: 5.2,
        carbonFootprint: 6.3,
        monthlyCarbonFootprint: 189
    },
    timeInterval: null
};

// Initialize simulation
function initSimulation() {
    // Set initial values from DOM - check if elements exist before setting values
    const householdSizeEl = document.getElementById('household-size');
    if (householdSizeEl) householdSizeEl.value = simulationState.household.size;
    
    const homeTypeEl = document.getElementById('home-type');
    if (homeTypeEl) homeTypeEl.value = simulationState.household.type;
    
    const locationEl = document.getElementById('location');
    if (locationEl) locationEl.value = simulationState.household.location;
    
    const dateStr = simulationState.currentDate.toISOString().split('T')[0];
    const timeStr = simulationState.currentDate.toTimeString().slice(0, 5);
    
    const dateEl = document.getElementById('simulation-date');
    if (dateEl) dateEl.value = dateStr;
    
    const timeEl = document.getElementById('simulation-time');
    if (timeEl) timeEl.value = timeStr;
    
    const speedEl = document.getElementById('simulation-speed');
    if (speedEl) speedEl.value = simulationState.speed;
    
    const tempEl = document.getElementById('temperature');
    if (tempEl) tempEl.value = simulationState.weather.temperature;
    
    const tempValueEl = document.getElementById('temperature-value');
    if (tempValueEl) tempValueEl.textContent = simulationState.weather.temperature;
    
    const weatherConditionEl = document.getElementById('weather-condition');
    if (weatherConditionEl) weatherConditionEl.value = simulationState.weather.condition;
    const solarIntensityEl = document.getElementById('solar-intensity');
    if (solarIntensityEl) solarIntensityEl.value = simulationState.weather.solarIntensity;
    
    const solarIntensityValueEl = document.getElementById('solar-intensity-value');
    if (solarIntensityValueEl) solarIntensityValueEl.textContent = simulationState.weather.solarIntensity;
    
    // Update simulation time display
    updateTimeDisplay();
    
    // Start simulation timer
    startSimulationTimer();
}

// Initialize charts
function initCharts() {
    // Consumption chart
    const consumptionCtx = document.getElementById('consumption-chart').getContext('2d');
    window.consumptionChart = new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [
                {
                    label: 'Consumption (kW)',
                    data: generateRandomData(24, 0.8, 2.2),
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Solar Generation (kW)',
                    data: generateSolarData(24),
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Power (kW)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
    
    // Breakdown chart
    const breakdownCtx = document.getElementById('breakdown-chart').getContext('2d');
    window.breakdownChart = new Chart(breakdownCtx, {
        type: 'doughnut',
        data: {
            labels: ['AC', 'Refrigerator', 'TV', 'Washing Machine', 'Lights', 'Fan'],
            datasets: [{
                data: [7.8, 2.4, 0.4, 0.5, 1.2, 0.8],
                backgroundColor: [
                    '#2196f3',
                    '#4caf50',
                    '#ff9800',
                    '#9c27b0',
                    '#ffeb3b',
                    '#03a9f4'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Simulation controls
    document.getElementById('household-size').addEventListener('change', updateHouseholdProfile);
    document.getElementById('home-type').addEventListener('change', updateHouseholdProfile);
    document.getElementById('location').addEventListener('change', updateHouseholdProfile);
    
    document.getElementById('simulation-date').addEventListener('change', updateSimulationTime);
    document.getElementById('simulation-time').addEventListener('change', updateSimulationTime);
    document.getElementById('simulation-speed').addEventListener('change', updateSimulationSpeed);
    
    document.getElementById('temperature').addEventListener('input', updateWeather);
    document.getElementById('weather-condition').addEventListener('change', updateWeather);
    document.getElementById('solar-intensity').addEventListener('input', updateWeather);
    
    // Simulation control buttons
    document.getElementById('pause-simulation').addEventListener('click', pauseSimulation);
    document.getElementById('play-simulation').addEventListener('click', playSimulation);
    document.getElementById('reset-simulation').addEventListener('click', resetSimulation);
    
    // Appliance controls
    document.querySelectorAll('.appliance-toggle input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            toggleAppliance(applianceId, this.checked);
        });
    });
    
    // Temperature controls
    document.querySelectorAll('.temp-down').forEach(btn => {
        btn.addEventListener('click', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            const tempValue = applianceCard.querySelector('.temp-value');
            const currentTemp = parseInt(tempValue.textContent);
            if (currentTemp > 16) {
                tempValue.textContent = (currentTemp - 1) + '°C';
                updateApplianceSettings(applianceId, 'temperature', currentTemp - 1);
            }
        });
    });
    
    document.querySelectorAll('.temp-up').forEach(btn => {
        btn.addEventListener('click', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            const tempValue = applianceCard.querySelector('.temp-value');
            const currentTemp = parseInt(tempValue.textContent);
            if (currentTemp < 30) {
                tempValue.textContent = (currentTemp + 1) + '°C';
                updateApplianceSettings(applianceId, 'temperature', currentTemp + 1);
            }
        });
    });
    
    // Speed controls
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            const speed = parseInt(this.dataset.speed);
            
            applianceCard.querySelectorAll('.speed-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            updateApplianceSettings(applianceId, 'speed', speed);
        });
    });
    
    // Mode selectors
    document.querySelectorAll('.appliance-mode').forEach(select => {
        select.addEventListener('change', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            updateApplianceSettings(applianceId, 'mode', this.value);
        });
    });
    
    // Brightness controls
    document.querySelectorAll('.brightness-control').forEach(control => {
        control.addEventListener('input', function() {
            const applianceCard = this.closest('.appliance-card');
            const applianceId = applianceCard.dataset.appliance;
            updateApplianceSettings(applianceId, 'brightness', parseInt(this.value));
        });
    });
    
    // Chart period controls
    document.querySelectorAll('.chart-period').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-period').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            updateChartPeriod(this.dataset.period);
        });
    });
    
    // Breakdown type controls
    document.querySelectorAll('.breakdown-type').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.breakdown-type').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            updateBreakdownType(this.dataset.type);
        });
    });
    
    // Add appliance button
    document.getElementById('add-appliance').addEventListener('click', showAddApplianceModal);
    document.getElementById('cancel-add-appliance').addEventListener('click', hideAddApplianceModal);
    document.getElementById('confirm-add-appliance').addEventListener('click', addNewAppliance);
    
    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', hideAddApplianceModal);
    
    // Preset buttons
    document.getElementById('preset-typical').addEventListener('click', applyTypicalDayPreset);
    document.getElementById('preset-energy-saving').addEventListener('click', applyEnergySavingPreset);
    
    // Apply recommendation buttons
    document.querySelectorAll('.apply-recommendation').forEach(btn => {
        btn.addEventListener('click', function() {
            const applianceId = this.dataset.appliance;
            const action = this.dataset.action;
            applyRecommendation(applianceId, action);
        });
    });
    
    // Export results button
    document.getElementById('export-results').addEventListener('click', exportSimulationResults);
}

// Update household profile
function updateHouseholdProfile() {
    simulationState.household.size = parseInt(document.getElementById('household-size').value);
    simulationState.household.type = document.getElementById('home-type').value;
    simulationState.household.location = document.getElementById('location').value;
    
    // Update consumption based on household profile
    recalculateConsumption();
    
    showNotification('Household Profile Updated', 'Simulation adjusted based on new household parameters.', 'info');
}

// Update simulation time
function updateSimulationTime() {
    const dateStr = document.getElementById('simulation-date').value;
    const timeStr = document.getElementById('simulation-time').value;
    
    simulationState.currentDate = new Date(`${dateStr}T${timeStr}:00`);
    updateTimeDisplay();
    
    // Update solar generation based on time of day
    updateSolarGeneration();
}

// Update simulation speed
function updateSimulationSpeed() {
    simulationState.speed = parseInt(document.getElementById('simulation-speed').value);
    
    // Restart timer with new speed
    if (simulationState.running) {
        clearInterval(simulationState.timeInterval);
        startSimulationTimer();
    }
    
    showNotification('Simulation Speed Updated', `Speed set to ${simulationState.speed}x`, 'info');
}

// Update weather conditions
function updateWeather() {
    simulationState.weather.temperature = parseInt(document.getElementById('temperature').value);
    document.getElementById('temperature-value').textContent = simulationState.weather.temperature;
    
    simulationState.weather.condition = document.getElementById('weather-condition').value;
    
    simulationState.weather.solarIntensity = parseInt(document.getElementById('solar-intensity').value);
    document.getElementById('solar-intensity-value').textContent = simulationState.weather.solarIntensity;
    
    // Update consumption based on weather
    recalculateConsumption();
    
    // Update solar generation
    updateSolarGeneration();
}

// Toggle appliance on/off
function toggleAppliance(applianceId, isOn) {
    simulationState.appliances[applianceId].on = isOn;
    
    // Update current usage
    if (isOn) {
        // Calculate current usage based on settings
        simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
    } else {
        simulationState.appliances[applianceId].currentUsage = 0;
    }
    
    // Update UI
    const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
    const usageStats = applianceCard.querySelector('.usage-stats');
    usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
    
    const usageFill = applianceCard.querySelector('.usage-fill');
    const percentage = isOn ? (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100 : 0;
    usageFill.style.width = `${percentage}%`;
    
    // Recalculate total consumption
    recalculateConsumption();
    
    if (isOn) {
        showNotification(`${getApplianceName(applianceId)} Turned On`, `Current power: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`, 'success');
    } else {
        showNotification(`${getApplianceName(applianceId)} Turned Off`, 'Power consumption reduced', 'info');
    }
}

// Update appliance settings
function updateApplianceSettings(applianceId, setting, value) {
    simulationState.appliances[applianceId][setting] = value;
    
    // Recalculate current usage if appliance is on
    if (simulationState.appliances[applianceId].on) {
        simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
        
        // Update UI
        const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
        const usageStats = applianceCard.querySelector('.usage-stats');
        usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
        
        const usageFill = applianceCard.querySelector('.usage-fill');
        const percentage = (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100;
        usageFill.style.width = `${percentage}%`;
        
        // Recalculate total consumption
        recalculateConsumption();
    }
}

// Calculate appliance usage based on settings
function calculateApplianceUsage(applianceId) {
    const appliance = simulationState.appliances[applianceId];
    let usage = appliance.power;
    
    switch (applianceId) {
        case 'ac':
            // AC uses more power at lower temperatures and higher ambient temperatures
            const tempDiff = simulationState.weather.temperature - appliance.temperature;
            const tempFactor = 0.8 + (tempDiff * 0.02);
            
            // Different modes use different amounts of power
            const modeFactor = appliance.mode === 'fan' ? 0.5 : 
                              appliance.mode === 'dry' ? 0.7 : 
                              appliance.mode === 'auto' ? 0.9 : 1.0;
            
            usage = appliance.power * tempFactor * modeFactor;
            break;
            
        case 'refrigerator':
            // Refrigerator uses more power at higher ambient temperatures
            const tempFactorRefrig = 0.7 + (simulationState.weather.temperature * 0.01);
            
            // Different settings use different amounts of power
            const settingFactor = appliance.setting === 'eco' ? 0.8 : 
                                 appliance.setting === 'max' ? 1.2 : 1.0;
            
            usage = appliance.power * tempFactorRefrig * settingFactor;
            break;
            
        case 'tv':
            // Different modes use different amounts of power
            const tvModeFactor = appliance.mode === 'eco' ? 0.8 : 
                               appliance.mode === 'cinema' ? 1.2 : 1.0;
            
            usage = appliance.power * tvModeFactor;
            break;
            
        case 'washing-machine':
            // Different cycles use different amounts of power
            const cycleFactor = appliance.cycle === 'eco' ? 0.7 : 
                              appliance.cycle === 'heavy' ? 1.3 : 1.0;
            
            // Different loads use different amounts of power
            const loadFactor = appliance.load === 'small' ? 0.8 : 
                             appliance.load === 'full' ? 1.2 : 1.0;
            
            usage = appliance.power * cycleFactor * loadFactor;
            break;
            
        case 'lights':
            // Brightness affects power usage
            const brightnessFactor = appliance.brightness / 100;
            usage = appliance.power * brightnessFactor;
            break;
            
        case 'fan':
            // Speed affects power usage
            const speedFactor = appliance.speed / 5;
            usage = appliance.power * speedFactor;
            break;
    }
    
    return Math.max(0, Math.min(usage, appliance.power * 1.5)); // Cap at 150% of rated power
}

// Recalculate total consumption
function recalculateConsumption() {
    let totalConsumption = 0;
    let dailyConsumption = 0;
    
    // Sum up current usage of all appliances
    for (const applianceId in simulationState.appliances) {
        totalConsumption += simulationState.appliances[applianceId].currentUsage;
        dailyConsumption += simulationState.appliances[applianceId].dailyUsage;
    }
    
    // Apply household factors
    const householdSizeFactor = 0.8 + (simulationState.household.size * 0.05);
    const householdTypeFactor = 
        simulationState.household.type === 'apartment' ? 0.8 :
        simulationState.household.type === 'small-house' ? 0.9 :
        simulationState.household.type === 'large-house' ? 1.2 :
        simulationState.household.type === 'villa' ? 1.4 : 1.0;
    
    totalConsumption *= householdSizeFactor * householdTypeFactor;
    dailyConsumption *= householdSizeFactor * householdTypeFactor;
    
    // Apply weather factors
    const tempFactor = 0.8 + (simulationState.weather.temperature * 0.01);
    totalConsumption *= tempFactor;
    dailyConsumption *= tempFactor;
    
    // Update simulation state
    simulationState.results.totalConsumption = totalConsumption;
    simulationState.results.dailyConsumption = dailyConsumption;
    
    // Calculate costs (assuming ₹8 per kWh)
    simulationState.results.estimatedCost = dailyConsumption * 8;
    simulationState.results.monthlyCost = simulationState.results.estimatedCost * 30;
    
    // Calculate carbon footprint (assuming 0.82 kg CO2 per kWh for India)
    simulationState.results.carbonFootprint = dailyConsumption * 0.82;
    simulationState.results.monthlyCarbonFootprint = simulationState.results.carbonFootprint * 30;
    
    // Update UI
    document.querySelector('.total-consumption .result-value').textContent = `${totalConsumption.toFixed(1)} kW`;
    document.querySelector('.total-consumption .result-subtext').textContent = `${dailyConsumption.toFixed(1)} kWh today`;
    
    document.querySelector('.estimated-cost .result-value').textContent = `₹${simulationState.results.estimatedCost.toFixed(2)}`;
    document.querySelector('.estimated-cost .result-subtext').textContent = `₹${Math.round(simulationState.results.monthlyCost)} monthly`;
    
    document.querySelector('.carbon-footprint .result-value').textContent = `${simulationState.results.carbonFootprint.toFixed(1)} kg CO₂`;
    document.querySelector('.carbon-footprint .result-subtext').textContent = `${Math.round(simulationState.results.monthlyCarbonFootprint)} kg monthly`;
    
    // Update charts
    updateCharts();
}

// Update solar generation
function updateSolarGeneration() {
    const hour = simulationState.currentDate.getHours();
    const solarIntensity = simulationState.weather.solarIntensity / 100;
    
    // Solar generation depends on time of day, weather condition, and solar intensity
    let timeOfDayFactor = 0;
    if (hour >= 6 && hour <= 18) {
        // Bell curve peaking at noon
        timeOfDayFactor = 1 - Math.abs((hour - 12) / 6);
    }
    
    const weatherFactor = 
        simulationState.weather.condition === 'sunny' ? 1.0 :
        simulationState.weather.condition === 'cloudy' ? 0.6 :
        simulationState.weather.condition === 'rainy' ? 0.3 :
        simulationState.weather.condition === 'stormy' ? 0.1 : 0.5;
    
    // Assume 2 kW solar system
    const maxSolarOutput = 2.0;
    const currentSolarOutput = maxSolarOutput * timeOfDayFactor * weatherFactor * solarIntensity;
    
    // Daily generation (assuming 5 hours of equivalent peak sun)
    const dailySolarGeneration = maxSolarOutput * 5 * weatherFactor * solarIntensity;
    
    // Update simulation state
    simulationState.results.solarGeneration = currentSolarOutput;
    simulationState.results.dailySolarGeneration = dailySolarGeneration;
    
    // Update UI
    document.querySelector('.solar-generation .result-value').textContent = `${currentSolarOutput.toFixed(1)} kW`;
    document.querySelector('.solar-generation .result-subtext').textContent = `${dailySolarGeneration.toFixed(1)} kWh today`;
    
    // Update charts
    updateCharts();
}

// Update charts
function updateCharts() {
    // Update consumption chart with new data
    const consumptionData = generateRandomData(24, 0.8, 2.2, simulationState.results.totalConsumption);
    window.consumptionChart.data.datasets[0].data = consumptionData;
    
    // Update solar generation data
    const solarData = generateSolarData(24, simulationState.results.solarGeneration);
    window.consumptionChart.data.datasets[1].data = solarData;
    
    window.consumptionChart.update();
    
    // Update breakdown chart
    const applianceData = [];
    const applianceLabels = [];
    
    for (const applianceId in simulationState.appliances) {
        applianceLabels.push(getApplianceName(applianceId));
        applianceData.push(simulationState.appliances[applianceId].dailyUsage);
    }
    
    window.breakdownChart.data.labels = applianceLabels;
    window.breakdownChart.data.datasets[0].data = applianceData;
    window.breakdownChart.update();
}

// Update chart period
function updateChartPeriod(period) {
    let labels = [];
    let consumptionData = [];
    let solarData = [];
    
    switch (period) {
        case 'day':
            labels = generateTimeLabels(24);
            consumptionData = generateRandomData(24, 0.8, 2.2, simulationState.results.totalConsumption);
            solarData = generateSolarData(24, simulationState.results.solarGeneration);
            break;
            
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            consumptionData = generateRandomData(7, 10, 15, simulationState.results.dailyConsumption);
            solarData = generateRandomData(7, 4, 6, simulationState.results.dailySolarGeneration);
            break;
            
        case 'month':
            labels = Array.from({length: 30}, (_, i) => i + 1);
            consumptionData = generateRandomData(30, 10, 15, simulationState.results.dailyConsumption);
            solarData = generateRandomData(30, 4, 6, simulationState.results.dailySolarGeneration);
            break;
    }
    
    window.consumptionChart.data.labels = labels;
    window.consumptionChart.data.datasets[0].data = consumptionData;
    window.consumptionChart.data.datasets[1].data = solarData;
    window.consumptionChart.update();
}

// Update breakdown type
function updateBreakdownType(type) {
    let labels = [];
    let data = [];
    
    switch (type) {
        case 'appliance':
            // Appliance breakdown
            for (const applianceId in simulationState.appliances) {
                labels.push(getApplianceName(applianceId));
                data.push(simulationState.appliances[applianceId].dailyUsage);
            }
            break;
            
        case 'room':
            // Room breakdown (simulated)
            labels = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Home Office'];
            data = [5.2, 3.8, 2.5, 0.8, 0.8];
            break;
            
        case 'time':
            // Time breakdown (simulated)
            labels = ['Morning', 'Afternoon', 'Evening', 'Night'];
            data = [2.8, 3.5, 4.2, 2.6];
            break;
    }
    
    window.breakdownChart.data.labels = labels;
    window.breakdownChart.data.datasets[0].data = data;
    window.breakdownChart.update();
}

// Show add appliance modal
function showAddApplianceModal() {
    const modal = document.getElementById('add-appliance-modal');
    modal.classList.add('active');
}

// Hide add appliance modal
function hideAddApplianceModal() {
    const modal = document.getElementById('add-appliance-modal');
    modal.classList.remove('active');
    
    // Reset form
    document.getElementById('appliance-type').value = '';
    document.getElementById('appliance-name').value = '';
    document.getElementById('appliance-power').value = '';
    document.getElementById('appliance-room').value = 'living-room';
    document.getElementById('appliance-usage').value = 'daytime';
}

// Add new appliance
function addNewAppliance() {
    const type = document.getElementById('appliance-type').value;
    const name = document.getElementById('appliance-name').value;
    const power = parseFloat(document.getElementById('appliance-power').value);
    const room = document.getElementById('appliance-room').value;
    const usage = document.getElementById('appliance-usage').value;
    
    if (!type || !name || !power) {
        showNotification('Missing Information', 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Create unique ID
    const id = `${type}-${Date.now()}`;
    
    // Add to simulation state
    simulationState.appliances[id] = {
        on: true,
        power: power,
        currentUsage: power * 0.8, // Assume 80% of rated power
        dailyUsage: calculateDailyUsage(power, usage)
    };
    
    // Create appliance card
    const applianceGrid = document.querySelector('.appliance-grid');
    const applianceCard = document.createElement('div');
    applianceCard.className = 'appliance-card';
    applianceCard.dataset.appliance = id;
    
    applianceCard.innerHTML = `
        <div class="appliance-header">
            <div class="appliance-icon">
                <i class="fas fa-${getApplianceIcon(type)}"></i>
            </div>
            <div class="appliance-toggle">
                <label class="switch">
                    <input type="checkbox" checked>
                    <span class="slider round"></span>
                </label>
            </div>
        </div>
        <div class="appliance-content">
            <h4>${name}</h4>
            <div class="appliance-details">
                <div class="detail-item">
                    <span class="detail-label">Power:</span>
                    <span class="detail-value">${power} kW</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Room:</span>
                    <span class="detail-value">${getRoomName(room)}</span>
                </div>
            </div>
            <div class="appliance-usage">
                <div class="usage-bar">
                    <div class="usage-fill" style="width: 80%;"></div>
                </div>
                <div class="usage-stats">
                    <span>Current: ${(power * 0.8).toFixed(2)} kW</span>
                    <span>Daily: ${simulationState.appliances[id].dailyUsage.toFixed(1)} kWh</span>
                </div>
            </div>
        </div>
    `;
    
    applianceGrid.appendChild(applianceCard);
    
    // Add event listener for toggle
    const toggle = applianceCard.querySelector('.appliance-toggle input');
    toggle.addEventListener('change', function() {
        toggleAppliance(id, this.checked);
    });
    
    // Recalculate consumption
    recalculateConsumption();
    
    // Hide modal
    hideAddApplianceModal();
    
    showNotification('Appliance Added', `${name} has been added to the simulation.`, 'success');
}

// Calculate daily usage based on usage pattern
function calculateDailyUsage(power, usagePattern) {
    switch (usagePattern) {
        case 'continuous':
            return power * 24 * 0.7; // 70% duty cycle over 24 hours
        case 'daytime':
            return power * 12 * 0.8; // 80% duty cycle over 12 hours
        case 'evening':
            return power * 6 * 0.9; // 90% duty cycle over 6 hours
        case 'occasional':
            return power * 3 * 1.0; // 100% duty cycle over 3 hours
        default:
            return power * 8; // Default: 8 hours of usage
    }
}

// Apply typical day preset
function applyTypicalDayPreset() {
    // Turn on common appliances
    for (const applianceId in simulationState.appliances) {
        const shouldBeOn = ['ac', 'refrigerator', 'tv', 'lights', 'fan'].includes(applianceId);
        
        // Update simulation state
        simulationState.appliances[applianceId].on = shouldBeOn;
        
        // Update UI
        const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
        const toggle = applianceCard.querySelector('.appliance-toggle input');
        toggle.checked = shouldBeOn;
        
        // Update usage display
        if (shouldBeOn) {
            simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
        } else {
            simulationState.appliances[applianceId].currentUsage = 0;
        }
        
        const usageStats = applianceCard.querySelector('.usage-stats');
        usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
        
        const usageFill = applianceCard.querySelector('.usage-fill');
        const percentage = shouldBeOn ? (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100 : 0;
        usageFill.style.width = `${percentage}%`;
    }
    
    // Set AC to normal settings
    if (simulationState.appliances['ac']) {
        const acCard = document.querySelector('.appliance-card[data-appliance="ac"]');
        const tempValue = acCard.querySelector('.temp-value');
        tempValue.textContent = '24°C';
        
        const modeSelect = acCard.querySelector('.appliance-mode');
        if (modeSelect) modeSelect.value = 'cool';
        
        simulationState.appliances['ac'].temperature = 24;
        simulationState.appliances['ac'].mode = 'cool';
        simulationState.appliances['ac'].currentUsage = calculateApplianceUsage('ac');
    }
    
    // Recalculate consumption
    recalculateConsumption();
    
    showNotification('Typical Day Preset Applied', 'Appliances set to typical usage pattern.', 'info');
}

// Apply energy saving preset
function applyEnergySavingPreset() {
    // Turn off non-essential appliances
    for (const applianceId in simulationState.appliances) {
        const shouldBeOn = ['refrigerator'].includes(applianceId);
        
        // Update simulation state
        simulationState.appliances[applianceId].on = shouldBeOn;
        
        // Update UI
        const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
        const toggle = applianceCard.querySelector('.appliance-toggle input');
        toggle.checked = shouldBeOn;
        
        // Update usage display
        if (shouldBeOn) {
            simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
        } else {
            simulationState.appliances[applianceId].currentUsage = 0;
        }
        
        const usageStats = applianceCard.querySelector('.usage-stats');
        usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
        
        const usageFill = applianceCard.querySelector('.usage-fill');
        const percentage = shouldBeOn ? (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100 : 0;
        usageFill.style.width = `${percentage}%`;
    }
    
    // Set refrigerator to eco mode
    if (simulationState.appliances['refrigerator']) {
        const refrigCard = document.querySelector('.appliance-card[data-appliance="refrigerator"]');
        const modeSelect = refrigCard.querySelector('.appliance-mode');
        if (modeSelect) modeSelect.value = 'eco';
        
        simulationState.appliances['refrigerator'].setting = 'eco';
        simulationState.appliances['refrigerator'].currentUsage = calculateApplianceUsage('refrigerator');
    }
    
    // Recalculate consumption
    recalculateConsumption();
    
    showNotification('Energy Saving Preset Applied', 'Appliances set to minimal energy usage.', 'success');
}

// Apply recommendation
function applyRecommendation(applianceId, action) {
    switch (action) {
        case 'increase-temp':
            if (simulationState.appliances[applianceId]) {
                // Increase AC temperature to 26°C
                simulationState.appliances[applianceId].temperature = 26;
                
                // Update UI
                const acCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
                const tempValue = acCard.querySelector('.temp-value');
                tempValue.textContent = '26°C';
                
                // Recalculate usage
                simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
                
                const usageStats = acCard.querySelector('.usage-stats');
                usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
                
                const usageFill = acCard.querySelector('.usage-fill');
                const percentage = (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100;
                usageFill.style.width = `${percentage}%`;
            }
            break;
            
        case 'reduce-brightness':
            if (simulationState.appliances[applianceId]) {
                // Reduce brightness to 60%
                simulationState.appliances[applianceId].brightness = 60;
                
                // Update UI
                const lightsCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
                const brightnessControl = lightsCard.querySelector('.brightness-control');
                brightnessControl.value = 60;
                
                // Recalculate usage
                simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
                
                const usageStats = lightsCard.querySelector('.usage-stats');
                usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
                
                const usageFill = lightsCard.querySelector('.usage-fill');
                const percentage = (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100;
                usageFill.style.width = `${percentage}%`;
            }
            break;
            
        case 'eco-mode':
            if (simulationState.appliances[applianceId]) {
                // Set to eco mode
                simulationState.appliances[applianceId].cycle = 'eco';
                
                // Update UI
                const washingCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
                const modeSelect = washingCard.querySelector('.appliance-mode');
                if (modeSelect) modeSelect.value = 'eco';
                
                // Turn on the appliance if it's off
                if (!simulationState.appliances[applianceId].on) {
                    simulationState.appliances[applianceId].on = true;
                    const toggle = washingCard.querySelector('.appliance-toggle input');
                    toggle.checked = true;
                }
                
                // Recalculate usage
                simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
                
                const usageStats = washingCard.querySelector('.usage-stats');
                usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
                
                const usageFill = washingCard.querySelector('.usage-fill');
                const percentage = (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100;
                usageFill.style.width = `${percentage}%`;
            }
            break;
    }
    
    // Recalculate total consumption
    recalculateConsumption();
    
    showNotification('Recommendation Applied', 'Energy saving recommendation has been applied.', 'success');
}

// Export simulation results
function exportSimulationResults() {
    // Create data object
    const data = {
        timestamp: new Date().toISOString(),
        simulationDate: simulationState.currentDate.toISOString(),
        household: simulationState.household,
        weather: simulationState.weather,
        appliances: simulationState.appliances,
        results: simulationState.results
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(data, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-wise-simulation-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Export Complete', 'Simulation results have been exported.', 'success');
}

// Pause simulation
function pauseSimulation() {
    if (simulationState.running) {
        simulationState.running = false;
        clearInterval(simulationState.timeInterval);
        
        // Update UI
        const statusIndicator = document.querySelector('.status-indicator');
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('paused');
        
        document.querySelector('.status-text').textContent = 'Simulation Paused';
        
        showNotification('Simulation Paused', 'Time progression has been paused.', 'info');
    }
}

// Play simulation
function playSimulation() {
    if (!simulationState.running) {
        simulationState.running = true;
        startSimulationTimer();
        
        // Update UI
        const statusIndicator = document.querySelector('.status-indicator');
        statusIndicator.classList.remove('paused');
        statusIndicator.classList.add('active');
        
        document.querySelector('.status-text').textContent = 'Simulation Active';
        
        showNotification('Simulation Resumed', 'Time progression has been resumed.', 'success');
    }
}

// Reset simulation
function resetSimulation() {
    // Pause simulation
    pauseSimulation();
    
    // Reset date and time
    simulationState.currentDate = new Date('2024-05-15T14:30:00');
    document.getElementById('simulation-date').value = '2024-05-15';
    document.getElementById('simulation-time').value = '14:30';
    
    // Reset household profile
    simulationState.household.size = 4;
    simulationState.household.type = 'medium-house';
    simulationState.household.location = 'mumbai';
    
    document.getElementById('household-size').value = '4';
    document.getElementById('home-type').value = 'medium-house';
    document.getElementById('location').value = 'mumbai';
    
    // Reset weather
    simulationState.weather.temperature = 28;
    simulationState.weather.condition = 'sunny';
    simulationState.weather.solarIntensity = 80;
    
    document.getElementById('temperature').value = '28';
    document.getElementById('temperature-value').textContent = '28';
    document.getElementById('weather-condition').value = 'sunny';
    document.getElementById('solar-intensity').value = '80';
    document.getElementById('solar-intensity-value').textContent = '80';
    
    // Reset appliances to default state
    for (const applianceId in simulationState.appliances) {
        // Default values
        const defaultValues = {
            'ac': { on: true, mode: 'cool', temperature: 24 },
            'refrigerator': { on: true, setting: 'normal' },
            'tv': { on: true, mode: 'standard' },
            'washing-machine': { on: false, cycle: 'normal', load: 'medium' },
            'lights': { on: true, brightness: 80 },
            'fan': { on: true, speed: 3 }
        };
        
        // If it's one of our default appliances
        if (defaultValues[applianceId]) {
            // Update simulation state
            for (const key in defaultValues[applianceId]) {
                simulationState.appliances[applianceId][key] = defaultValues[applianceId][key];
            }
            
            // Update UI
            const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
            if (applianceCard) {
                // Update toggle
                const toggle = applianceCard.querySelector('.appliance-toggle input');
                toggle.checked = defaultValues[applianceId].on;
                
                // Update mode if applicable
                const modeSelect = applianceCard.querySelector('.appliance-mode');
                if (modeSelect && defaultValues[applianceId].mode) {
                    modeSelect.value = defaultValues[applianceId].mode;
                }
                
                // Update temperature if applicable
                if (defaultValues[applianceId].temperature) {
                    const tempValue = applianceCard.querySelector('.temp-value');
                    if (tempValue) {
                        tempValue.textContent = `${defaultValues[applianceId].temperature}°C`;
                    }
                }
                
                // Update speed if applicable
                if (defaultValues[applianceId].speed) {
                    const speedBtns = applianceCard.querySelectorAll('.speed-btn');
                    speedBtns.forEach(btn => {
                        btn.classList.remove('active');
                        if (parseInt(btn.dataset.speed) === defaultValues[applianceId].speed) {
                            btn.classList.add('active');
                        }
                    });
                }
                
                // Update brightness if applicable
                if (defaultValues[applianceId].brightness) {
                    const brightnessControl = applianceCard.querySelector('.brightness-control');
                    if (brightnessControl) {
                        brightnessControl.value = defaultValues[applianceId].brightness;
                    }
                }
            }
        } else {
            // For custom appliances, just turn them off
            simulationState.appliances[applianceId].on = false;
            
            const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
            if (applianceCard) {
                const toggle = applianceCard.querySelector('.appliance-toggle input');
                toggle.checked = false;
            }
        }
        
        // Recalculate usage
        if (simulationState.appliances[applianceId].on) {
            simulationState.appliances[applianceId].currentUsage = calculateApplianceUsage(applianceId);
        } else {
            simulationState.appliances[applianceId].currentUsage = 0;
        }
        
        // Update UI for usage
        const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
        if (applianceCard) {
            const usageStats = applianceCard.querySelector('.usage-stats');
            usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
            
            const usageFill = applianceCard.querySelector('.usage-fill');
            const percentage = simulationState.appliances[applianceId].on ? 
                (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100 : 0;
            usageFill.style.width = `${percentage}%`;
        }
    }
    
    // Recalculate consumption
    recalculateConsumption();
    
    // Update time display
    updateTimeDisplay();
    
    showNotification('Simulation Reset', 'All settings have been reset to default values.', 'info');
}

// Start simulation timer
function startSimulationTimer() {
    // Clear existing interval if any
    if (simulationState.timeInterval) {
        clearInterval(simulationState.timeInterval);
    }
    
    // Set new interval
    simulationState.timeInterval = setInterval(() => {
        // Advance time based on simulation speed
        const msToAdd = 60000 * simulationState.speed; // Convert speed to milliseconds
        simulationState.currentDate = new Date(simulationState.currentDate.getTime() + msToAdd);
        
        // Update time display
        updateTimeDisplay();
        
        // Update solar generation based on new time
        updateSolarGeneration();
        
        // Randomly adjust appliance usage for realism
        randomlyAdjustApplianceUsage();
        
    }, 1000); // Update every second
}

// Update time display
function updateTimeDisplay() {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const timeStr = simulationState.currentDate.toLocaleDateString('en-IN', options);
    document.getElementById('simulation-current-time').textContent = timeStr;
    
    // Update date and time inputs
    const dateStr = simulationState.currentDate.toISOString().split('T')[0];
    const timeOnlyStr = simulationState.currentDate.toTimeString().slice(0, 5);
    
    document.getElementById('simulation-date').value = dateStr;
    document.getElementById('simulation-time').value = timeOnlyStr;
}

// Randomly adjust appliance usage for realism
function randomlyAdjustApplianceUsage() {
    for (const applianceId in simulationState.appliances) {
        if (simulationState.appliances[applianceId].on) {
            // Add small random fluctuation (±5%)
            const currentUsage = simulationState.appliances[applianceId].currentUsage;
            const fluctuation = currentUsage * (Math.random() * 0.1 - 0.05);
            simulationState.appliances[applianceId].currentUsage = Math.max(0, currentUsage + fluctuation);
            
            // Update UI
            const applianceCard = document.querySelector(`.appliance-card[data-appliance="${applianceId}"]`);
            if (applianceCard) {
                const usageStats = applianceCard.querySelector('.usage-stats');
                usageStats.querySelector('span:first-child').textContent = `Current: ${simulationState.appliances[applianceId].currentUsage.toFixed(2)} kW`;
                
                const usageFill = applianceCard.querySelector('.usage-fill');
                const percentage = (simulationState.appliances[applianceId].currentUsage / simulationState.appliances[applianceId].power) * 100;
                usageFill.style.width = `${percentage}%`;
            }
        }
    }
    
    // Recalculate total consumption
    recalculateConsumption();
}

// Generate time labels for chart
function generateTimeLabels(count) {
    const labels = [];
    for (let i = 0; i < count; i++) {
        labels.push(`${i}:00`);
    }
    return labels;
}

// Generate random data for chart
function generateRandomData(count, min, max, average = null) {
    const data = [];
    
    // If average is provided, generate data that averages to that value
    if (average !== null) {
        let sum = 0;
        for (let i = 0; i < count - 1; i++) {
            const value = min + Math.random() * (max - min);
            data.push(value);
            sum += value;
        }
        
        // Calculate the last value to make the average match
        const lastValue = (average * count) - sum;
        data.push(Math.max(min, Math.min(max, lastValue)));
    } else {
        // Otherwise just generate random data
        for (let i = 0; i < count; i++) {
            data.push(min + Math.random() * (max - min));
        }
    }
    
    return data;
}

// Generate solar data based on time of day
function generateSolarData(count, peakValue = 2.0) {
    const data = [];
    
    for (let i = 0; i < count; i++) {
        if (i >= 6 && i <= 18) {
            // Bell curve peaking at noon
            const hourFactor = 1 - Math.abs((i - 12) / 6);
            data.push(peakValue * hourFactor);
        } else {
            // No solar at night
            data.push(0);
        }
    }
    
    return data;
}

// Show notification
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Add close event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (container.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Helper functions
function getApplianceName(applianceId) {
    const names = {
        'ac': 'Air Conditioner',
        'refrigerator': 'Refrigerator',
        'tv': 'Television',
        'washing-machine': 'Washing Machine',
        'lights': 'Lights',
        'fan': 'Ceiling Fan'
    };
    
    return names[applianceId] || applianceId;
}

function getApplianceIcon(type) {
    const icons = {
        'ac': 'snowflake',
        'refrigerator': 'refrigerator',
        'tv': 'tv',
        'washing-machine': 'washing-machine',
        'lights': 'lightbulb',
        'fan': 'fan',
        'water-heater': 'hot-tub',
        'microwave': 'microwave',
        'computer': 'desktop',
        'other': 'plug'
    };
    
    return icons[type] || 'plug';
}

function getRoomName(roomId) {
    const names = {
        'living-room': 'Living Room',
        'bedroom': 'Bedroom',
        'kitchen': 'Kitchen',
        'bathroom': 'Bathroom',
        'office': 'Home Office',
        'other': 'Other'
    };
    
    return names[roomId] || roomId;
}