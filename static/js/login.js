// ============================================
// SENTINEL AI
// Login & Authentication Controller
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }

    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const toggleIcon = document.getElementById("toggle-icon");

    const loginBtn = document.getElementById("login-btn");
    const btnText = document.getElementById("btn-text");
    const btnIcon = document.getElementById("btn-icon");
    const btnSpinner = document.getElementById("btn-spinner");

    const alertBox = document.getElementById("login-alert");
    const alertMessage = document.getElementById("alert-message");
    const rememberCheckbox = document.getElementById("remember");

    // ============================================
    // Password Visibility Toggle
    // ============================================
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.getAttribute("type") === "password";
            
            passwordInput.setAttribute("type", isPassword ? "text" : "password");

            if (toggleIcon) {
                toggleIcon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    // ============================================
    // Form Submission Handler (AJAX)
    // ============================================
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = usernameInput ? usernameInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value : "";
            const remember = rememberCheckbox ? rememberCheckbox.checked : false;

            if (!username || !password) {
                showAlert("Please enter both username and password.");
                return;
            }

            hideAlert();
            setLoadingState(true);

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                        remember: remember
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setSuccessState();
                    showLoginToast("Authentication successful! Redirecting...", "success");

                    // Use location.replace for immediate, clean browser history navigation
                    setTimeout(() => {
                        window.location.replace(data.redirect || "/dashboard");
                    }, 400);
                } else {
                    setLoadingState(false);
                    showAlert(data.error || "Invalid username or password.");
                    shakeCard();
                }

            } catch (err) {
                console.error("Login request failed:", err);
                setLoadingState(false);
                showAlert("Unable to connect to authentication server.");
                shakeCard();
            }
        });
    }

    // ============================================
    // Alert & State Helper Functions
    // ============================================
    function showAlert(msg) {
        if (alertBox && alertMessage) {
            alertMessage.textContent = msg;
            alertBox.classList.add("show");
        }
    }

    function hideAlert() {
        if (alertBox) {
            alertBox.classList.remove("show");
        }
    }

    function setLoadingState(isLoading) {
        if (!loginBtn) return;

        if (isLoading) {
            loginBtn.disabled = true;
            if (btnText) btnText.textContent = "Authenticating...";
            if (btnIcon) btnIcon.classList.add("hidden");
            if (btnSpinner) btnSpinner.classList.remove("hidden");
        } else {
            loginBtn.disabled = false;
            if (btnText) btnText.textContent = "Sign In";
            if (btnIcon) btnIcon.classList.remove("hidden");
            if (btnSpinner) btnSpinner.classList.add("hidden");
        }
    }

    function setSuccessState() {
        if (!loginBtn) return;
        loginBtn.disabled = true;
        loginBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        if (btnText) btnText.textContent = "Authenticated ✓";
        if (btnIcon) btnIcon.classList.add("hidden");
        if (btnSpinner) btnSpinner.classList.add("hidden");
    }

    function shakeCard() {
        const card = document.querySelector(".login-card");
        if (card) {
            card.style.animation = "none";
            card.offsetHeight; // trigger reflow
            card.style.animation = "shake 0.4s ease";
        }
    }

    // Self-contained login page toast notification system
    function showLoginToast(message, type = "info") {
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
        }, 2500);
    }

});

// Inject keyframe animation for shake effect dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-8px); }
    40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(styleSheet);