// Fetch server list and apply styles to names
async function fetchServerList() {
    setStatus("Loading server list", "busy")
    try {
        const response = await fetch('/api/mp/get_servers');
        if (!response.ok) {
            throw new Error(`Error fetching server list: ${response.status} ${response.statusText}`);
        }
        const servers = await response.json();

        // Sort the servers to prioritize official ones at the top
        servers.sort((a, b) => {
            if (a.official && !b.official) return -1; // Official servers first
            if (!a.official && b.official) return 1;
            return a.sname.localeCompare(b.sname); // Then sort alphabetically
        });

        const serverListContainer = document.querySelector('.serverList');
        serverListContainer.innerHTML = ''; // Clear any existing content

        servers.forEach(server => {
            const serverName = applyTextStyle(server.sname);

            // Determine the background color for official servers
            const serverClass = server.official ? 'official-server' : 'normal-server';

            const serverElement = document.createElement('div');
            serverElement.classList.add('server', serverClass);
            serverElement.innerHTML = `
                <label>${serverName}</label>
                <p>Players: ${server.players}/${server.maxplayers}</p>
                <p>Location: ${server.location}</p>
                <p>Map: ${server.map}</p>
                <p>Tags: ${server.tags}</p>
                <button class="copy-ip-btn" data-ip="${server.ip}:${server.port}">Copy IP</button>
            `;

            // Add the server element to the container
            serverListContainer.appendChild(serverElement);

            // Add event listener for the copy button
            const copyButton = serverElement.querySelector('.copy-ip-btn');
            copyButton.addEventListener('click', () => {
                const ipAndPort = copyButton.getAttribute('data-ip');
                copyToClipboard(ipAndPort);
            });

            setStatus("Loaded server list");
        });
    } catch (error) {
        console.error("An error occurred while fetching the server list:", error);
        setStatus("Error whilst fetching!", "error");
    }

    setTimeout(setStatus, 5000);
}

// Function to copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert(`IP copied to clipboard!`);
    }).catch(err => {
        console.error('Error copying to clipboard: ', err);
        alert('Failed to copy IP address.');
    });
}


// Call the function to fetch and display the server list
fetchServerList();