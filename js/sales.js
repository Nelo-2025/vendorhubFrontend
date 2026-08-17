// ===============================
// SALES.JS
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    loadCustomers();
    loadProducts();
    loadSales();

    document.getElementById("product").addEventListener("change", updatePrice);
    document.getElementById("quantity").addEventListener("input", updateTotal);
    document.getElementById("saveSaleBtn").addEventListener("click", saveSale);

    document.getElementById("addSaleBtn").addEventListener("click", openSaleForm);
    document.getElementById("closeSaleFormBtn").addEventListener("click", hideSaleForm);
    document.getElementById("cancelSaleBtn").addEventListener("click", hideSaleForm);
    document.getElementById("saleModalBackdrop").addEventListener("click", hideSaleForm);

    var emptyBtn = document.getElementById("emptyAddSaleBtn");
    if (emptyBtn) {
        emptyBtn.addEventListener("click", openSaleForm);
    }

});

function openSaleForm() {
    document.getElementById("quantity").value = 1;
    updatePrice();
    document.getElementById("saleModal").hidden = false;
    document.body.style.overflow = "hidden";
}

function hideSaleForm() {
    document.getElementById("saleModal").hidden = true;
    document.body.style.overflow = "";
    document.getElementById("quantity").value = 1;
    updateTotal();
}

function loadCustomers() {

    fetch("../vendorhub-back/get_customers_dropdown.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(customers => {

            const customer = document.getElementById("customer");
            customer.innerHTML = "";

            if (!Array.isArray(customers) || customers.length === 0) {
                customer.innerHTML = `<option value="">No customers</option>`;
                return;
            }

            customers.forEach(c => {
                customer.innerHTML += `
                    <option value="${c.id}">${c.name}</option>
                `;
            });

        });

}

function loadProducts() {

    fetch("../vendorhub-back/get_products_dropdown.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(products => {

            const product = document.getElementById("product");
            product.innerHTML = "";

            if (!Array.isArray(products) || products.length === 0) {
                product.innerHTML = `<option value="">No products</option>`;
                document.getElementById("price").value = "";
                updateTotal();
                return;
            }

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

function updatePrice() {

    let product = document.getElementById("product");
    if (!product.options.length || !product.options[product.selectedIndex]) {
        document.getElementById("price").value = "";
        updateTotal();
        return;
    }

    let price = product.options[product.selectedIndex].getAttribute("data-price");
    document.getElementById("price").value = price || "";
    updateTotal();

}

function updateTotal() {

    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);

    if (isNaN(price)) price = 0;
    if (isNaN(quantity)) quantity = 1;

    document.getElementById("total").value = (price * quantity).toFixed(2);

}

function saveSale() {

    const formData = new FormData();
    formData.append("customer", document.getElementById("customer").value);
    formData.append("product", document.getElementById("product").value);
    formData.append("quantity", document.getElementById("quantity").value);
    formData.append("total", document.getElementById("total").value);

    fetch("../vendorhub-back/add_sales.php", {
        method: "POST",
        body: formData,
        credentials: "same-origin"
    })
        .then(response => response.json())
        .then(data => {

            alert(data.message);

            if (data.success) {
                hideSaleForm();
                loadSales();
                loadProducts();
            }

        })
        .catch(error => {
            console.error(error);
            alert("Something went wrong.");
        });

}

function loadSales() {

    fetch("../vendorhub-back/get_sales.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(sales => {

            const table = document.getElementById("salesTable");
            const empty = document.getElementById("salesEmpty");
            const wrap = document.getElementById("salesTableWrap");

            table.innerHTML = "";

            if (!Array.isArray(sales) || sales.length === 0) {
                empty.hidden = false;
                wrap.hidden = true;
                document.getElementById("salesCount").innerHTML = "0";

                var emptyBtn = document.getElementById("emptyAddSaleBtn");
                if (emptyBtn) {
                    emptyBtn.onclick = openSaleForm;
                }
                return;
            }

            empty.hidden = true;
            wrap.hidden = false;

            sales.forEach((sale, index) => {
                table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${sale.customer}</td>
                    <td>${sale.product}</td>
                    <td>${sale.quantity}</td>
                    <td>₦${sale.total}</td>
                    <td>${sale.sale_date}</td>
                    <td>
                        <button type="button" class="btn-danger" onclick="deleteSale(${sale.id})">
                            Delete
                        </button>
                    </td>
                </tr>
                `;
            });

            document.getElementById("salesCount").innerHTML = sales.length;

        })
        .catch(error => console.error(error));

}

function deleteSale(id) {

    if (!confirm("Delete this sale?")) return;

    fetch("../vendorhub-back/delete_sales.php?id=" + id, { credentials: "same-origin" })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                loadSales();
            }
        })
        .catch(error => {
            console.error(error);
            alert("Delete failed.");
        });

}
