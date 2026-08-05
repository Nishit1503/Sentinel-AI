// ============================================
// SENTINEL AI
// File Scanner Module
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const folderInput = document.getElementById("folder-path");
    const suggestionBox = document.getElementById("folder-suggestions");
    const scanBtn = document.getElementById("scan-folder-btn");
    const browseBtn = document.getElementById("browse-folder-btn");

    if (scanBtn) {
        scanBtn.addEventListener("click", scanFolder);
    }

    if (browseBtn && folderInput) {
        browseBtn.addEventListener("click", () => {
            if (!folderInput.value) {
                folderInput.value = "./monitored";
            }
            loadFolderSuggestions();
        });
    }

    if (folderInput) {
        folderInput.addEventListener("input", loadFolderSuggestions);
    }

    async function scanFolder() {

        const table = document.getElementById("file-results");

        if (!folderInput || !table) return;

        const folder = folderInput.value.trim();

        if (folder === "") {
            showToast("Please enter a folder path.", "warning");
            return;
        }

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state-row">Scanning directory contents...</td>
            </tr>
        `;

        try {

            const response = await fetch("/api/scan-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    folder: folder
                })
            });

            const data = await response.json();

            if (!data.success) {

                table.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state-row" style="color: var(--danger);">${data.error}</td>
                    </tr>
                `;

                return;
            }

            if (data.files.length === 0) {

                table.innerHTML = `
                    <tr>
                        <td colspan="4" class="empty-state-row">No files found in directory.</td>
                    </tr>
                `;

                document.getElementById("safe-count").textContent = 0;
                document.getElementById("suspicious-count").textContent = 0;
                document.getElementById("critical-count").textContent = 0;

                return;
            }

            let html = "";

            let safe = 0;
            let suspicious = 0;
            let critical = 0;

            data.files.forEach(file => {

                if (file.status === "Safe")
                    safe++;
                else if (file.status === "Suspicious")
                    suspicious++;
                else if (file.status === "Critical")
                    critical++;

                let badgeClass = "badge-low";
                if (file.status === "Suspicious") badgeClass = "badge-high";
                if (file.status === "Critical") badgeClass = "badge-critical";

                html += `
                    <tr>
                        <td><strong>${file.name}</strong></td>
                        <td>${file.extension || "-"}</td>
                        <td>${file.size}</td>
                        <td><span class="${badgeClass}">${file.icon || "📄"} ${file.status}</span></td>
                    </tr>
                `;

            });

            table.innerHTML = html;

            document.getElementById("safe-count").textContent = safe;
            document.getElementById("suspicious-count").textContent = suspicious;
            document.getElementById("critical-count").textContent = critical;

            showToast(`Scan complete: ${data.files.length} files analyzed`, "success");

        } catch (error) {

            table.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state-row" style="color: var(--danger);">Unable to scan folder.</td>
                </tr>
            `;

            document.getElementById("safe-count").textContent = 0;
            document.getElementById("suspicious-count").textContent = 0;
            document.getElementById("critical-count").textContent = 0;

            console.error(error);

        }

    }

    async function loadFolderSuggestions() {

        if (!folderInput || !suggestionBox) return;

        const query = folderInput.value.trim();

        if (query.length < 2) {
            suggestionBox.innerHTML = "";
            return;
        }

        try {

            const response = await fetch(
                `/api/folder-suggestions?q=${encodeURIComponent(query)}`
            );

            const data = await response.json();

            suggestionBox.innerHTML = "";

            if (!data.success || !data.folders || data.folders.length === 0) {
                return;
            }

            data.folders.forEach(folder => {

                const item = document.createElement("div");

                item.className = "folder-item";
                item.textContent = "📁 " + folder;

                item.onclick = () => {
                    folderInput.value = folder;
                    suggestionBox.innerHTML = "";
                };

                suggestionBox.appendChild(item);

            });

        } catch (err) {
            console.error(err);
        }

    }

});