// Dashboard JavaScript file for Energy Wise

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCharts();
    
    // Initialize additional charts for new sections
    initializeReportChart();
    initializeSolarChart();
    
    // Handle sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Check if this is a direct page link (bills, mcb-mapping, community)
            const link = this.querySelector('a');
            if (link.getAttribute('href') !== 'javascript:void(0)') {
                // Let the browser handle the navigation to another page
                return;
            }
            
            e.preventDefault();
            
            // Get the target section id from data-tab attribute
            const targetId = this.getAttribute('data-tab');
            
            // Hide all sections
            document.querySelectorAll('.dashboard-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error(`Section with ID "${targetId}" not found`);
            }
            
            // Update active link
            document.querySelectorAll('.sidebar-nav li').forEach(item => {
                item.classList.remove('active');
            });
            
            this.classList.add('active');
        });
    });
    
    // Set the first tab as active by default
    const firstTab = document.querySelector('.sidebar-nav li');
    if (firstTab) {
        firstTab.click();
    }
    
    // Handle time period change
    const timePeriodSelect = document.getElementById('time-period');
    
    if (timePeriodSelect) {
        timePeriodSelect.addEventListener('change', function() {
            updateCharts(this.value);
        });
    }
    
    // Handle chart type toggle
    const chartControls = document.querySelectorAll('.chart-controls button');
    
    chartControls.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            chartControls.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart based on selected type
            const chartType = this.getAttribute('data-chart');
            updateChartType(chartType);
        });
    });
    
    // Add event listeners for interactive elements in new sections
    setupRoomControls();
    setupApplianceControls();
    setupNotificationControls();
    
    // Simulate real-time data updates
    setInterval(updateRealTimeData, 5000);
});

// Initialize report chart
function initializeReportChart() {
    const reportChartCanvas = document.getElementById('report-chart-canvas');
    if (!reportChartCanvas) return;
    
    const ctx = reportChartCanvas.getContext('2d');
    const reportChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [320, 280, 300, 250, 260, 324],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy (kWh)'
                    }
                }
            }
        }
    });
    
    // Handle report type change
    const reportTypeSelect = document.getElementById('report-type');
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', function() {
            const reportType = this.value;
            let newData;
            let label;
            
            switch(reportType) {
                case 'usage':
                    newData = [320, 280, 300, 250, 260, 324];
                    label = 'Energy Usage (kWh)';
                    break;
                case 'cost':
                    newData = [2560, 2240, 2400, 2000, 2080, 2592];
                    label = 'Energy Cost (₹)';
                    break;
                case 'comparison':
                    newData = [320, 280, 300, 250, 260, 324];
                    const prevYearData = [350, 310, 330, 290, 300, 360];
                    reportChart.data.datasets = [
                        {
                            label: 'This Year (kWh)',
                            data: newData,
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Last Year (kWh)',
                            data: prevYearData,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }
                    ];
                    reportChart.update();
                    return;
            }
            
            reportChart.data.datasets = [{
                label: label,
                data: newData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }];
            
            reportChart.update();
        });
    }
}

// Initialize solar chart
function initializeSolarChart() {
    const solarChartCanvas = document.getElementById('solar-chart-canvas');
    if (!solarChartCanvas) return;
    
    const ctx = solarChartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
            datasets: [
                {
                    label: 'Generation (kWh)',
                    data: [0.5, 1.8, 2.5, 3.2, 2.8, 1.5, 0.2],
                    backgroundColor: '#FFC107',
                    borderColor: '#FFC107',
                    borderWidth: 1
                },
                {
                    label: 'Consumption (kWh)',
                    data: [0.8, 1.2, 1.5, 2.0, 2.2, 2.5, 3.0],
                    backgroundColor: '#2196F3',
                    borderColor: '#2196F3',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Energy (kWh)'
                    }
                }
            }
        }
    });
}

// Setup room controls
function setupRoomControls() {
    const deviceItems = document.querySelectorAll('.device-item');
    
    deviceItems.forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('on')) {
                this.classList.remove('on');
                this.classList.add('off');
            } else {
                this.classList.remove('off');
                this.classList.add('on');
            }
        });
    });
}

// Setup appliance controls
function setupApplianceControls() {
    const applianceSwitches = document.querySelectorAll('.appliance-controls input[type="checkbox"]');
    
    applianceSwitches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const applianceCard = this.closest('.appliance-card');
            if (this.checked) {
                applianceCard.classList.remove('inactive');
            } else {
                applianceCard.classList.add('inactive');
            }
        });
    });
}

