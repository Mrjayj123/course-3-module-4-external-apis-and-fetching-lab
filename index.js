// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>State Safety Alert Monitor</title>
    <style>
        :root {
            --primary: #003366;
            --danger: #d9534f;
            --light: #f4f4f9;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--light);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .container {
            max-width: 800px;
            width: 100%;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            flex-grow: 1;
            text-transform: uppercase;
        }

        button {
            padding: 10px 20px;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover { opacity: 0.9; }

        .alert-card {
            border-left: 5px solid var(--danger);
            background: #fff5f5;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 4px;
        }

        .status { margin-top: 10px; font-weight: bold; }
        .error { color: var(--danger); }
        .loading { color: #666; font-style: italic; }
    </style>
</head>
<body>

<div class="container">
    <h2>State Weather Alert Monitor</h2>
    <p>Enter a 2-letter state code (e.g., TX, CA, NY) to see active alerts.</p>
    
    <div class="controls">
        <input type="text" id="stateInput" placeholder="Enter State Code" maxlength="2">
        <button onclick="fetchAlerts()">Get Alerts</button>
    </div>

    <div id="statusMessage" class="status"></div>
    <div id="alertResults"></div>
</div>

<script>
   async function fetchWeatherAlerts(stateAbbr) {
    const STATE_ABBR = stateAbbr.toUpperCase().trim();

    if (STATE_ABBR.length !== 2) {
        console.log("Invalid input: Please provide a 2-letter state abbreviation.");
        return;
    }

    try {
        const response = await fetch(`https://api.weather.gov/alerts/active?area=${STATE_ABBR}`);

        if (!response.ok) {
            console.log(`API Error: Received status ${response.status} for state ${STATE_ABBR}`);
            return;
        }

        const data = await response.json();
        console.log(`Successfully retrieved alerts for ${STATE_ABBR}:`, data);
        return data; // Return it so the UI part can use it!

    } catch (error) {
        console.log("Network Error: Failed to reach the NWS API.", error.message);
    }
}

// --- 2. THE UI PART (Where it "fits" in your app) ---
// This function bridges the gap between the user clicking a button and your logic running.
async function handleSearchClick() {
    const userInput = document.getElementById('stateInput').value;
    
    // Call your function and store the result
    const alertData = await fetchWeatherAlerts(userInput);
    
    if (alertData) {
        // This is where we will eventually write code to 
        // loop through alertData and show it on the screen.
        console.log("We have data! Ready to build the UI.");
    }
}

            // Map and display headlines
            alerts.forEach(item => {
                const { headline, severity, description } = item.properties;
                const card = document.createElement('div');
                card.className = 'alert-card';
                card.innerHTML = `
                    <strong>${headline}</strong>
                    <p style="font-size: 0.9em; color: #555; margin-top: 8px;">
                        Severity: ${severity}
                    </p>
                `;
                resultsDiv.appendChild(card);
            });

        } catch (error) {
            console.error("Fetch error:", error);
            statusDiv.textContent = "❌ Error: Could not connect to the Weather Service. Please check your connection or try again later.";
            statusDiv.classList.add('error');
        }
    }
</script>

</body>
</html>