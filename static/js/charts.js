// ============================================
// SENTINEL AI
// Threat Timeline Chart
// ============================================

let timelineChart = null;

function updateTimeline(alerts) {

    const canvas =
        document.getElementById("timelineChart");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    const recentAlerts = alerts
    .slice(-10)
    .reverse();

const labels = recentAlerts.map(a => a.time);

const scores = recentAlerts.map(a => parseInt(a.score, 10));
    // ============================================
    // Statistics
    // ============================================

    const highest =
        scores.length ? Math.max(...scores) : 0;

    const average =
        scores.length
            ? (
                scores.reduce((a, b) => a + b, 0)
                / scores.length
              ).toFixed(1)
            : 0;

    const total =
        alerts.length;

    document.getElementById("highest-score").textContent =
        highest;

    document.getElementById("average-score").textContent =
        average;

    document.getElementById("total-events").textContent =
        total;

    // ============================================
    // Destroy old chart
    // ============================================

    if (timelineChart) {

        timelineChart.destroy();

    }

    // ============================================
    // Create chart
    // ============================================

    timelineChart = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [

                {

                    label: "Threat Score",

                    data: scores,

                    borderColor: "#2563eb",

                    backgroundColor:
                        "rgba(37,99,235,.12)",

                    borderWidth: 3,

                    tension: .35,

                    fill: true,

                    pointRadius: 4,

                    pointHoverRadius: 6

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 600

            },

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                x: {

                    grid: {

                        display: false

                    }

                },

                y: {

                    beginAtZero: true,

                    ticks: {

                        stepSize: 20

                    },

                    grid: {

                        color: "#eef2f7"

                    }

                }

            }

        }

    });

}