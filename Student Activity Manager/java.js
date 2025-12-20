
let totalHours = 0;
let activities = [];

const nameInput = document.getElementById("activityName");
const hoursInput = document.getElementById("estimatedHours");
const activitiesCountDisplay = document.getElementById("totalActivitiesCount");
const activitiesList = document.getElementById("activitiesList"); // Corrected ID
const addBtn = document.getElementById("addActivityBtn"); // Corrected ID
const totalHoursDisplay = document.getElementById("totalHoursCount"); // Corrected ID


function createActivityCard(name, hours) {
    return {
        name: name,
        hours: hours
    };
}


if (addBtn) { 
    addBtn.addEventListener("click", addActivity);
}


if (activitiesList) { 
    activitiesList.addEventListener('click', handleDeleteClick);
}




function addActivity() {
    
    const name = nameInput.value.trim();
    
    const hours = parseFloat(hoursInput.value); 
    
    
    if (name === "" || isNaN(hours) || hours <= 0) {
        alert("Please enter a valid activity name and hours (must be a number greater than 0).");
        return;
    }

    const newactivity = createActivityCard(name, hours);
    activities.push(newactivity);
    totalHours += hours;

    renderActivities();
    updateStats();

    nameInput.value = "";
    hoursInput.value = "";
}


function renderActivities() {
    
    if (!activitiesList) return; 
    
    activitiesList.innerHTML = "";
    
    activities.forEach((activity, index) => {
        const listItem = document.createElement("li"); // Use <li> for lists
        
        listItem.innerHTML = `
            <span>${activity.name} — ${activity.hours} hrs</span>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        activitiesList.appendChild(listItem);
    });
}

/**
 * Handles the click event on the list for delete buttons.
 * Uses event delegation.
 * @param {Event} e 
 */
function handleDeleteClick(e) {
    
    if (e.target.classList.contains('delete-btn')) {
        
        const indexToDelete = parseInt(e.target.dataset.index);
        deleteActivity(indexToDelete);
    }
}


@param {number} index 
 
function deleteActivity(index) {
    if (index >= 0 && index < activities.length) {
        totalHours -= activities[index].hours; 
        activities.splice(index, 1);         
        
        renderActivities();
        updateStats();
    }
}


function updateStats() {
    
    activitiesCountDisplay.textContent = activities.length;
   
    totalHoursDisplay.textContent = totalHours.toFixed(1); 
}
updateStats();
