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

function loadInventory() {

    fetch("../vendorhub-back/get_inventory.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(products => {

            const empty = document.getElementById("inventoryEmpty");
            const wrap = document.getElementById("inventoryTableWrap");

            inventoryTable.innerHTML = "";

            if (!Array.isArray(products) || products.length === 0) {
                empty.hidden = false;
                wrap.hidden = true;
                return;
            }

            empty.hidden = true;
            wrap.hidden = false;

            let html = "";

            products.forEach((product, index) => {

                let status = "";

                if (product.stock == 0) {
                    status = "<span class='low-stock'>Out of Stock</span>";
                } else if (product.stock <= 5) {
                    status = "<span class='low-stock'>Low Stock</span>";
                } else {
                    status = "<span class='in-stock'>In Stock</span>";
                }

                html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>₦${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${status}</td>
                    <td>
                        <button type="button" onclick="showRestock(${product.id})">
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

function showRestock(id) {
    productId.value = id;
    restockQty.value = "";
    restockModal.style.display = "block";
}

function restockProduct() {

    const data = new FormData();
    data.append("id", productId.value);
    data.append("quantity", restockQty.value);

    fetch("../vendorhub-back/restock_products.php", {
        method: "POST",
        body: data,
        credentials: "same-origin"
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

function searchInventory() {

    let keyword = searchInventoryInput.value.toLowerCase();
    let rows = inventoryTable.getElementsByTagName("tr");

    for (let row of rows) {
        row.style.display =
            row.innerText.toLowerCase().includes(keyword) ? "" : "none";
    }

}
