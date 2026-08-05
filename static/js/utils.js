// ============================================
// SENTINEL AI
// Utility Functions
// ============================================

function animateCounter(element, value) {

    if (!element) return;

    const start = parseInt(element.innerText) || 0;
    const duration = 500;
    const startTime = performance.now();

    function update(now) {

        const progress = Math.min(
            (now - startTime) / duration,
            1
        );

        const current = Math.floor(
            start + (value - start) * progress
        );

        element.innerText = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }

    }

    requestAnimationFrame(update);

}


// ============================================
// Severity Badge
// ============================================

function severityBadge(severity) {

    if (!severity) {
        severity = "LOW";
    }

    const level = severity.toUpperCase();

    switch (level) {

        case "CRITICAL":
            return `<span class="badge-critical">Critical</span>`;

        case "HIGH":
            return `<span class="badge-high">High</span>`;

        case "MEDIUM":
            return `<span class="badge-medium">Medium</span>`;

        case "LOW":
            return `<span class="badge-low">Low</span>`;

        default:
            return `<span class="badge-low">${severity}</span>`;

    }

}


// ============================================
// Format Numbers
// ============================================

function formatNumber(number) {

    return Number(number).toLocaleString();

}


// ============================================
// Clear Table
// ============================================

function clearTable(table) {

    if (table) {
        table.innerHTML = "";
    }

}


// ============================================
// Escape HTML
// ============================================

function escapeHtml(text) {

    if (text === null || text === undefined) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}