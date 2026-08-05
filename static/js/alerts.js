const alertsTable =
    document.getElementById("alerts-table");

const alertCount =
    document.getElementById("alert-count");

async function loadAlerts() {

    try {

        const response = await fetch("/api/alerts");

        const data = await response.json();

        alertsTable.innerHTML = "";

        data.forEach(alert => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${alert.time}</td>
                <td>${alert.name}</td>
                <td>${alert.type}</td>
                <td>${alert.severity}</td>
                <td>${alert.score}</td>
            `;

            alertsTable.appendChild(row);

        });

        // Update alert count
        if (alertCount) {
            alertCount.textContent = data.length;
        }

        
        updateTimeline(data);

    } catch (err) {

        console.error("loadAlerts:", err);

    }

}