// Setup notification controls
function setupNotificationControls() {
    const markAllReadBtn = document.querySelector('.notification-controls .btn-secondary');
    const notificationFilter = document.getElementById('notification-filter');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function() {
            notificationItems.forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
        });
    }
    
    if (notificationFilter) {
        notificationFilter.addEventListener('change', function() {
            const filterValue = this.value;
            
            notificationItems.forEach(item => {
                item.style.display = 'flex'; // Reset display
                
                if (filterValue === 'unread' && !item.classList.contains('unread')) {
                    item.style.display = 'none';
                } else if (filterValue === 'alerts' && !item.classList.contains('alert')) {
                    item.style.display = 'none';
                } else if (filterValue === 'tips' && !item.classList.contains('tip')) {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Individual notification actions
    const checkButtons = document.querySelectorAll('.notification-actions .fa-check');
    const deleteButtons = document.querySelectorAll('.notification-actions .fa-trash');
    
    checkButtons.forEach(btn => {
        btn.parentElement.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.classList.remove('unread');
            notificationItem.classList.add('read');
        });
    });
    
    deleteButtons.forEach(btn => {
        btn.parentElement.addEventListener('click', function() {
            const notificationItem = this.closest('.notification-item');
            notificationItem.style.display = 'none';
        });
    });
}

// Initialize all charts
function initializeCharts() {
    // Usage Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    
    window.usageChart = new Chart(usageCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [320, 350, 380, 410, 390, 360, 340, 330, 320, 310, 340, 324],
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Room Chart
    const roomCtx = document.getElementById('roomChart').getContext('2d');
    
    window.roomChart = new Chart(roomCtx, {
        type: 'doughnut',
        data: {
            labels: ['Living Room', 'Kitchen', 'Master Bedroom', 'Kids Room', 'Bathroom', 'Other'],
            datasets: [{
                data: [98, 85, 72, 35, 20, 14],
                backgroundColor: [
                    '#2e7d32',
                    '#1565c0',
                    '#ff6f00',
                    '#9c27b0',
                    '#e91e63',
                    '#607d8b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            cutout: '70%'
        }
    });
    
    // Appliance Chart
    const applianceCtx = document.getElementById('applianceChart').getContext('2d');
    
    window.applianceChart = new Chart(applianceCtx, {
        type: 'doughnut',
        data: {
            labels: ['Air Conditioner', 'Refrigerator', 'Water Heater', 'Washing Machine', 'TV', 'Other'],
            datasets: [{
                data: [120, 65, 45, 35, 30, 29],
                backgroundColor: [
                    '#2e7d32',
                    '#1565c0',
                    '#ff6f00',
                    '#9c27b0',
                    '#e91e63',
                    '#607d8b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Update charts based on time period
function updateCharts(timePeriod) {
    // Sample data for different time periods
    const usageData = {
        daily: {
            labels: Array.from({length: 24}, (_, i) => `${i}:00`),
            data: [10, 8, 7, 6, 5, 6, 8, 12, 15, 18, 20, 22, 25, 23, 20, 18, 19, 22, 25, 23, 20, 18, 15, 12]
        },
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [45, 48, 50, 46, 52, 55, 48]
        },
        monthly: {
            labels: Array.from({length: 30}, (_, i) => `${i+1}`),
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 15) + 10)
        },
        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [320, 350, 380, 410, 390, 360, 340, 330, 320, 310, 340, 324]
        }
    };
    
    // Update usage chart
    window.usageChart.data.labels = usageData[timePeriod].labels;
    window.usageChart.data.datasets[0].data = usageData[timePeriod].data;
    window.usageChart.update();
    
    // Update room and appliance charts with simulated data
    updateRoomAndApplianceCharts(timePeriod);
}

// Update chart type (usage or cost)
function updateChartType(chartType) {
    if (chartType === 'usage') {
        window.usageChart.data.datasets[0].label = 'Energy Usage (kWh)';
        window.usageChart.data.datasets[0].borderColor = '#2e7d32';
        window.usageChart.data.datasets[0].backgroundColor = 'rgba(46, 125, 50, 0.1)';
    } else if (chartType === 'cost') {
        window.usageChart.data.datasets[0].label = 'Energy Cost (₹)';
        window.usageChart.data.datasets[0].borderColor = '#ff6f00';
        window.usageChart.data.datasets[0].backgroundColor = 'rgba(255, 111, 0, 0.1)';
        
        // Convert usage data to cost (simplified calculation)
        const costData = window.usageChart.data.datasets[0].data.map(value => value * 8);
        window.usageChart.data.datasets[0].data = costData;
    }
    
    window.usageChart.update();
}

// Update room and appliance charts based on time period
function updateRoomAndApplianceCharts(timePeriod) {
    // Sample data for different time periods
    const roomData = {
        daily: [35, 30, 25, 15, 10, 5],
        weekly: [65, 55, 45, 25, 15, 10],
        monthly: [98, 85, 72, 35, 20, 14],
        yearly: [1200, 980, 850, 420, 250, 180]
    };
    
    const applianceData = {
        daily: [40, 22, 15, 12, 10, 10],
        weekly: [80, 45, 30, 25, 20, 15],
        monthly: [120, 65, 45, 35, 30, 29],
        yearly: [1450, 780, 540, 420, 360, 350]
    };
    
    // Update room chart
    window.roomChart.data.datasets[0].data = roomData[timePeriod];
    window.roomChart.update();
    
    // Update appliance chart
    window.applianceChart.data.datasets[0].data = applianceData[timePeriod];
    window.applianceChart.update();
    
    // Update top rooms and appliances text
    updateTopItems(timePeriod);
}

// Update top rooms and appliances text
function updateTopItems(timePeriod) {
    const roomValues = document.querySelectorAll('.top-rooms .item-value');
    const roomBars = document.querySelectorAll('.top-rooms .progress-bar');
    
    const applianceValues = document.querySelectorAll('.top-appliances .item-value');
    const applianceBars = document.querySelectorAll('.top-appliances .progress-bar');
    
    // Sample data for different time periods
    const roomData = {
        daily: [35, 30, 25],
        weekly: [65, 55, 45],
        monthly: [98, 85, 72],
        yearly: [1200, 980, 850]
    };
    
    const applianceData = {
        daily: [40, 22, 15],
        weekly: [80, 45, 30],
        monthly: [120, 65, 45],
        yearly: [1450, 780, 540]
    };
    
    // Update room values and progress bars
    roomValues.forEach((value, index) => {
        value.textContent = `${roomData[timePeriod][index]} kWh`;
        
        // Calculate percentage for progress bar
        const total = roomData[timePeriod].reduce((a, b) => a + b, 0);
        const percentage = (roomData[timePeriod][index] / total) * 100;
        
        roomBars[index].style.width = `${percentage}%`;
    });
    
    // Update appliance values and progress bars
    applianceValues.forEach((value, index) => {
        value.textContent = `${applianceData[timePeriod][index]} kWh`;
        
        // Calculate percentage for progress bar
        const total = applianceData[timePeriod].reduce((a, b) => a + b, 0);
        const percentage = (applianceData[timePeriod][index] / total) * 100;
        
        applianceBars[index].style.width = `${percentage}%`;
    });
}

// Simulate real-time data updates
function updateRealTimeData() {
    // Get current time period
    const timePeriod = document.getElementById('time-period').value;
    
    // Only update if on daily view to simulate real-time changes
    if (timePeriod === 'daily') {
        // Get current hour
        const currentHour = new Date().getHours();
        
        // Update the current hour's data point with a small random change
        const currentValue = window.usageChart.data.datasets[0].data[currentHour];
        const newValue = currentValue + (Math.random() * 2 - 1); // Random change between -1 and +1
        
        window.usageChart.data.datasets[0].data[currentHour] = Math.max(0, newValue);
        window.usageChart.update();
    }
}

// Language support
function toggleLanguage() {
    // Sample implementation - in a real app, this would load different language files
    const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'];
    const currentLang = localStorage.getItem('language') || 'English';
    
    // Find current language index
    const currentIndex = languages.indexOf(currentLang);
    
    // Get next language
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLang = languages[nextIndex];
    
    // Save to localStorage
    localStorage.setItem('language', nextLang);
    
    // Show notification
    alert(`Language changed to ${nextLang}`);
    
    // In a real implementation, this would reload the page content in the new language
}

// Simulate voice assistant
function activateVoiceAssistant() {
    // This is a placeholder for voice assistant functionality
    // In a real implementation, this would use the Web Speech API
    alert('Voice assistant activated. How can I help you with your energy management?');
}

// MCB Mapping functionality
function initializeMCBMapping() {
    // This would be implemented when the MCB mapping section is active
    console.log('MCB Mapping initialized');
}

// Bill OCR functionality
function initializeBillOCR() {
    // This would be implemented when the bill upload section is active
    console.log('Bill OCR initialized');
}

// Simulation mode
function toggleSimulationMode() {
    const simulationMode = localStorage.getItem('simulationMode') === 'true';
    localStorage.setItem('simulationMode', !simulationMode);
    
    alert(`Simulation mode ${!simulationMode ? 'enabled' : 'disabled'}`);
    
    // In a real implementation, this would switch between real data and simulated data
}

// Expose global functions
window.activateVoiceAssistant = activateVoiceAssistant;
window.toggleLanguage = toggleLanguage;
window.toggleSimulationMode = toggleSimulationMode;