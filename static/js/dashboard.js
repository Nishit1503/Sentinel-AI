// ============================================
// SENTINEL AI
// Dashboard & SPA View Router
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize SPA Navigation Router
    initNavigation();

    // Start Live Clock
    startClock();

    // Load initial dashboard telemetry
    loadProcesses();
    loadNetwork();
    loadAlerts();

    // Real-time polling intervals
    setInterval(loadProcesses, 2000);
    setInterval(loadNetwork, 3000);

    // Refresh Dashboard button binding
    const refreshBtn = document.getElementById("refresh-dashboard");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            loadProcesses();
            loadNetwork();
            loadAlerts();
            showToast("Telemetry refreshed", "info");
        });
    }

});

// ============================================
// Single Page View Router
// ============================================

function initNavigation() {

    const navLinks = document.querySelectorAll(".sidebar .nav a, .sidebar .nav-link");
    const pageViews = document.querySelectorAll(".page-view");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    const pageMetaData = {
        "#overview": {
            title: "Dashboard",
            subtitle: "Real-time Security Monitoring Overview"
        },
        "#processes": {
            title: "Process Monitor",
            subtitle: "Active System Processes & Threat Scores"
        },
        "#network": {
            title: "Network Monitor",
            subtitle: "Live Outbound Network Sockets & Remote IPs"
        },
        "#file-scanner": {
            title: "File & Directory Scanner",
            subtitle: "Folder Risk Inspection & Malicious File Detection"
        },
        "#alerts": {
            title: "Live Events Stream",
            subtitle: "Real-time Security Telemetry & Audit Logs"
        },
        "#analytics": {
            title: "Security Analytics",
            subtitle: "Historical Threat Trends & Score Distribution"
        },
        "#settings": {
            title: "Application Settings",
            subtitle: "System Preferences & Monitoring Configuration"
        }
    };

    function activateView(targetHash) {

        const hash = targetHash || window.location.hash || "#overview";

        // Extract ID (e.g. "overview", "processes")
        const pageId = hash.replace("#", "");

        let targetPage = document.getElementById(pageId);

        if (!targetPage) {
            targetPage = document.getElementById("overview");
        }

        // Hide all views
        pageViews.forEach(view => view.classList.remove("active"));

        // Remove active link styling
        navLinks.forEach(link => link.classList.remove("active"));

        // Activate target view
        if (targetPage) {
            targetPage.classList.add("active");
        }

        // Highlight active nav link
        const activeLink = document.querySelector(`.sidebar .nav a[href="${hash}"], .sidebar .nav-link[href="${hash}"]`);

        if (activeLink) {
            activeLink.classList.add("active");
        }

        // Update topbar headers
        if (pageMetaData[hash]) {

            if (pageTitle) pageTitle.textContent = pageMetaData[hash].title;

            if (pageSubtitle) pageSubtitle.textContent = pageMetaData[hash].subtitle;

        }

        // Re-trigger Lucide icon rendering for dynamically shown elements
        if (window.lucide) {
            lucide.createIcons();
        }

        // Smooth scroll content area to top
        const mainContent = document.querySelector("main.content");

        if (mainContent) {
            mainContent.scrollTop = 0;
        }

    }

    // Attach click listeners to sidebar links
    navLinks.forEach(link => {

        link.addEventListener("click", (e) => {

            const href = link.getAttribute("href");

            if (href && href.startsWith("#")) {

                e.preventDefault();

                window.location.hash = href;

                activateView(href);

            }

        });

    });

    // Listen to hash changes (browser back/forward)
    window.addEventListener("hashchange", () => {
        activateView(window.location.hash);
    });

    // Initial page set based on hash
    activateView(window.location.hash);

}

// ============================================
// Real-time Clock
// ============================================

function startClock() {

    const clockElem = document.getElementById("current-time");

    function update() {

        if (!clockElem) return;

        const now = new Date();

        clockElem.textContent = now.toLocaleTimeString();

    }

    update();

    setInterval(update, 1000);

}

// ============================================
// Process List Client Filter Helper
// ============================================

function filterProcessList() {

    const input = document.getElementById("process-filter-input");

    if (!input) return;

    const filter = input.value.toLowerCase();

    const processItems = document.querySelectorAll("#process-list .process-item");

    processItems.forEach(item => {

        const text = item.textContent.toLowerCase();

        if (text.includes(filter)) {

            item.style.display = "flex";

        } else {

            item.style.display = "none";

        }

    });

}

// ============================================
// Loading Screen Animation
// ============================================

window.addEventListener("load", () => {

    const loadingScreen = document.getElementById("loading-screen");
    const progressFill = document.getElementById("progress-fill");
    const progressPercent = document.getElementById("progress-percent");
    const loadingText = document.getElementById("loading-text");

    if (!loadingScreen || !progressFill || !progressPercent) return;

    const messages = [
        "Initializing Security Modules...",
        "Loading Threat Telemetry Engine...",
        "Starting Process Monitor...",
        "Establishing Network Watcher...",
        "Launching Sentinel AI Desktop..."
    ];

    let progress = 0;

    let messageIndex = 0;

    const timer = setInterval(() => {

        progress += 10;

        progressFill.style.width = progress + "%";

        progressPercent.textContent = progress + "%";

        if (progress % 20 === 0 && messageIndex < messages.length - 1) {

            messageIndex++;

            if (loadingText) {
                loadingText.textContent = messages[messageIndex];
            }

        }

        if (progress >= 100) {

            clearInterval(timer);

            loadingScreen.style.transition = "opacity 0.5s ease";

            loadingScreen.style.opacity = "0";

            setTimeout(() => {

                loadingScreen.style.display = "none";

            }, 500);

        }

    }, 50);

});

// ============================================
// Toast Notification System
// ============================================

function showToast(message, type = "info") {

    const container = document.getElementById("toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateX(120%)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}