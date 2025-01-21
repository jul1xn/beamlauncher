async function fetchConfigsList() {
    setStatus("Loading config list", "busy");
    try {
        const response = await fetch('/api/config/get_all');
        if (!response.ok) {
            throw new Error(`Error fetching config list: ${response.status} ${response.statusText}`);
        }

        const configPaths = await response.json();

        // Parse the configs into objects with name and folder
        const configs = configPaths.map(path => {
            const parts = path.split('\\');
            const fileName = parts.pop();
            const folder = parts.pop();
            const name = fileName.replace('.pc', ''); // Remove extension
            return { name, folder };
        });

        // Group configs by folder
        const groupedConfigs = configs.reduce((acc, config) => {
            const { folder } = config;
            if (!acc[folder]) {
                acc[folder] = [];
            }
            acc[folder].push(config);
            return acc;
        }, {});

        const configListContainer = document.querySelector('.configList');
        configListContainer.innerHTML = ''; // Clear any existing content

        // Iterate over each folder and its configs
        Object.entries(groupedConfigs).forEach(([folder, configs]) => {
            // Create a section for the folder
            const folderSection = document.createElement('div');
            folderSection.classList.add('folderSection');

            const folderHeader = document.createElement('h3');
            folderHeader.textContent = folder;
            folderSection.appendChild(folderHeader);

            // Add each config under this folder
            configs.forEach(config => {
                const { name } = config;
                const thumbnailUrl = `/api/config/get_thumbnail?config_name=${encodeURIComponent(name)}&config_folder=${encodeURIComponent(folder)}`;

                const configElement = document.createElement('div');
                configElement.classList.add('configItem');
                configElement.innerHTML = `
                    <img src="${thumbnailUrl}" alt="Thumbnail for ${name}" class="thumbnail">
                    <label>${name}</label>
                    <button class="copy-name-btn" data-name="${name}" data-folder="${folder}">Export config</button>
                `;

                // Add the config element to the folder section
                folderSection.appendChild(configElement);

                const thumbnailImg = configElement.querySelector(".thumbnail");
                thumbnailImg.addEventListener("click", () => {
                    window.open(thumbnailUrl);
                });

                // Add event listener for the copy button
                const copyButton = configElement.querySelector('.copy-name-btn');
                copyButton.addEventListener('click', async () => {
                    var configName = copyButton.getAttribute('data-name');
                    var configFolder = copyButton.getAttribute('data-folder');

                    var respo = await fetch(`/api/config/export?config_name=${encodeURIComponent(name)}&config_folder=${encodeURIComponent(folder)}`);
                    var file_data = await respo.text()
                    var blob = new Blob([file_data], { type: 'text/plain' });

                    var link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = configFolder + "-" + configName + ".blce";

                    link.click();

                    URL.revokeObjectURL(link.href);
                });
            });

            // Add the folder section to the container
            configListContainer.appendChild(folderSection);
        });

        setStatus("Loaded config list");
    } catch (error) {
        console.error("An error occurred while fetching the config list:", error);
        setStatus("Error whilst fetching!", "error");
    }

    setTimeout(setStatus, 5000);
}

function downloadConfig() {

}

fetchConfigsList()