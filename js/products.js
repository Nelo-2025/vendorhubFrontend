// ===============================
// PRODUCTS.JS
// ===============================

// Product currently being edited
let currentProduct = null;

// Load products when page opens
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// ===============================
// SAVE / UPDATE PRODUCT
// ===============================
document.getElementById("saveBtn").addEventListener("click", () => {

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("stock").value);

    let url = "../vendorhub-back/add_products.php";

    // UPDATE
    if (currentProduct !== null) {
        formData.append("id", currentProduct);
        url = "../vendorhub-back/update_products.php";
    }

    console.log("Request URL:", url);
    console.log("Current Product:", currentProduct);

    fetch(url, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        alert(data.message);

        if (data.success) {

            // Clear form
            document.getElementById("name").value = "";
            document.getElementById("category").value = "";
            document.getElementById("price").value = "";
            document.getElementById("stock").value = "";

            currentProduct = null;

            loadProducts();
        }

    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong.");
    });

});


// ===============================
// LOAD PRODUCTS
// ===============================
function loadProducts() {

    fetch("../vendorhub-back/get_products.php")
    .then(res => res.json())
    .then(products => {

        const table = document.getElementById("productTable");

        table.innerHTML = "";

        products.forEach(product => {

            table.innerHTML += `
            <tr>

                <td>${product.id}</td>

                <td>${product.name}</td>

                <td>${product.category}</td>

                <td>${product.price}</td>

                <td>${product.stock}</td>

                <td>

                    <button onclick="editProduct(
                        ${product.id},
                        '${product.name}',
                        '${product.category}',
                        '${product.price}',
                        '${product.stock}'
                    )">
                        Edit
                    </button>

                    <button onclick="deleteProduct(${product.id})">
                        Delete
                    </button>

                </td>

            </tr>
            `;

        });

    })
    .catch(error => console.error(error));

}


// ===============================
// EDIT PRODUCT
// ===============================
function editProduct(id, name, category, price, stock) {

    document.getElementById("name").value = name;
    document.getElementById("category").value = category;
    document.getElementById("price").value = price;
    document.getElementById("stock").value = stock;

    currentProduct = id;

    console.log("Editing Product:", currentProduct);
}


// ===============================
// DELETE PRODUCT
// ===============================
function deleteProduct(id) {

    if (!confirm("Delete this product?")) {
        return;
    }

    const formData = new FormData();
    formData.append("id", id);

    fetch("../vendorhub-back/delete_products.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {

        console.log(data);

        alert(data.message);

        if (data.success) {
            loadProducts();
        }

    })
    .catch(error => {
        console.error(error);
        alert("Delete failed.");
    });

}