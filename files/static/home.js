function setStatus(message = "Inactive", state = "active") {
    document.getElementById("status").textContent = "Status: " + message;
    var bubble = document.getElementById("statusBubble");
    bubble.classList.replace(bubble.classList[1], state);
}

async function updateKillBtn() {
    var button = document.getElementById("killBeam");
    button.style.display = "none";
    var resp = await fetch("/api/game_running");
    var text = await resp.text();
    var bool = (text === "True");
    console.log(bool);

    if (bool) {
        button.style.display = "unset";
    }
    else {
        button.style.display = "none";
    }
}

// Function to style text based on special symbols
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

document.getElementById("startBeamLocal").addEventListener("click", function() {
    setStatus("Launching BeamNG locally", "busy");
    fetch("/api/beam/launch_local")
    .then((response) => {
        if (response.ok) {
            setStatus("Launch complete", "active");
            updateKillBtn();
        } else {
            setStatus("Failed to launch BeamNG", "error");
        }
    })
    .catch((error) => {
        setStatus("An error occurred while sending the launch command", "error");
        console.error("Fetch error:", error);
    });

    setTimeout(() => {
        setStatus();
    }, 5000);
});

document.getElementById("startBeamSteam").addEventListener("click", function() {
    setStatus("Launching BeamNG via Steam", "busy");
    fetch("/api/beam/launch_steam")
    .then((response) => {
        if (response.ok) {
            setStatus("Launch complete", "active");
            updateKillBtn();
        } else {
            setStatus("Failed to launch BeamNG", "error");
        }
    })
    .catch((error) => {
        setStatus("An error occurred while sending the launch command", "error");
        console.error("Fetch error:", error);
    });

    setTimeout(() => {
        setStatus();
    }, 5000);
});

document.getElementById("killBeam").addEventListener("click", function() {
    setStatus("Killing BeamNG", "busy");
    fetch("/api/beam/kill")
    .then((response) => {
        if (response.ok) {
            setStatus("Kill success", "active");
            updateKillBtn();
        } else {
            setStatus("Failed to kill BeamNG", "error");
        }
    })
    .catch((error) => {
        setStatus("An error occurred while sending the kill command", "error");
        console.error("Fetch error:", error);
    });

    setTimeout(() => {
        setStatus();
    }, 5000);
});

document.getElementById("startBeamMp").addEventListener("click", function() {
    setStatus("Launching BeamNG multiplayer", "busy");
    fetch("/api/beam/launch_mp")
    .then((response) => {
        if (response.ok) {
            setStatus("Launch complete", "active");
            updateKillBtn();
        } else {
            setStatus("Failed to launch BeamNG", "error");
        }
    })
    .catch((error) => {
        setStatus("An error occurred while sending the launch command", "error");
        console.error("Fetch error:", error);
    });

    setTimeout(() => {
        setStatus();
    }, 5000);
});

updateKillBtn();