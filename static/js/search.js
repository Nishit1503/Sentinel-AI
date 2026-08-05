// ============================================
// SENTINEL AI
// Event Search
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("search.js loaded");

    const searchInput = document.getElementById("event-search");
    const alertsTable = document.getElementById("alerts-table");

    console.log("searchInput:", searchInput);
    console.log("alertsTable:", alertsTable);

    if (!searchInput || !alertsTable) {
        console.log("Search input or alerts table not found.");
        return;
    }

    searchInput.addEventListener("input", async () => {

        const keyword = searchInput.value.trim();

        console.log("Searching:", keyword);

        // Restore all alerts when search is empty
        if (keyword === "") {
            loadAlerts();
            return;
        }

        try {

            const response = await fetch(
                `/api/events/search?q=${encodeURIComponent(keyword)}`
            );

            if (!response.ok) {
                throw new Error("Search request failed");
            }

            const results = await response.json();

            console.log("Results:", results);

            alertsTable.innerHTML = "";

            if (results.length === 0) {

                alertsTable.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align:center;padding:20px;">
                            No matching events found
                        </td>
                    </tr>
                `;

                return;
            }

            results.forEach(event => {

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${event.time || "-"}</td>
                    <td>${event.file || event.name || "-"}</td>
                    <td>${event.event_type || event.type || "-"}</td>
                    <td>${severityBadge(event.severity || "LOW")}</td>
                    <td>${event.score ?? "-"}</td>
                `;

                alertsTable.appendChild(row);

            });

        }

        catch (error) {

            console.error("Search Error:", error);

            alertsTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center;color:red;padding:20px;">
                        Unable to perform search
                    </td>
                </tr>
            `;

        }

    });

});