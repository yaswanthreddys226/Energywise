// MCB Mapping JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const mcbSwitches = document.querySelectorAll('.mcb-switch');
    const roomCards = document.querySelectorAll('.room-card:not(.add-room)');
    const applianceCards = document.querySelectorAll('.appliance-card:not(.add-appliance)');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const addRoomBtn = document.querySelector('.add-room');
    const addApplianceBtn = document.querySelector('.add-appliance');
    const addModal = document.getElementById('add-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-modal');
    const addForm = document.getElementById('add-form');
    const saveBtn = document.getElementById('save-mapping');
    const resetBtn = document.getElementById('reset-mapping');
    const exportBtn = document.getElementById('export-mapping');
    const summaryTable = document.querySelector('.summary-table tbody');
    const mainSwitch = document.querySelector('.mcb-main-switch .switch');
    
    // State
    let mappings = {};
    let modalType = 'room'; // 'room' or 'appliance'
    let draggingElement = null;
    
    // Initialize
    initializeMCBSwitches();
    initializeDropZones();
    initializeTabs();
    initializeModal();
    initializeButtons();
    updateSummaryTable();
    
    // Functions
    function initializeMCBSwitches() {
        mcbSwitches.forEach(mcbSwitch => {
            // Make switches draggable
            mcbSwitch.addEventListener('dragstart', handleDragStart);
            mcbSwitch.addEventListener('dragend', handleDragEnd);
            
            // Toggle switch on click
            const switchElement = mcbSwitch.querySelector('.switch');
            switchElement.addEventListener('click', function() {
                toggleSwitch(switchElement);
            });
        });
        
        // Main switch functionality
        mainSwitch.addEventListener('click', function() {
            toggleSwitch(mainSwitch);
            const isOn = mainSwitch.classList.contains('on');
            
            // Toggle all other switches based on main switch
            document.querySelectorAll('.mcb-switch .switch').forEach(switchEl => {
                if (isOn) {
                    switchEl.classList.add('on');
                } else {
                    switchEl.classList.remove('on');
                }
            });
        });
    }
    
    function toggleSwitch(switchElement) {
        switchElement.classList.toggle('on');
        
        // Simulate power off/on effect if this is a real implementation
        const switchId = switchElement.closest('[data-switch]')?.dataset.switch;
        if (switchId) {
            simulatePowerChange(switchId, switchElement.classList.contains('on'));
        }
    }
    
    function simulatePowerChange(switchId, isOn) {
        // In a real implementation, this would communicate with the backend
        // to actually control power to devices or monitor which devices lost power
        console.log(`Switch ${switchId} is now ${isOn ? 'ON' : 'OFF'}`);
        
        // For demo purposes, we'll show a notification
        if (!isOn) {
            showNotification(`MCB Switch ${switchId} turned OFF. Note which devices lost power.`);
        }
    }
    
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <p>${message}</p>
            </div>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    function initializeDropZones() {
        // Set up room cards as drop zones
        roomCards.forEach(card => {
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('dragleave', handleDragLeave);
            card.addEventListener('drop', handleDrop);
        });
        
        // Set up appliance cards as drop zones
        applianceCards.forEach(card => {
            card.addEventListener('dragover', handleDragOver);
            card.addEventListener('dragleave', handleDragLeave);
            card.addEventListener('drop', handleDrop);
        });
    }
    
    function initializeTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                const tabId = `${button.dataset.tab}-tab`;
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    function initializeModal() {
        // Show modal when add room/appliance is clicked
        addRoomBtn.addEventListener('click', () => {
            showModal('room');
        });
        
        addApplianceBtn.addEventListener('click', () => {
            showModal('appliance');
        });
        
        // Close modal
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', hideModal);
        });
        
        // Form submission
        addForm.addEventListener('submit', handleAddItem);
    }
    
    function showModal(type) {
        modalType = type;
        const modalHeader = addModal.querySelector('.modal-header h3');
        modalHeader.textContent = type === 'room' ? 'Add New Room' : 'Add New Appliance';
        
        // Update icon options based on type
        const iconSelect = document.getElementById('item-icon');
        iconSelect.innerHTML = '';
        
        if (type === 'room') {
            const roomIcons = [
                { value: 'fas fa-door-open', label: 'Door' },
                { value: 'fas fa-couch', label: 'Couch' },
                { value: 'fas fa-bed', label: 'Bed' },
                { value: 'fas fa-utensils', label: 'Kitchen' },
                { value: 'fas fa-bath', label: 'Bathroom' },
                { value: 'fas fa-laptop', label: 'Office' },
                { value: 'fas fa-book', label: 'Study' },
                { value: 'fas fa-dumbbell', label: 'Gym' }
            ];
            
            roomIcons.forEach(icon => {
                const option = document.createElement('option');
                option.value = icon.value;
                option.textContent = icon.label;
                iconSelect.appendChild(option);
            });
        } else {
            const applianceIcons = [
                { value: 'fas fa-tv', label: 'TV' },
                { value: 'fas fa-snowflake', label: 'AC' },
                { value: 'fas fa-temperature-low', label: 'Refrigerator' },
                { value: 'fas fa-lightbulb', label: 'Light' },
                { value: 'fas fa-fan', label: 'Fan' },
                { value: 'fas fa-plug', label: 'Plug' },
                { value: 'fas fa-tshirt', label: 'Washing Machine' },
                { value: 'fas fa-hot-tub', label: 'Water Heater' }
            ];
            
            applianceIcons.forEach(icon => {
                const option = document.createElement('option');
                option.value = icon.value;
                option.textContent = icon.label;
                iconSelect.appendChild(option);
            });
        }
        
        addModal.classList.add('active');
    }
    
    function hideModal() {
        addModal.classList.remove('active');
        addForm.reset();
    }
    
    function handleAddItem(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const icon = document.getElementById('item-icon').value;
        
        if (name) {
            // Create new item
            const newItem = createItemCard(name, icon);
            
            // Add to appropriate container
            if (modalType === 'room') {
                const roomContainer = document.querySelector('.room-cards');
                roomContainer.insertBefore(newItem, addRoomBtn);
            } else {
                const applianceContainer = document.querySelector('.appliance-cards');
                applianceContainer.insertBefore(newItem, addApplianceBtn);
            }
            
            // Initialize as drop zone
            newItem.addEventListener('dragover', handleDragOver);
            newItem.addEventListener('dragleave', handleDragLeave);
            newItem.addEventListener('drop', handleDrop);
            
            hideModal();
        }
    }
    
    function createItemCard(name, iconClass) {
        const itemId = name.toLowerCase().replace(/\s+/g, '-');
        const card = document.createElement('div');
        
        if (modalType === 'room') {
            card.className = 'room-card';
            card.dataset.room = itemId;
            
            card.innerHTML = `
                <div class="room-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="room-info">
                    <h4>${name}</h4>
                    <p>Drop MCB switch here</p>
                </div>
                <div class="mapped-switches"></div>
            `;
        } else {
            card.className = 'appliance-card';
            card.dataset.appliance = itemId;
            
            card.innerHTML = `
                <div class="appliance-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="appliance-info">
                    <h4>${name}</h4>
                    <p>Drop MCB switch here</p>
                </div>
                <div class="mapped-switches"></div>
            `;
        }
        
        return card;
    }
    
    function initializeButtons() {
        // Save mapping
        saveBtn.addEventListener('click', saveMapping);
        
        // Reset mapping
        resetBtn.addEventListener('click', resetMapping);
        
        // Export mapping
        exportBtn.addEventListener('click', exportMapping);
    }
    
    function saveMapping() {
        // In a real implementation, this would save to a database
        localStorage.setItem('mcbMappings', JSON.stringify(mappings));
        showNotification('MCB mapping saved successfully!');
    }
    
    function resetMapping() {
        // Confirm reset
        if (confirm('Are you sure you want to reset all mappings? This cannot be undone.')) {
            // Clear all mappings
            mappings = {};
            
            // Remove all mapped switches from UI
            document.querySelectorAll('.mapped-switches').forEach(container => {
                container.innerHTML = '';
            });
            
            // Reset switch labels
            document.querySelectorAll('.mcb-switch .switch-label').forEach(label => {
                label.textContent = 'Unknown';
            });
            
            // Update summary table
            updateSummaryTable();
            
            // Clear local storage
            localStorage.removeItem('mcbMappings');
            
            showNotification('All mappings have been reset.');
        }
    }
    
    function exportMapping() {
        // Create a formatted text version of the mappings
        let exportText = 'MCB Mapping Export\n';
        exportText += '=================\n\n';
        
        Object.keys(mappings).forEach(switchId => {
            const mapping = mappings[switchId];
            exportText += `MCB Switch ${switchId}:\n`;
            exportText += `  Mapped To: ${mapping.name}\n`;
            exportText += `  Type: ${mapping.type}\n`;
            exportText += `  Power Rating: ${mapping.powerRating || 'Unknown'}\n\n`;
        });
        
        // Create a download link
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mcb-mapping-export.txt';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    // Drag and Drop Handlers
    function handleDragStart(e) {
        draggingElement = this;
        this.classList.add('dragging');
        
        // Set data for drag operation
        const switchId = this.dataset.switch;
        e.dataTransfer.setData('text/plain', switchId);
        e.dataTransfer.effectAllowed = 'move';
        
        // Add visual feedback
        setTimeout(() => {
            document.querySelectorAll('.room-card:not(.add-room), .appliance-card:not(.add-appliance)').forEach(card => {
                card.classList.add('pulse-animation');
            });
        }, 100);
    }
    
    function handleDragEnd() {
        this.classList.remove('dragging');
        
        // Remove visual feedback
        document.querySelectorAll('.room-card, .appliance-card').forEach(card => {
            card.classList.remove('pulse-animation');
        });
        
        draggingElement = null;
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        this.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragLeave() {
        this.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const switchId = e.dataTransfer.getData('text/plain');
        const mcbSwitch = document.querySelector(`.mcb-switch[data-switch="${switchId}"]`);
        
        if (!mcbSwitch) return;
        
        // Determine target type (room or appliance)
        let targetType, targetId, targetName;
        
        if (this.dataset.room) {
            targetType = 'room';
            targetId = this.dataset.room;
            targetName = this.querySelector('h4').textContent;
        } else if (this.dataset.appliance) {
            targetType = 'appliance';
            targetId = this.dataset.appliance;
            targetName = this.querySelector('h4').textContent;
        } else {
            return;
        }
        
        // Update the switch label
        mcbSwitch.querySelector('.switch-label').textContent = targetName;
        
        // Add to mappings
        mappings[switchId] = {
            id: targetId,
            name: targetName,
            type: targetType,
            powerRating: estimatePowerRating(targetType, targetId)
        };
        
        // Add visual representation to the target
        addMappedSwitchToTarget(this, switchId, targetName);
        
        // Update summary table
        updateSummaryTable();
        
        // Show success notification
        showNotification(`MCB Switch ${switchId} mapped to ${targetName}`);
    }
    
    function addMappedSwitchToTarget(target, switchId, targetName) {
        const mappedSwitchesContainer = target.querySelector('.mapped-switches');
        
        // Check if this switch is already mapped here
        const existingMapping = mappedSwitchesContainer.querySelector(`.mapped-switch[data-switch="${switchId}"]`);
        if (existingMapping) return;
        
        // Create mapped switch element
        const mappedSwitch = document.createElement('div');
        mappedSwitch.className = 'mapped-switch';
        mappedSwitch.dataset.switch = switchId;
        mappedSwitch.innerHTML = `
            <div class="switch-number">${switchId}</div>
            <span>MCB ${switchId}</span>
            <i class="fas fa-times remove-mapping"></i>
        `;
        
        // Add remove functionality
        mappedSwitch.querySelector('.remove-mapping').addEventListener('click', () => {
            removeMapping(switchId, mappedSwitch);
        });
        
        // Add to container
        mappedSwitchesContainer.appendChild(mappedSwitch);
    }
    
    function removeMapping(switchId, mappedSwitchElement) {
        // Remove from UI
        mappedSwitchElement.remove();
        
        // Reset switch label
        const mcbSwitch = document.querySelector(`.mcb-switch[data-switch="${switchId}"]`);
        if (mcbSwitch) {
            mcbSwitch.querySelector('.switch-label').textContent = 'Unknown';
        }
        
        // Remove from mappings object
        delete mappings[switchId];
        
        // Update summary table
        updateSummaryTable();
    }
    
    function updateSummaryTable() {
        // Clear existing rows
        summaryTable.innerHTML = '';
        
        // Add a row for each mapping
        Object.keys(mappings).forEach(switchId => {
            const mapping = mappings[switchId];
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>MCB ${switchId}</td>
                <td>${mapping.name}</td>
                <td>${mapping.type.charAt(0).toUpperCase() + mapping.type.slice(1)}</td>
                <td>${mapping.powerRating || 'Unknown'}</td>
                <td>
                    <button class="action-btn edit-btn" data-switch="${switchId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-switch="${switchId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            // Add event listeners for edit and delete
            row.querySelector('.edit-btn').addEventListener('click', () => {
                editPowerRating(switchId);
            });
            
            row.querySelector('.delete-btn').addEventListener('click', () => {
                // Find and remove the mapped switch element
                const mappedSwitch = document.querySelector(`.mapped-switch[data-switch="${switchId}"]`);
                if (mappedSwitch) {
                    removeMapping(switchId, mappedSwitch);
                }
            });
            
            summaryTable.appendChild(row);
        });
        
        // Add empty state if no mappings
        if (Object.keys(mappings).length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="5" class="empty-state">
                    <p>No MCB switches have been mapped yet. Drag switches to rooms or appliances to create mappings.</p>
                </td>
            `;
            summaryTable.appendChild(emptyRow);
        }
    }
    
    function editPowerRating(switchId) {
        const mapping = mappings[switchId];
        const newRating = prompt(`Enter power rating for ${mapping.name}:`, mapping.powerRating || '');
        
        if (newRating !== null) {
            mapping.powerRating = newRating || 'Unknown';
            updateSummaryTable();
        }
    }
    
    function estimatePowerRating(type, id) {
        // In a real implementation, this would use historical data or typical values
        // For demo purposes, we'll return some typical values based on type and id
        
        const ratings = {
            room: {
                'living-room': '1500W',
                'kitchen': '2200W',
                'master-bedroom': '1200W',
                'kids-bedroom': '800W',
                'bathroom': '1000W'
            },
            appliance: {
                'air-conditioner': '1500W',
                'refrigerator': '150W',
                'water-heater': '2000W',
                'washing-machine': '500W',
                'television': '100W'
            }
        };
        
        return ratings[type][id] || 'Unknown';
    }
    
    // Load saved mappings if available
    function loadSavedMappings() {
        const savedMappings = localStorage.getItem('mcbMappings');
        if (savedMappings) {
            try {
                mappings = JSON.parse(savedMappings);
                
                // Restore UI state
                Object.keys(mappings).forEach(switchId => {
                    const mapping = mappings[switchId];
                    
                    // Update switch label
                    const mcbSwitch = document.querySelector(`.mcb-switch[data-switch="${switchId}"]`);
                    if (mcbSwitch) {
                        mcbSwitch.querySelector('.switch-label').textContent = mapping.name;
                    }
                    
                    // Add visual representation to target
                    let target;
                    if (mapping.type === 'room') {
                        target = document.querySelector(`.room-card[data-room="${mapping.id}"]`);
                    } else {
                        target = document.querySelector(`.appliance-card[data-appliance="${mapping.id}"]`);
                    }
                    
                    if (target) {
                        addMappedSwitchToTarget(target, switchId, mapping.name);
                    }
                });
                
                // Update summary table
                updateSummaryTable();
            } catch (error) {
                console.error('Error loading saved mappings:', error);
            }
        }
    }
    
    // Initialize with saved data
    loadSavedMappings();
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 1rem;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 500px;
            transition: bottom 0.3s ease;
        }
        
        .notification.show {
            bottom: 20px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-right: 0.75rem;
        }
        
        .notification-content p {
            margin: 0;
            color: var(--text-color);
        }
        
        .close-notification {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
        }
        
        .close-notification:hover {
            color: var(--danger-color);
        }
    `;
    document.head.appendChild(style);
});