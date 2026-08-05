// ============================================
// SENTINEL AI
// Network Monitor
// ============================================

const networkContainer =
    document.getElementById("network-list");

const connectionCount =
    document.getElementById("connection-count");

async function loadNetwork() {

    try {

        const response = await fetch("/api/network");

        if (!response.ok) {
            throw new Error("Failed to load network connections");
        }

        const connections = await response.json();

        networkContainer.innerHTML = "";

        animateCounter(
    connectionCount,
    connections.length
);

const networkConnectionCount =
    document.getElementById("network-connection-count");

animateCounter(
    networkConnectionCount,
    connections.length
);

        if (connections.length === 0) {

            networkContainer.innerHTML = `
                <div class="empty-state">
                    No active network connections
                </div>
            `;

            return;
        }

        connections.slice(0, 20).forEach(connection => {

            const item = document.createElement("div");

            item.className = "network-item";

            item.innerHTML = `
                <span>${escapeHtml(connection.process)}</span>
                <span>${escapeHtml(connection.remote_ip)}</span>
                <span>${connection.remote_port}</span>
                <span>${escapeHtml(connection.status)}</span>
            `;

            networkContainer.appendChild(item);

        });

    }

    catch (error) {

        console.error("Network Monitor:", error);

        networkContainer.innerHTML = `
            <div class="empty-state">
                Unable to load network connections
            </div>
        `;

    }

}