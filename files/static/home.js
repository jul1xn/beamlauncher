function applyTextStyle(text) {
    // Define the styles for each symbol
    const styles = {
        '^r': 'reset',
        '^p': '<br>', // New line for descriptions
        '^n': 'underline',
        '^l': 'font-weight: bold',
        '^m': 'text-decoration: line-through',
        '^o': 'font-style: italic',
        '^0': 'color: black',
        '^1': 'color: blue',
        '^2': 'color: green',
        '^3': 'color: lightblue',
        '^4': 'color: red',
        '^5': 'color: pink',
        '^6': 'color: orange',
        '^7': 'color: grey',
        '^8': 'color: darkgrey',
        '^9': 'color: purple',
        '^a': 'color: lightgreen',
        '^b': 'color: lightblue',
        '^c': 'color: darkorange',
        '^d': 'color: lightpink',
        '^e': 'color: yellow',
        '^f': 'color: white'
    };

    // Regular expression to match symbols and text following them
    let regex = /(\^([a-z0-9]))(.*?)(?=\^|$)/g;

    text = text.replace(regex, (match, prefix, symbol, content) => {
        // Handle the special symbol and replace it with the correct style
        if (styles[`^${symbol}`]) {
            const style = styles[`^${symbol}`];
            if (style === 'reset') {
                return content; // Reset, just return content without style
            }
            return `<span style="${style}">${content}</span>`;
        }
        return match; // If no style is found, return the original match
    });

    return text;
}

document.getElementById("btn-start-local").addEventListener("click", function() {
    fetch("/api/beam/launch_local")
    .then((response) => {
        if (response.ok) {
            appendAlert("BeamNG.Drive started successfully!", "success");
        } else {
            appendAlert("Failed to start BeamNG.Drive!", "danger");
        }
    })
    .catch((error) => {
        appendAlert("Failed to send startup request, please check the console for further information.", "danger");
        console.error("Fetch error:", error);
    });
});

document.getElementById("btn-start-steam").addEventListener("click", function() {
    fetch("/api/beam/launch_steam")
    .then((response) => {
        if (response.ok) {
            appendAlert("BeamNG.Drive started successfully!", "success");
        } else {
            appendAlert("Failed to start BeamNG.Drive!", "danger");
        }
    })
    .catch((error) => {
        appendAlert("Failed to send startup request, please check the console for further information.", "danger");
        console.error("Fetch error:", error);
    });
});

document.getElementById("btn-start-multiplayer").addEventListener("click", function() {
    fetch("/api/beam/launch_mp")
    .then((response) => {
        if (response.ok) {
            appendAlert("BeamNG.Drive started successfully!", "success");
        } else {
            appendAlert("Failed to start BeamNG.Drive!", "danger");
        }
    })
    .catch((error) => {
        appendAlert("Failed to send startup request, please check the console for further information.", "danger");
        console.error("Fetch error:", error);
    });
});