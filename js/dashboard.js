// ==========================================
// VENDORHUB DASHBOARD
// ==========================================

let salesChartInstance = null;

document.addEventListener("DOMContentLoaded", function () {

    loadDashboardStats();
    loadAnalytics();
    loadRecentSales();
    loadLowStockProducts();

});

function formatMoney(value) {
    var n = Number(value) || 0;
    return "₦" + n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function loadDashboardStats() {

    fetch("../vendorhub-back/dashboard.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(data => {

            document.getElementById("productCount").innerHTML = data.products;
            document.getElementById("customerCount").innerHTML = data.customers;
            document.getElementById("salesCount").innerHTML = formatMoney(data.sales);
            document.getElementById("lowStock").innerHTML = data.lowstock;

        })
        .catch(error => console.log(error));

}

function loadAnalytics() {

    fetch("../vendorhub-back/get_analytics.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(data => {

            document.getElementById("weekThis").textContent = formatMoney(data.weekThis);
            document.getElementById("weekLast").textContent = formatMoney(data.weekLast);

            var changeEl = document.getElementById("weekChange");
            if (data.weekChangePct === null || data.weekChangePct === undefined) {
                changeEl.textContent = "—";
                changeEl.className = "analytics-value";
            } else {
                var pct = Number(data.weekChangePct);
                var sign = pct > 0 ? "+" : "";
                changeEl.textContent = sign + pct + "%";
                changeEl.className = "analytics-value " + (pct > 0 ? "change-up" : (pct < 0 ? "change-down" : ""));
            }

            document.getElementById("stockIn").textContent = data.stock?.in ?? 0;
            document.getElementById("stockLow").textContent = data.stock?.low ?? 0;
            document.getElementById("stockOut").textContent = data.stock?.out ?? 0;

            renderTopProducts(data.topProducts || []);
            renderSalesChart(data.daily || []);

        })
        .catch(error => console.log(error));

}

function renderTopProducts(products) {

    var list = document.getElementById("topProductsList");

    if (!products.length) {
        list.innerHTML = `<p class="muted">No sales data yet.</p>`;
        return;
    }

    list.innerHTML = products.map(function (product, index) {
        return `
            <div class="rank-item">
                <span class="rank-num">${index + 1}</span>
                <div class="rank-info">
                    <strong>${escapeHtml(product.name)}</strong>
                    <span>${product.quantity} sold · ${formatMoney(product.revenue)}</span>
                </div>
            </div>
        `;
    }).join("");

}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderSalesChart(daily) {

    var canvas = document.getElementById("salesChart");
    if (!canvas || typeof Chart === "undefined") return;

    var labels = daily.map(function (d) { return d.label; });
    var totals = daily.map(function (d) { return Number(d.total) || 0; });

    if (salesChartInstance) {
        salesChartInstance.destroy();
    }

    salesChartInstance = new Chart(canvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Revenue (₦)",
                data: totals,
                backgroundColor: "#2563eb",
                borderRadius: 6,
                maxBarThickness: 42
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return "₦" + value;
                        }
                    }
                }
            }
        }
    });

}

function loadRecentSales() {

    fetch("../vendorhub-back/get_sales.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(sales => {

            const table = document.getElementById("recentSalesTable");
            table.innerHTML = "";

            if (!Array.isArray(sales) || sales.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="4">No sales available.</td>
                    </tr>
                `;
                return;
            }

            sales.slice(0, 5).forEach(sale => {
                table.innerHTML += `
                    <tr>
                        <td>${sale.customer}</td>
                        <td>${sale.product}</td>
                        <td>${sale.quantity}</td>
                        <td>₦${sale.total}</td>
                    </tr>
                `;
            });

        })
        .catch(error => console.log(error));

}

function loadLowStockProducts() {

    fetch("../vendorhub-back/get_inventory.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(products => {

            const table = document.getElementById("lowStockTable");
            table.innerHTML = "";

            const lowStock = (products || []).filter(product => product.stock <= 5);

            if (lowStock.length === 0) {
                table.innerHTML = `
                    <tr>
                        <td colspan="2">No low stock products.</td>
                    </tr>
                `;
                return;
            }

            lowStock.forEach(product => {
                table.innerHTML += `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.stock}</td>
                    </tr>
                `;
            });

        })
        .catch(error => console.log(error));

}
