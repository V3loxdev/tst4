// App State
let appData = {
    currentPage: 'home',
    dailyStats: {
        calories: 1847,
        protein: 142,
        fat: 67,
        carbs: 189,
        calorieGoal: 2500
    },
    meals: [
        {
            id: 1,
            name: '🥗 Garden Salad',
            time: '12:30 PM',
            calories: 320,
            protein: 12,
            carbs: 45,
            fat: 8
        },
        {
            id: 2,
            name: '🍗 Grilled Chicken',
            time: '1:15 PM',
            calories: 450,
            protein: 35,
            carbs: 2,
            fat: 18
        },
        {
            id: 3,
            name: '🍎 Apple & Nuts',
            time: '3:45 PM',
            calories: 180,
            protein: 4,
            carbs: 22,
            fat: 9
        }
    ],
    foodDatabase: [
        { emoji: '🍕', name: 'Pepperoni Pizza', calories: 285, protein: 12, carbs: 36, fat: 10 },
        { emoji: '🍔', name: 'Hamburger', calories: 354, protein: 25, carbs: 40, fat: 16 },
        { emoji: '🍣', name: 'Sushi Roll', calories: 200, protein: 8, carbs: 30, fat: 6 },
        { emoji: '🥙', name: 'Chicken Wrap', calories: 300, protein: 25, carbs: 35, fat: 12 },
        { emoji: '🍝', name: 'Pasta', calories: 220, protein: 8, carbs: 44, fat: 2 },
        { emoji: '🥩', name: 'Steak', calories: 271, protein: 26, carbs: 0, fat: 17 },
        { emoji: '🍰', name: 'Chocolate Cake', calories: 352, protein: 5, carbs: 35, fat: 22 },
        { emoji: '🥪', name: 'Sandwich', calories: 250, protein: 15, carbs: 30, fat: 8 }
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('nutrilens_logged_in')) {
        window.location.href = 'login/login.html';
        return;
    }
    
    renderMeals();
    updateProgressBar();
    updateStats();
});

// Navigation Functions
function switchPage(page) {
    // Remove active class from all pages and nav items
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Add active class to selected page and nav item
    document.getElementById(page + 'Page').classList.add('active');
    document.querySelector(`[onclick="switchPage('${page}')"]`).classList.add('active');
    
    appData.currentPage = page;
    showNotification(`Switched to ${page.charAt(0).toUpperCase() + page.slice(1)} 📱`);
}

// Meal Management
function renderMeals() {
    const mealsList = document.getElementById('mealsList');
    mealsList.innerHTML = '';
    
    appData.meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'meal-card';
        mealCard.onclick = () => showMealDetails(meal);
        
        mealCard.innerHTML = `
            <div class="meal-header">
                <div class="meal-name">${meal.name}</div>
                <div class="meal-time">${meal.time}</div>
            </div>
            <div class="meal-nutrients">
                <div class="nutrient">
                    <div class="nutrient-value">${meal.calories}</div>
                    <div class="nutrient-label">Cal</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.protein}g</div>
                    <div class="nutrient-label">Protein</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.carbs}g</div>
                    <div class="nutrient-label">Carbs</div>
                </div>
                <div class="nutrient">
                    <div class="nutrient-value">${meal.fat}g</div>
                    <div class="nutrient-label">Fat</div>
                </div>
            </div>
        `;
        
        mealsList.appendChild(mealCard);
    });
}

function showMealDetails(meal) {
    document.getElementById('modalTitle').textContent = meal.name;
    document.getElementById('modalBody').innerHTML = `
        <div style="text-align: left;">
            <p><strong>Time:</strong> ${meal.time}</p>
            <p><strong>Calories:</strong> ${meal.calories} kcal</p>
            <p><strong>Protein:</strong> ${meal.protein}g</p>
            <p><strong>Carbohydrates:</strong> ${meal.carbs}g</p>
            <p><strong>Fat:</strong> ${meal.fat}g</p>
        </div>
    `;
    showModal('detailModal');
}

// Scanner Functions
function startScan() {
    document.getElementById('scanOverlay').style.display = 'flex';
    
    // Simulate scanning process
    setTimeout(() => {
        closeScan();
        // Randomly select a food item
        const randomFood = appData.foodDatabase[Math.floor(Math.random() * appData.foodDatabase.length)];
        showScanResult(randomFood);
    }, 3000);
}

