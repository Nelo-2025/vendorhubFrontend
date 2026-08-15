let reportTable;
let totalSales;
let totalRevenue;
let productsSold;

document.addEventListener("DOMContentLoaded", () => {

    reportTable = document.getElementById("reportTable");
    totalSales = document.getElementById("totalSales");
    totalRevenue = document.getElementById("totalRevenue");
    productsSold = document.getElementById("productsSold");

    loadReports();

});

function loadReports() {

    fetch("../vendorhub-back/get_reports.php")
        .then(res => res.json())
        .then(data => {

            totalSales.innerHTML = data.totalSales;
            totalRevenue.innerHTML = "₦" + data.totalRevenue;
            productsSold.innerHTML = data.productsSold;

            let html = "";

            data.sales.forEach(sale => {

                html += `
                <tr>
                    <td>${sale.id}</td>
                    <td>${sale.customer}</td>
                    <td>${sale.product}</td>
                    <td>${sale.quantity}</td>
                    <td>₦${sale.total}</td>
                    <td>${sale.sale_date}</td>
                </tr>
                `;

            });

            reportTable.innerHTML = html;

        });

}