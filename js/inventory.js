// =============================
// INVENTORY.JS
// =============================

let inventoryTable;
let productId;
let restockQty;
let restockModal;
let searchInventoryInput;

document.addEventListener("DOMContentLoaded", () => {

    inventoryTable = document.getElementById("inventoryTable");
    productId = document.getElementById("productId");
    restockQty = document.getElementById("restockQty");
    restockModal = document.getElementById("restockModal");
    searchInventoryInput = document.getElementById("searchInventory");

    loadInventory();

    document
        .getElementById("updateStockBtn")
        .addEventListener("click", restockProduct);

    searchInventoryInput
        .addEventListener("keyup", searchInventory);

});


// =============================
// LOAD INVENTORY
// =============================
function loadInventory() {

    fetch("../vendorhub-back/get_inventory.php")

    .then(response => response.json())

    .then(products => {

        let html = "";

        products.forEach(product => {

            let status = "";

            if (product.stock == 0) {

                status =
                "<span style='color:red'>Out of Stock</span>";

            } else if (product.stock <= 5) {

                status =
                "<span style='color:orange'>Low Stock</span>";

            } else {

                status =
                "<span style='color:green'>In Stock</span>";

            }

            html += `
            <tr>

                <td>${product.id}</td>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>₦${product.price}</td>

                <td>${product.stock}</td>

                <td>${status}</td>

                <td>

                    <button onclick="showRestock(${product.id})">
                        Restock
                    </button>

                </td>

            </tr>
            `;

        });

        inventoryTable.innerHTML = html;

    })

    .catch(error => {
        console.error("Inventory Error:", error);
    });

}


// =============================
// SHOW RESTOCK MODAL
// =============================
function showRestock(id) {

    productId.value = id;

    restockQty.value = "";

    restockModal.style.display = "block";

}


// =============================
// RESTOCK PRODUCT
// =============================
function restockProduct() {

    const data = new FormData();

    data.append("id", productId.value);
    data.append("quantity", restockQty.value);

    fetch("../vendorhub-back/restock_products.php", {

        method: "POST",
        body: data

    })

    .then(response => response.json())

    .then(data => {

        alert(data.message);

        if (data.success) {

            restockModal.style.display = "none";

            loadInventory();

        }

    })

    .catch(error => {
        console.error(error);
    });

}


// =============================
// SEARCH INVENTORY
// =============================
function searchInventory() {

    let keyword =
    searchInventoryInput.value.toLowerCase();

    let rows =
    inventoryTable.getElementsByTagName("tr");

    for (let row of rows) {

        row.style.display =
            row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

    }

}