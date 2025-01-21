// Function to search for player across servers
async function searchPlayer() {
    const playerName = document.getElementById('playerName').value.trim().toLowerCase();

    if (!playerName) {
        return;
    }

    // Clear previous results
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    try {
        // Fetch server data
        setStatus("Fetching servers", "busy")
        const response = await fetch('/api/mp/get_servers');
        if (!response.ok) {
            throw new Error('Failed to fetch server data');
        }

        const servers = await response.json();

        let foundPlayers = [];

        setStatus("Searching for player", "busy");
        // Loop through servers and check for the player
        servers.forEach(server => {
            const players = server.playerslist.split(';');

            if (players.includes(playerName)) {
                foundPlayers.push({
                    serverName: server.sname,
                    serverIp: server.ip,
                    serverPort: server.port,
                    location: server.location
                });
            }
        });

        // If no players found, show a message
        if (foundPlayers.length === 0) {
            resultsContainer.innerHTML = '<p>No servers found with that player.</p>';
        } else {
            // Display the results
            foundPlayers.forEach(player => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');
                resultItem.innerHTML = `
                    <p><strong>Server Name:</strong> ${applyTextStyle(player.serverName)}</p>
                    <p><strong>Location:</strong> ${player.location}</p>
                    <p><strong>IP:</strong> ${player.serverIp}:${player.serverPort}</p>
                `;
                resultsContainer.appendChild(resultItem);
            });

        }

        setStatus("Done")
    } catch (error) {
        console.error('Error:', error);
        setStatus('An error occurred while searching for the player.', "error");
    }

    setTimeout(() => {
        setStatus()
    }, 5000);
}

// Attach event listener to the search button
document.getElementById('searchButton').addEventListener('click', searchPlayer);
