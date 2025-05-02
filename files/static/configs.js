async function fetchConfigsList() {
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

        const configListContainer = document.getElementById('configList');
        configListContainer.innerHTML = ''; // Clear any existing content

        // Iterate over each folder and its configs
        Object.entries(groupedConfigs).forEach(([folder, configs]) => {
            // Create a section for the folder
            const folderSection = document.createElement('div');
            folderSection.classList.add('accordion-item');
            folderSection.classList.add('accordion-flush');
            
            folderSection.innerHTML = `
            <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${folder}" aria-expanded="false" aria-controls="flush-collapseOne">
            ${folder}
            </button>
            </h2>
            <div id="flush-collapse${folder}" class="accordion-collapse collapse show" data-bs-parent="#configList">
            <div class="accordion-body"></div>
            </div>
            `;
            
            const folderBody = folderSection.querySelector(".accordion-body");
            folderBody.style = "display: flex; flex-wrap: wrap; gap: 1rem;";

            // Add each config under this folder
            configs.forEach(config => {
                const { name } = config;
                const thumbnailUrl = `/api/config/get_thumbnail?config_name=${encodeURIComponent(name)}&config_folder=${encodeURIComponent(folder)}`;

                const configElement = document.createElement('div');
                configElement.classList.add('card');
                configElement.style.width = "22rem";
                configElement.innerHTML = `
                    <img src="${thumbnailUrl}" alt="Thumbnail for ${name}" class="card-img-top">
                    <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <button class="btn btn-primary" data-name="${name}" data-folder="${folder}">Export config</button>
                    </div>
                `;

                // Add the config element to the folder section
                folderBody.appendChild(configElement);

                const thumbnailImg = configElement.querySelector(".card-img-top");
                thumbnailImg.addEventListener("click", () => {
                    window.open(thumbnailUrl);
                });

                // Add event listener for the copy button
                const copyButton = configElement.querySelector('.btn.btn-primary');
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
    } catch (error) {
        console.error("An error occurred while fetching the config list:", error);
        appendAlert("Error whilst fetching!", "danger");
    }
}

function uploadAndImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".blce";
    input.style.display = "none";

    input.addEventListener("change", async function () {
        if (input.files.length === 0) return;

        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/config/import", {
                method: "POST",
                body: formData
            });

            const result = await response.text();
            alert("Imported config!");
            location.reload();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed!");
        }
    });

    // Trigger the file input dialog
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

document.getElementById("importConfig").addEventListener("click", function() {uploadAndImport()})
fetchConfigsList()