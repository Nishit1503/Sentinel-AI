// ============================================
// SENTINEL AI
// Process Monitor
// ============================================

const processContainer =
    document.getElementById("process-list");

const runningCount =
    document.getElementById("running-count");

const processRunningCount =
    document.getElementById("process-running-count");

async function loadProcesses() {

    try {

        const response =
            await fetch("/api/processes");

        if (!response.ok) {

            throw new Error("Failed to load processes");

        }

        const processes =
            await response.json();

            console.log("Process refresh:", processes.length, processes);

        processContainer.innerHTML = "";

        animateCounter(
            runningCount,
            processes.length
        );

        animateCounter(
            processRunningCount,
            processes.length
        );

        if (!processes.length) {

            processContainer.innerHTML = `

                <div class="empty-state">

                    No running processes found.

                </div>

            `;

            return;

        }

        processes.forEach(process => {

            const severity =
                (process.severity || "LOW").toLowerCase();

            const item =
                document.createElement("div");

            item.className =
                "process-item fade-in";

            item.innerHTML = `

                <div class="process-info">

                    <strong>

                        ${escapeHtml(process.name)}

                    </strong>

                    <small>

                        PID : ${process.pid}

                    </small>

                </div>

                <div class="process-score">

                    ${process.score}

                </div>

                <div class="severity-badge ${severity}">

                    ${process.severity}

                </div>

            `;

            processContainer.appendChild(item);

        });

    }

    catch (error) {

        console.error("Process Monitor:", error);

        processContainer.innerHTML = `

            <div class="empty-state">

                Unable to load processes

            </div>

        `;

    }

}