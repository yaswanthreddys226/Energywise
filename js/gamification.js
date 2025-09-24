/**
 * Energy Wise - Gamification & Rewards JavaScript
 * Handles leaderboard, badges, challenges, and environmental impact tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gamification features
    initGamification();
    
    // Setup event listeners
    setupGamificationListeners();
    
    // Check for completed challenges
    checkChallenges();
});

// User profile with gamification data
const userProfile = {
    points: 0,
    level: 1,
    badges: [],
    completedChallenges: [],
    activeChallenges: [],
    streaks: {
        current: 0,
        longest: 0,
        lastActive: null
    },
    environmentalImpact: {
        energySaved: 0, // kWh
        co2Reduced: 0,  // kg
        treesEquivalent: 0
    }
};

// Available badges
const availableBadges = [
    { id: 'energy_saver_bronze', name: 'Energy Saver Bronze', description: 'Save 10 kWh of energy', icon: 'fa-leaf', requirement: { type: 'energy_saved', value: 10 } },
    { id: 'energy_saver_silver', name: 'Energy Saver Silver', description: 'Save 50 kWh of energy', icon: 'fa-leaf', requirement: { type: 'energy_saved', value: 50 } },
    { id: 'energy_saver_gold', name: 'Energy Saver Gold', description: 'Save 100 kWh of energy', icon: 'fa-leaf', requirement: { type: 'energy_saved', value: 100 } },
    { id: 'streak_week', name: 'Weekly Streak', description: 'Log in for 7 consecutive days', icon: 'fa-calendar-check', requirement: { type: 'streak', value: 7 } },
    { id: 'streak_month', name: 'Monthly Streak', description: 'Log in for 30 consecutive days', icon: 'fa-calendar-check', requirement: { type: 'streak', value: 30 } },
    { id: 'challenge_master', name: 'Challenge Master', description: 'Complete 5 challenges', icon: 'fa-trophy', requirement: { type: 'challenges', value: 5 } },
    { id: 'eco_warrior', name: 'Eco Warrior', description: 'Reduce CO2 emissions by 50kg', icon: 'fa-globe', requirement: { type: 'co2_reduced', value: 50 } },
    { id: 'community_leader', name: 'Community Leader', description: 'Reach top 10 on the leaderboard', icon: 'fa-users', requirement: { type: 'leaderboard', value: 10 } }
];

// Available challenges
const availableChallenges = [
    { 
        id: 'reduce_standby', 
        name: 'Reduce Standby Power', 
        description: 'Unplug 3 devices when not in use for a week', 
        points: 50,
        duration: 7, // days
        icon: 'fa-plug',
        progress: 0,
        progressTarget: 3
    },
    { 
        id: 'efficient_lighting', 
        name: 'Efficient Lighting', 
        description: 'Replace all bulbs with LED alternatives', 
        points: 100,
        duration: 30, // days
        icon: 'fa-lightbulb',
        progress: 0,
        progressTarget: 5
    },
    { 
        id: 'peak_hours', 
        name: 'Peak Hours Reduction', 
        description: 'Reduce energy usage during peak hours by 20%', 
        points: 150,
        duration: 14, // days
        icon: 'fa-clock',
        progress: 0,
        progressTarget: 100
    },
    { 
        id: 'energy_audit', 
        name: 'Home Energy Audit', 
        description: 'Complete a full home energy audit', 
        points: 200,
        duration: 1, // days
        icon: 'fa-search',
        progress: 0,
        progressTarget: 1
    },
    { 
        id: 'solar_exploration', 
        name: 'Solar Exploration', 
        description: 'Research solar options for your home', 
        points: 75,
        duration: 7, // days
        icon: 'fa-sun',
        progress: 0,
        progressTarget: 1
    }
];

/**
 * Initialize gamification features
 */
function initGamification() {
    // Load user profile from localStorage
    loadUserProfile();
    
    // Update UI elements
    updatePointsDisplay();
    updateLevelDisplay();
    updateBadgesDisplay();
    updateChallengesDisplay();
    updateEnvironmentalImpactDisplay();
    
    // Check for streak
    updateStreak();
    
    // Show welcome back message with points
    if (userProfile.points > 0) {
        showNotification('Welcome back!', `You currently have ${userProfile.points} points and are at level ${userProfile.level}.`);
    }
}

/**
 * Load user profile from localStorage
 */
function loadUserProfile() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        Object.assign(userProfile, parsedProfile);
    } else {
        // First time user, assign initial challenges
        assignInitialChallenges();
        saveUserProfile();
    }
}

/**
 * Save user profile to localStorage
 */
function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

/**
 * Assign initial challenges to new users
 */
