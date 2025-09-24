document.addEventListener('DOMContentLoaded', function() {
    initBillUpload();
    initOCRSimulation();
    initBillHistory();
});

// Bill Upload Functionality
function initBillUpload() {
    const uploadContainer = document.querySelector('.upload-container');
    const fileInput = document.getElementById('bill-file-input');
    
    if (uploadContainer && fileInput) {
        uploadContainer.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }
}

function handleFileUpload(file) {
    const uploadArea = document.querySelector('.bill-upload-area');
    const processingContainer = document.querySelector('.ocr-processing-container');
    
    if (uploadArea && processingContainer) {
        uploadArea.style.display = 'none';
        processingContainer.style.display = 'block';
        simulateOCR(file);
    }
}

// OCR Simulation
function initOCRSimulation() {
    const saveButton = document.querySelector('.save-bill-btn');
    const editButton = document.querySelector('.edit-bill-btn');
    const resetButton = document.querySelector('.reset-btn');
    
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            alert('Bill saved successfully!');
            resetBillUpload();
        });
    }
    
    if (editButton) {
        editButton.addEventListener('click', () => {
            const formInputs = document.querySelectorAll('.extracted-data input');
            formInputs.forEach(input => input.readOnly = false);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetBillUpload);
    }
}

function simulateOCR(file) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const resultsContainer = document.querySelector('.ocr-results-container');
    const processingContainer = document.querySelector('.ocr-processing-container');
    
    if (file && progressBar && progressText) {
        // Display uploaded image
        const reader = new FileReader();
        reader.onload = function(e) {
            const billImage = document.querySelector('.bill-image img');
            if (billImage) billImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            progressText.textContent = `Processing... ${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    processingContainer.style.display = 'none';
                    resultsContainer.style.display = 'block';
                    populateOCRResults();
                }, 500);
            }
        }, 300);
    }
}

function populateOCRResults() {
    // Sample data
    const formData = {
        'bill-number': 'EB' + Math.floor(Math.random() * 1000000),
        'bill-date': '2023-05-15',
        'bill-amount': (Math.random() * 200 + 50).toFixed(2),
        'energy-consumption': Math.floor(Math.random() * 500 + 200),
        'billing-period': 'Apr 15, 2023 - May 15, 2023',
        'utility-provider': 'EnergyWise Electric'
    };
    
    // Set form values
    Object.keys(formData).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = formData[id];
            input.readOnly = true;
        }
    });
    
    // Set confidence level
    const accuracyMeter = document.querySelector('.accuracy-meter');
    if (accuracyMeter) {
        accuracyMeter.classList.remove('high', 'medium', 'low');
        accuracyMeter.classList.add('high');
        accuracyMeter.textContent = 'High Confidence';
    }
}

// Bill History Management
function initBillHistory() {
    loadBillHistory();
    
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', filterBillHistory);
    }
}

function loadBillHistory() {
    const tableBody = document.querySelector('.bills-table tbody');
    if (!tableBody) return;
    
    // Sample bill data
    const bills = [
        { id: 'BILL-1001', date: 'May 15, 2023', amount: '145.30', consumption: '320', status: 'paid' },
        { id: 'BILL-1002', date: 'Apr 15, 2023', amount: '132.75', consumption: '290', status: 'paid' },
        { id: 'BILL-1003', date: 'Mar 15, 2023', amount: '158.20', consumption: '350', status: 'paid' },
        { id: 'BILL-1004', date: 'Feb 15, 2023', amount: '172.50', consumption: '380', status: 'paid' },
        { id: 'BILL-1005', date: 'Jan 15, 2023', amount: '189.40', consumption: '420', status: 'paid' }
    ];
    
    // Create table rows
    tableBody.innerHTML = '';
    bills.forEach(bill => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.date}</td>
            <td>$${bill.amount}</td>
            <td>${bill.consumption} kWh</td>
            <td><span class="status-badge ${bill.status}">${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</span></td>
            <td>
                <button class="action-btn view-btn"><i class="fas fa-eye"></i></button>
                <button class="action-btn download-btn"><i class="fas fa-download"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add action button listeners
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.classList.contains('view-btn') ? 'Viewing' : 'Downloading';
            const billId = this.closest('tr').querySelector('td:first-child').textContent;
            alert(`${action} bill ${billId}`);
        });
    });
}

function filterBillHistory() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.bills-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function resetBillUpload() {
    const uploadArea = document.querySelector('.bill-upload-area');
    const processingContainer = document.querySelector('.ocr-processing-container');
    const resultsContainer = document.querySelector('.ocr-results-container');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (processingContainer) processingContainer.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'none';
    
    const fileInput = document.getElementById('bill-file-input');
    if (fileInput) fileInput.value = '';
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) progressBar.style.width = '0%';
}