document.getElementById("fetch-alerts").addEventListener("click", fetchWeatherAlerts);

async function fetchWeatherAlerts() {
    const input = document.getElementById("state-input");
    const stateInput = input.value.toUpperCase().trim();
    const display = document.getElementById("alerts-display");
    const errorDiv = document.getElementById("error-message");

    // Reset UI
    display.innerHTML = "";
    errorDiv.classList.add("hidden");
    errorDiv.textContent = "";

    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${stateInput}`);
        
        if (!response.ok) {
            throw new Error("Network failure");
        }

        const data = await response.json();
        const alerts = data.features;

        // Requirement: Clear input field after a successful fetch call
        input.value = "";

        // Requirement: Display a count header
        const countHeader = document.createElement("h2");
        countHeader.textContent = `Weather Alerts: ${alerts.length}`;
        display.appendChild(countHeader);

        renderAlerts(alerts);
    } catch (error) {
        // Requirement: Display the specific error message (e.g., "Network failure")
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    }
}

function renderAlerts(alerts) {
    const display = document.getElementById("alerts-display");
    
    alerts.forEach(alert => {
        const alertBox = document.createElement("div");
        
        // Ensure we are pulling the right properties from the NWS API structure
        const title = alert.properties.headline || "No Headline";
        const severity = alert.properties.severity || "Unknown";
        const description = alert.properties.description || "No description provided.";

        alertBox.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Severity:</strong> ${severity}</p>
            <p>${description}</p>
        `;
        display.appendChild(alertBox);
    });
}