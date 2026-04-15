<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>National Safety Awareness - Weather Monitor</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f0f2f5;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        input {
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            flex-grow: 1;
            font-size: 1rem;
        }
        button {
            padding: 12px 24px;
            background-color: #004a99;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover { background-color: #003366; }
        
        #statusMessage h3 {
            color: #333;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        ul { list-style-type: none; padding: 0; }
        li {
            background: #fff;
            border: 1px solid #e0e0e0;
            margin-bottom: 8px;
            padding: 15px;
            border-left: 6px solid #ffcc00; /* Warning yellow */
            border-radius: 4px;
        }
        .error-text { color: #d9534f; font-weight: bold; }
    </style>
</head>
<body>

<div class="container">
    <h1>Weather Safety Monitor</h1>
    <p>Enter a U.S. State abbreviation to fetch live alerts from the NWS.</p>
    
    <div class="search-box">
        <input type="text" id="stateInput" placeholder="e.g. MN, TX, CA" maxlength="2">
        <button id="searchBtn">Fetch Alerts</button>
    </div>

    <div id="statusMessage"></div>
    <div id="alertResults"></div>
</div>

<script>
    // --- EVENT LISTENER ---
    // This triggers the process when the button is clicked
    document.getElementById('searchBtn').addEventListener('click', async () => {
        const state = document.getElementById('stateInput').value;
        const data = await fetchWeatherAlerts(state);
        if (data) {
            displayAlerts(data, state);
        }
    });

    // --- LOGIC FUNCTION: Fetch Data ---
    async function fetchWeatherAlerts(stateAbbr) {
        const STATE_ABBR = stateAbbr.toUpperCase().trim();
        const statusContainer = document.getElementById('statusMessage');
        const resultsContainer = document.getElementById('alertResults');

        if (STATE_ABBR.length !== 2) {
            statusContainer.innerHTML = '<p class="error-text">Please enter a valid 2-letter state abbreviation.</p>';
            resultsContainer.innerHTML = '';
            return null;
        }

        try {
            const response = await fetch(`https://api.weather.gov/alerts/active?area=${STATE_ABBR}`);
            
            if (!response.ok) {
                console.log(`API Error: Received status ${response.status}`);
                statusContainer.innerHTML = `<p class="error-text">Service Error: Could not find data for "${STATE_ABBR}".</p>`;
                return null;
            }

            const data = await response.json();
            console.log(`Successfully retrieved alerts for ${STATE_ABBR}:`, data);
            return data;

        } catch (error) {
            console.log("Network Error:", error.message);
            statusContainer.innerHTML = '<p class="error-text">Network Error: Unable to connect to the National Weather Service.</p>';
            return null;
        }
    }

    // --- UI FUNCTION: Display Data ---
    function displayAlerts(data, state) {
        const resultsContainer = document.getElementById('alertResults');
        const statusContainer = document.getElementById('statusMessage');

        // Clear existing content
        resultsContainer.innerHTML = '';
        
        const alerts = data.features;
        const alertCount = alerts.length;
        const stateUpper = state.toUpperCase().trim();

        // Summary Message using the 'title' property isn't always state-specific in the JSON root, 
        // so we'll build the one requested using the alert count.
        statusContainer.innerHTML = `<h3>Current watches, warnings, and advisories for ${stateUpper}: ${alertCount}</h3>`;

        if (alertCount === 0) {
            resultsContainer.innerHTML = '<p>No active alerts for this state at this time.</p>';
            return;
        }

        const list = document.createElement('ul');

        alerts.forEach(alert => {
            const listItem = document.createElement('li');
            // Accessing properties.headline as requested
            listItem.textContent = alert.properties.headline;
            list.appendChild(listItem);
        });

        resultsContainer.appendChild(list);
    }
</script>

</body>
</html>