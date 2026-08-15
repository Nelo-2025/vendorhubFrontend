// ===============================
// SALES.JS
// ===============================

let currentSale = null;

// Load everything
document.addEventListener("DOMContentLoaded", () => {

    loadCustomers();
    loadProducts();
    loadSales();

    document.getElementById("product")
        .addEventListener("change", updatePrice);

    document.getElementById("quantity")
        .addEventListener("input", updateTotal);

    document.getElementById("saveSaleBtn")
        .addEventListener("click", saveSale);

});

// =====================================
// LOAD CUSTOMERS
// =====================================
function loadCustomers() {

    fetch("../vendorhub-back/get_customers_dropdown.php")
    .then(response => response.json())
    .then(customers => {

        const customer = document.getElementById("customer");

        customer.innerHTML = "";

        customers.forEach(c => {

            customer.innerHTML += `
                <option value="${c.id}">
                    ${c.name}
                </option>
            `;

        });

    });

}

// =====================================
// LOAD PRODUCTS
// =====================================
function loadProducts() {

    fetch("../vendorhub-back/get_products_dropdown.php")
    .then(response => response.json())
    .then(products => {

        const product = document.getElementById("product");

        product.innerHTML = "";

        products.forEach(p => {

            product.innerHTML += `
                <option value="${p.id}" data-price="${p.price}">
                    ${p.name}
                </option>
            `;

        });

        updatePrice();

    });

}

// =====================================
// UPDATE PRICE
// =====================================
function updatePrice() {

    let product = document.getElementById("product");

    let price = product.options[product.selectedIndex]
        .getAttribute("data-price");

    document.getElementById("price").value = price;

    updateTotal();

}

// =====================================
// UPDATE TOTAL
// =====================================
function updateTotal() {

    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);

    if (isNaN(price)) price = 0;
    if (isNaN(quantity)) quantity = 1;

    document.getElementById("total").value = (price * quantity).toFixed(2);

}

// =====================================
// SAVE SALE
// =====================================
function saveSale() {

    const formData = new FormData();

    formData.append("customer",
        document.getElementById("customer").value);

    formData.append("product",
        document.getElementById("product").value);

    formData.append("quantity",
        document.getElementById("quantity").value);

    formData.append("total",
        document.getElementById("total").value);

    fetch("../vendorhub-back/add_sales.php", {

        method: "POST",
        body: formData

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            document.getElementById("quantity").value = 1;

            updateTotal();

            loadSales();

        }

    });

}

// =====================================
// LOAD SALES
// =====================================
function loadSales() {

    fetch("../vendorhub-back/get_sales.php")

    .then(response => response.json())

    .then(sales => {

        const table = document.getElementById("salesTable");

        table.innerHTML = "";

        sales.forEach(sale => {

            table.innerHTML += `

            <tr>

                <td>${sale.id}</td>

                <td>${sale.customer}</td>

                <td>${sale.product}</td>

                <td>${sale.quantity}</td>

                <td>₦${sale.total}</td>

                <td>${sale.sale_date}</td>

                <td>

                    <button onclick="deleteSale(${sale.id})">
                        Delete
                    </button>

                </td>

            </tr>

            `;

        });

        document.getElementById("salesCount").innerHTML = sales.length;

    });

}

// =====================================
// DELETE SALE
// =====================================
function deleteSale(id) {

    if (!confirm("Delete this sale?")) return;

    fetch("../vendorhub-back/delete_sales.php?id=" + id)

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            loadSales();

        }

    });

}