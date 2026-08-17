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

    fetch("../vendorhub-back/get_reports.php", { credentials: "same-origin" })
        .then(res => res.json())
        .then(data => {

            totalSales.innerHTML = data.totalSales ?? 0;
            totalRevenue.innerHTML = "₦" + (data.totalRevenue ?? "0.00");
            productsSold.innerHTML = data.productsSold ?? 0;

            const empty = document.getElementById("reportEmpty");
            const wrap = document.getElementById("reportTableWrap");
            const sales = Array.isArray(data.sales) ? data.sales : [];

            reportTable.innerHTML = "";

            if (sales.length === 0) {
                empty.hidden = false;
                wrap.hidden = true;
                return;
            }

            empty.hidden = true;
            wrap.hidden = false;

            let html = "";

            sales.forEach(sale => {
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

        })
        .catch(error => console.error(error));

}