function closeScan() {
    document.getElementById('scanOverlay').style.display = 'none';
}

function showScanResult(food) {
    document.getElementById('detectedEmoji').textContent = food.emoji;
    document.getElementById('detectedFood').textContent = food.name;
    document.getElementById('detectedCalories').textContent = food.calories;
    document.getElementById('detectedProtein').textContent = food.protein + 'g';
    document.getElementById('detectedCarbs').textContent = food.carbs + 'g';
    document.getElementById('detectedFat').textContent = food.fat + 'g';
    
    showModal('scanResultModal');
}

function confirmScanResult() {
    const food = {
        emoji: document.getElementById('detectedEmoji').textContent,
        name: document.getElementById('detectedFood').textContent,
        calories: parseInt(document.getElementById('detectedCalories').textContent),
        protein: parseInt(document.getElementById('detectedProtein').textContent),
        carbs: parseInt(document.getElementById('detectedCarbs').textContent),
        fat: parseInt(document.getElementById('detectedFat').textContent)
    };
    
    addMealToDay(food);
    closeModal();
    showNotification(`${food.emoji} ${food.name} added to your diary! ✅`);
}

// Food Management
function quickAdd() {
    showModal('addFoodModal');
}

function addFood() {
    const name = document.getElementById('foodName').value;
    const calories = parseInt(document.getElementById('foodCalories').value) || 0;
    const protein = parseInt(document.getElementById('foodProtein').value) || 0;
    const fat = parseInt(document.getElementById('foodFat').value) || 0;
    const carbs = parseInt(document.getElementById('foodCarbs').value) || 0;
    
    if (!name) {
        showNotification('Please enter a food name! ⚠️');
        return;
    }
    
    const food = {
        emoji: '🍽️',
        name: name,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat
    };
    
    addMealToDay(food);
    closeModal();
    document.getElementById('foodForm').reset();
    showNotification(`${food.name} added to your diary! ✅`);
}

function addMealToDay(food) {
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const newMeal = {
        id: Date.now(),
        name: `${food.emoji} ${food.name}`,
        time: currentTime,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat
    };
    
    appData.meals.unshift(newMeal);
    
    // Update daily stats
    appData.dailyStats.calories += food.calories;
    appData.dailyStats.protein += food.protein;
    appData.dailyStats.fat += food.fat;
    appData.dailyStats.carbs += food.carbs;
    
    // Re-render components
    renderMeals();
    updateStats();
    updateProgressBar();
}

// Statistics Functions
function updateStats() {
    document.getElementById('calorieCount').textContent = appData.dailyStats.calories.toLocaleString();
    document.getElementById('proteinCount').textContent = appData.dailyStats.protein + 'g';
    document.getElementById('fatCount').textContent = appData.dailyStats.fat + 'g';
    
    const goalPercent = Math.round((appData.dailyStats.calories / appData.dailyStats.calorieGoal) * 100);
    document.getElementById('goalPercent').textContent = goalPercent + '%';
}

function updateProgressBar() {
    const progressBar = document.getElementById('calorieProgress');
    const percentage = (appData.dailyStats.calories / appData.dailyStats.calorieGoal);
    const dashOffset = 314 - (percentage * 314);
    progressBar.style.strokeDashoffset = Math.max(0, dashOffset);
}

