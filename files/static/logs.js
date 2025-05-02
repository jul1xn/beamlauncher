const logtext = document.getElementById("logText");

async function fetchLogs() {
    try {
        // Fetch the logs from the API endpoint
        const response = await fetch('/api/logs');

        // Check if the response is OK
        if (!response.ok) {
            appendAlert(`Error fetching logs: ${response.status} ${response.statusText}`, "danger");
            throw new Error(`Error fetching logs: ${response.status} ${response.statusText}`);
        }

        // Parse the response as JSON
        const logs = await response.text();

        // Replace newlines with <br> tags
        const formattedLogs = logs.replace(/\n/g, '<br>');

        // Set the formatted logs to innerHTML to render them with newlines
        logtext.innerHTML = formattedLogs;


    } catch (error) {
        // Handle errors (e.g., network issues or server errors)
        console.error("An error occurred while fetching logs:", error);
    }
}

document.getElementById("refresh").addEventListener("click", fetchLogs);

fetchLogs();
setInterval(fetchLogs, 5000);