function assignInitialChallenges() {
    // Assign first two challenges to new users
    userProfile.activeChallenges = [
        Object.assign({}, availableChallenges[0]),
        Object.assign({}, availableChallenges[1])
    ];
}

/**
 * Update the points display in the UI
 */
function updatePointsDisplay() {
    const pointsElement = document.getElementById('user-points');
    if (pointsElement) {
        pointsElement.textContent = userProfile.points;
    }
}

/**
 * Update the level display in the UI
 */
function updateLevelDisplay() {
    const levelElement = document.getElementById('user-level');
    if (levelElement) {
        levelElement.textContent = userProfile.level;
    }
    
    // Update progress bar if it exists
    const progressBar = document.getElementById('level-progress-bar');
    if (progressBar) {
        const nextLevelPoints = calculatePointsForNextLevel();
        const currentLevelPoints = calculatePointsForLevel(userProfile.level);
        const progress = ((userProfile.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Calculate points required for the next level
 * @returns {number} Points required for next level
 */
function calculatePointsForNextLevel() {
    return calculatePointsForLevel(userProfile.level + 1);
}

/**
 * Calculate points required for a specific level
 * @param {number} level - The level to calculate points for
 * @returns {number} Points required for the specified level
 */
function calculatePointsForLevel(level) {
    // Simple formula: 100 * level^2
    return 100 * Math.pow(level, 2);
}

/**
 * Update the badges display in the UI
 */
function updateBadgesDisplay() {
    const badgesContainer = document.getElementById('badges-container');
    if (!badgesContainer) return;
    
    // Clear existing badges
    badgesContainer.innerHTML = '';
    
    if (userProfile.badges.length === 0) {
        badgesContainer.innerHTML = '<p>You haven\'t earned any badges yet. Complete challenges to earn badges!</p>';
        return;
    }
    
    // Add each badge to the container
    userProfile.badges.forEach(badgeId => {
        const badge = availableBadges.find(b => b.id === badgeId);
        if (badge) {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge-item';
            badgeElement.innerHTML = `
                <div class="badge-icon">
                    <i class="fas ${badge.icon}"></i>
                </div>
                <div class="badge-info">
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                </div>
            `;
            badgesContainer.appendChild(badgeElement);
        }
    });
}

/**
 * Update the challenges display in the UI
 */
function updateChallengesDisplay() {
    const activeChallengesContainer = document.getElementById('active-challenges');
    const completedChallengesContainer = document.getElementById('completed-challenges');
    
    if (!activeChallengesContainer && !completedChallengesContainer) return;
    
    // Update active challenges
    if (activeChallengesContainer) {
        activeChallengesContainer.innerHTML = '';
        
        if (userProfile.activeChallenges.length === 0) {
            activeChallengesContainer.innerHTML = '<p>No active challenges. Check back soon for new challenges!</p>';
        } else {
            userProfile.activeChallenges.forEach(challenge => {
                const challengeElement = document.createElement('div');
                challengeElement.className = 'challenge-item';
                challengeElement.dataset.challengeId = challenge.id;
                
                const progressPercent = (challenge.progress / challenge.progressTarget) * 100;
                
                challengeElement.innerHTML = `
                    <div class="challenge-icon">
                        <i class="fas ${challenge.icon}"></i>
                    </div>
                    <div class="challenge-info">
                        <h4>${challenge.name}</h4>
                        <p>${challenge.description}</p>
                        <div class="challenge-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <span class="progress-text">${challenge.progress}/${challenge.progressTarget}</span>
                        </div>
                        <div class="challenge-rewards">
                            <span class="reward-points"><i class="fas fa-star"></i> ${challenge.points} points</span>
                        </div>
                    </div>
                    <button class="btn-update-progress" data-challenge-id="${challenge.id}">Update Progress</button>
                `;
                
                activeChallengesContainer.appendChild(challengeElement);
            });
        }
    }
    
    // Update completed challenges
    if (completedChallengesContainer) {
        completedChallengesContainer.innerHTML = '';
        
        if (userProfile.completedChallenges.length === 0) {
            completedChallengesContainer.innerHTML = '<p>You haven\'t completed any challenges yet.</p>';
        } else {
            userProfile.completedChallenges.forEach(challengeId => {
                const challenge = availableChallenges.find(c => c.id === challengeId);
                if (challenge) {
                    const challengeElement = document.createElement('div');
                    challengeElement.className = 'challenge-item completed';
                    
                    challengeElement.innerHTML = `
                        <div class="challenge-icon">
                            <i class="fas ${challenge.icon}"></i>
                        </div>
                        <div class="challenge-info">
                            <h4>${challenge.name}</h4>
                            <p>${challenge.description}</p>
                            <div class="challenge-rewards">
                                <span class="reward-points"><i class="fas fa-star"></i> ${challenge.points} points</span>
                            </div>
                        </div>
                        <div class="completion-badge">
                            <i class="fas fa-check-circle"></i>
                        </div>
                    `;
                    
                    completedChallengesContainer.appendChild(challengeElement);
                }
            });
        }
    }
}

/**
 * Update the environmental impact display in the UI
 */
function updateEnvironmentalImpactDisplay() {
    const energySavedElement = document.getElementById('energy-saved');
    const co2ReducedElement = document.getElementById('co2-reduced');
    const treesEquivalentElement = document.getElementById('trees-equivalent');
    
    if (energySavedElement) {
        energySavedElement.textContent = userProfile.environmentalImpact.energySaved.toFixed(2);
    }
    
    if (co2ReducedElement) {
        co2ReducedElement.textContent = userProfile.environmentalImpact.co2Reduced.toFixed(2);
    }
    
    if (treesEquivalentElement) {
        treesEquivalentElement.textContent = userProfile.environmentalImpact.treesEquivalent.toFixed(1);
    }
}

/**
 * Update user streak
 */
function updateStreak() {
    const today = new Date().toDateString();
    
    if (!userProfile.streaks.lastActive) {
        // First login
        userProfile.streaks.current = 1;
        userProfile.streaks.lastActive = today;
    } else if (userProfile.streaks.lastActive !== today) {
        const lastActiveDate = new Date(userProfile.streaks.lastActive);
        const currentDate = new Date(today);
        
        // Calculate the difference in days
        const timeDiff = currentDate.getTime() - lastActiveDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 1) {
            // Consecutive day
            userProfile.streaks.current += 1;
            
            // Update longest streak if needed
            if (userProfile.streaks.current > userProfile.streaks.longest) {
                userProfile.streaks.longest = userProfile.streaks.current;
            }
            
            // Show streak notification
            if (userProfile.streaks.current % 5 === 0) {
                showNotification('Streak Milestone!', `You've logged in for ${userProfile.streaks.current} consecutive days!`);
                
                // Award bonus points for streak milestones
                awardPoints(userProfile.streaks.current * 2);
            }
        } else if (dayDiff > 1) {
            // Streak broken
            userProfile.streaks.current = 1;
        }
        
        userProfile.streaks.lastActive = today;
    }
    
    // Update streak display
    const streakElement = document.getElementById('current-streak');
    if (streakElement) {
        streakElement.textContent = userProfile.streaks.current;
    }
    
    saveUserProfile();
}

/**
 * Award points to the user
 * @param {number} points - Number of points to award
 * @param {string} reason - Reason for awarding points
 */
function awardPoints(points, reason = '') {
    userProfile.points += points;
    
    // Check if user leveled up
    const newLevel = calculateLevel(userProfile.points);
    if (newLevel > userProfile.level) {
        const levelsGained = newLevel - userProfile.level;
        userProfile.level = newLevel;
        
        // Show level up notification
        showNotification('Level Up!', `Congratulations! You've reached level ${newLevel}!`);
    }
    
    // Show points notification if reason provided
    if (reason) {
        showNotification('Points Awarded', `You earned ${points} points for ${reason}!`);
    }
    
    // Update UI
    updatePointsDisplay();
    updateLevelDisplay();
    
    // Save changes
    saveUserProfile();
}

/**
 * Calculate user level based on points
 * @param {number} points - User's current points
 * @returns {number} User's level
 */
function calculateLevel(points) {
    // Simple formula: level = sqrt(points/100)
    return Math.floor(Math.sqrt(points / 100)) + 1;
}

/**
 * Update environmental impact stats
 * @param {number} energySaved - kWh of energy saved
 */
function updateEnvironmentalImpact(energySaved) {
    // Update energy saved
    userProfile.environmentalImpact.energySaved += energySaved;
    
    // Calculate CO2 reduction (average 0.5 kg CO2 per kWh)
    const co2Reduced = energySaved * 0.5;
    userProfile.environmentalImpact.co2Reduced += co2Reduced;
    
    // Calculate trees equivalent (average tree absorbs 25kg CO2 per year)
    userProfile.environmentalImpact.treesEquivalent = userProfile.environmentalImpact.co2Reduced / 25;
    
    // Update UI
    updateEnvironmentalImpactDisplay();
    
    // Check for environmental badges
    checkBadges();
    
    // Save changes
    saveUserProfile();
}

/**
 * Check if user has earned any new badges
 */
function checkBadges() {
    availableBadges.forEach(badge => {
        // Skip if already earned
        if (userProfile.badges.includes(badge.id)) return;
        
        let earned = false;
        
        // Check if requirements are met
        switch (badge.requirement.type) {
            case 'energy_saved':
                earned = userProfile.environmentalImpact.energySaved >= badge.requirement.value;
                break;
            case 'co2_reduced':
                earned = userProfile.environmentalImpact.co2Reduced >= badge.requirement.value;
                break;
            case 'streak':
                earned = userProfile.streaks.current >= badge.requirement.value;
                break;
            case 'challenges':
                earned = userProfile.completedChallenges.length >= badge.requirement.value;
                break;
            case 'leaderboard':
                // This would require leaderboard position data
                break;
        }
        
        if (earned) {
            // Award badge
            userProfile.badges.push(badge.id);
            
            // Show notification
            showNotification('Badge Earned!', `You've earned the "${badge.name}" badge!`);
            
            // Award bonus points for earning a badge
            awardPoints(50, `earning the ${badge.name} badge`);
            
            // Update badges display
            updateBadgesDisplay();
        }
    });
}

/**
 * Check challenge progress and completion
 */
function checkChallenges() {
    // Check for completed challenges
    userProfile.activeChallenges.forEach((challenge, index) => {
        if (challenge.progress >= challenge.progressTarget) {
            // Challenge completed
            userProfile.completedChallenges.push(challenge.id);
            
            // Remove from active challenges
            userProfile.activeChallenges.splice(index, 1);
            
            // Award points
            awardPoints(challenge.points, `completing the "${challenge.name}" challenge`);
            
            // Show notification
            showNotification('Challenge Completed!', `You've completed the "${challenge.name}" challenge and earned ${challenge.points} points!`);
            
            // Assign a new challenge if available
            assignNewChallenge();
            
            // Check for badges
            checkBadges();
        }
    });
    
    // Update challenges display
    updateChallengesDisplay();
    
    // Save changes
    saveUserProfile();
}

/**
 * Assign a new challenge to the user
 */
function assignNewChallenge() {
    // Find challenges that aren't active or completed
    const availableNewChallenges = availableChallenges.filter(challenge => 
        !userProfile.activeChallenges.some(c => c.id === challenge.id) && 
        !userProfile.completedChallenges.includes(challenge.id)
    );
    
    if (availableNewChallenges.length > 0) {
        // Randomly select a new challenge
        const randomIndex = Math.floor(Math.random() * availableNewChallenges.length);
        const newChallenge = Object.assign({}, availableNewChallenges[randomIndex]);
        
        // Add to active challenges
        userProfile.activeChallenges.push(newChallenge);
        
        // Show notification
        showNotification('New Challenge!', `You've been assigned a new challenge: "${newChallenge.name}"`);
    }
}

/**
 * Update progress for a specific challenge
 * @param {string} challengeId - ID of the challenge to update
 * @param {number} progress - Progress to add
 */
function updateChallengeProgress(challengeId, progress) {
    const challenge = userProfile.activeChallenges.find(c => c.id === challengeId);
    
    if (challenge) {
        challenge.progress += progress;
        
        // Cap progress at target
        if (challenge.progress > challenge.progressTarget) {
            challenge.progress = challenge.progressTarget;
        }
        
        // Update UI
        updateChallengesDisplay();
        
        // Check if challenge is completed
        checkChallenges();
        
        // Save changes
        saveUserProfile();
    }
}

/**
 * Show a notification to the user
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
function showNotification(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'gamification-notification';
    notification.innerHTML = `
        <div class="notification-header">
            <h4>${title}</h4>
            <button class="close-notification"><i class="fas fa-times"></i></button>
        </div>
        <div class="notification-body">
            <p>${message}</p>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.close-notification');
    closeButton.addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Setup event listeners for gamification features
 */
function setupGamificationListeners() {
    // Listen for challenge progress updates
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-update-progress')) {
            const challengeId = event.target.dataset.challengeId;
            
            // For demo purposes, increment progress by 1
            // In a real app, you might show a form or modal to input actual progress
            updateChallengeProgress(challengeId, 1);
            
            // Simulate energy savings for this action
            updateEnvironmentalImpact(0.5);
        }
    });
    
    // Listen for simulation completions to award points
    document.addEventListener('simulationCompleted', function(event) {
        const energySaved = event.detail.energySaved || 0;
        
        // Award points based on energy saved
        if (energySaved > 0) {
            awardPoints(Math.floor(energySaved * 10), 'completing a simulation');
            updateEnvironmentalImpact(energySaved);
        }
    });
    
    // Listen for bill uploads to award points
    document.addEventListener('billUploaded', function(event) {
        awardPoints(25, 'uploading an energy bill');
    });
}