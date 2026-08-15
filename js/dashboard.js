// ==========================================
// VENDORHUB DASHBOARD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadDashboardStats();
    loadRecentSales();
    loadLowStockProducts();
    loadSalesChart();

});


// ==========================================
// LOAD DASHBOARD STATISTICS
// ==========================================

function loadDashboardStats() {

    fetch("../vendorhub-back/dashboard.php")
    .then(response => response.json())
    .then(data => {

        document.getElementById("productCount").innerHTML = data.products;

        document.getElementById("customerCount").innerHTML = data.customers;

        document.getElementById("salesCount").innerHTML = "₦" + data.sales;

        document.getElementById("lowStock").innerHTML = data.lowstock;

    })
    .catch(error => console.log(error));

}


// ==========================================
// LOAD RECENT SALES
// ==========================================

function loadRecentSales() {

    fetch("../vendorhub-back/get_sales.php")
    .then(response => response.json())
    .then(sales => {

        const table = document.getElementById("recentSalesTable");

        table.innerHTML = "";

        if (sales.length === 0) {

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


// ==========================================
// LOAD LOW STOCK PRODUCTS
// ==========================================

function loadLowStockProducts() {

    fetch("../vendorhub-back/get_inventory.php")
    .then(response => response.json())
    .then(products => {

        const table = document.getElementById("lowStockTable");

        table.innerHTML = "";

        const lowStock = products.filter(product => product.stock <= 5);

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


// ==========================================
// LOAD SALES CHART
// ==========================================

function loadSalesChart() {

    fetch("../vendorhub-back/get_sales.php")
    .then(response => response.json())
    .then(sales => {

        const labels = [];
        const totals = [];

        sales.slice(0, 7).reverse().forEach(sale => {

            labels.push(sale.sale_date);
            totals.push(parseFloat(sale.total));

        });

        const canvas = document.getElementById("salesChart");

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        new Chart(ctx, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [{

                    label: "Sales (₦)",

                    data: totals,

                    backgroundColor: "#2563eb"

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true

                    }

                }

            }

        });

    })
    .catch(error => console.log(error));

}