function showDetails(type) {
    const details = {
        calories: {
            title: 'Calorie Breakdown',
            content: `
                <div style="text-align: left;">
                    <p><strong>Current:</strong> ${appData.dailyStats.calories} kcal</p>
                    <p><strong>Goal:</strong> ${appData.dailyStats.calorieGoal} kcal</p>
                    <p><strong>Remaining:</strong> ${appData.dailyStats.calorieGoal - appData.dailyStats.calories} kcal</p>
                    <hr style="margin: 15px 0;">
                    <p><strong>From Protein:</strong> ${appData.dailyStats.protein * 4} kcal</p>
                    <p><strong>From Carbs:</strong> ${appData.dailyStats.carbs * 4} kcal</p>
                    <p><strong>From Fat:</strong> ${appData.dailyStats.fat * 9} kcal</p>
                </div>
            `
        },
        goal: {
            title: 'Daily Goal Progress',
            content: `
                <div style="text-align: left;">
                    <p>You're ${Math.round((appData.dailyStats.calories / appData.dailyStats.calorieGoal) * 100)}% towards your daily calorie goal!</p>
                    <p><strong>Target:</strong> ${appData.dailyStats.calorieGoal} kcal</p>
                    <p><strong>Consumed:</strong> ${appData.dailyStats.calories} kcal</p>
                    <p><strong>Remaining:</strong> ${appData.dailyStats.calorieGoal - appData.dailyStats.calories} kcal</p>
                </div>
            `
        },
        protein: {
            title: 'Protein Intake',
            content: `
                <div style="text-align: left;">
                    <p><strong>Current:</strong> ${appData.dailyStats.protein}g</p>
                    <p><strong>Recommended:</strong> 150g (daily goal)</p>
                    <p><strong>Calories from protein:</strong> ${appData.dailyStats.protein * 4} kcal</p>
                    <p><strong>% of total calories:</strong> ${Math.round((appData.dailyStats.protein * 4 / appData.dailyStats.calories) * 100)}%</p>
                </div>
            `
        },
        fat: {
            title: 'Fat Intake',
            content: `
                <div style="text-align: left;">
                    <p><strong>Current:</strong> ${appData.dailyStats.fat}g</p>
                    <p><strong>Recommended:</strong> 70g (daily goal)</p>
                    <p><strong>Calories from fat:</strong> ${appData.dailyStats.fat * 9} kcal</p>
                    <p><strong>% of total calories:</strong> ${Math.round((appData.dailyStats.fat * 9 / appData.dailyStats.calories) * 100)}%</p>
                </div>
            `
        }
    };
    
    const detail = details[type];
    document.getElementById('modalTitle').textContent = detail.title;
    document.getElementById('modalBody').innerHTML = detail.content;
    showModal('detailModal');
}

// Settings Functions
function showSettings(setting) {
    const settings = {
        personal: {
            title: 'Personal Information',
            content: 'Manage your profile, age, height, weight, and activity level.'
        },
        goals: {
            title: 'Daily Goals',
            content: 'Set your calorie, protein, carb, and fat targets based on your fitness goals.'
        },
        notifications: {
            title: 'Notifications',
            content: 'Configure meal reminders, goal achievements, and app notifications.'
        },
        privacy: {
            title: 'Privacy & Security',
            content: 'Manage your data privacy settings and account security options.'
        },
        help: {
            title: 'Help & Support',
            content: 'Find answers to common questions or contact our support team.'
        },
        about: {
            title: 'About NutriLens',
            content: 'NutriLens v2.1.0 - Smart nutrition tracking powered by AI food recognition.'
        }
    };
    
    const settingInfo = settings[setting];
    document.getElementById('modalTitle').textContent = settingInfo.title;
    document.getElementById('modalBody').innerHTML = `<p>${settingInfo.content}</p>`;
    showModal('detailModal');
}

// Modal Functions
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
        font-size: 14px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Auto-update calories simulation
setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const randomCalories = Math.floor(Math.random() * 50) + 10;
        appData.dailyStats.calories += randomCalories;
        updateStats();
        updateProgressBar();
    }
}, 30000);

// Touch feedback for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.matches('.camera-button, .floating-add, .nav-item, .btn, .stat-card, .meal-card')) {
        e.target.style.transform = e.target.style.transform.replace('scale(1)', '') + ' scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.matches('.camera-button, .floating-add, .nav-item, .btn, .stat-card, .meal-card')) {
        setTimeout(() => {
            e.target.style.transform = e.target.style.transform.replace(' scale(0.95)', '');
        }, 150);
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Prevent form submission
document.getElementById('foodForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addFood();
});

// On page load, update profile info from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('nutrilens_username');
    if (username) {
        const profileNameElem = document.querySelector('.profile-name');
        if (profileNameElem) {
            profileNameElem.textContent = username;
        }
        // You can add more profile info updates here if needed
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('nutrilens_logged_in');
    localStorage.removeItem('nutrilens_username');
    window.location.href = 'login/login.html';
}
