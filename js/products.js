// ===============================
// PRODUCTS.JS
// ===============================

let currentProduct = null;

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();

    var imageInput = document.getElementById("image");
    if (imageInput) {
        imageInput.addEventListener("change", previewSelectedImage);
    }

    document.getElementById("addBtn").addEventListener("click", openAddForm);

    var emptyAddBtn = document.getElementById("emptyAddBtn");
    if (emptyAddBtn) {
        emptyAddBtn.addEventListener("click", openAddForm);
    }

    document.getElementById("closeFormBtn").addEventListener("click", hideProductForm);
    document.getElementById("cancelFormBtn").addEventListener("click", hideProductForm);
    document.getElementById("productModalBackdrop").addEventListener("click", hideProductForm);

    document.getElementById("saveBtn").addEventListener("click", saveProduct);
});

function openAddForm() {
    clearProductForm();
    setFormMode(false);
    showProductForm();
}

function showProductForm() {
    var modal = document.getElementById("productModal");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () {
        document.getElementById("name").focus();
    }, 50);
}

function hideProductForm() {
    var modal = document.getElementById("productModal");
    modal.hidden = true;
    document.body.style.overflow = "";
    clearProductForm();
}

function setFormMode(editing) {
    var title = document.querySelector("#productForm h2");
    var saveBtn = document.getElementById("saveBtn");
    if (title) {
        title.textContent = editing ? "Edit Product" : "Add New Product";
    }
    if (saveBtn) {
        saveBtn.textContent = editing ? "Update Product" : "Save Product";
    }
}

function previewSelectedImage() {
    var input = document.getElementById("image");
    var wrap = document.getElementById("imagePreviewWrap");
    var preview = document.getElementById("imagePreview");

    if (!input.files || !input.files[0]) {
        return;
    }

    var url = URL.createObjectURL(input.files[0]);
    preview.src = url;
    wrap.hidden = false;
}

function clearProductForm() {
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("image").value = "";

    var wrap = document.getElementById("imagePreviewWrap");
    var preview = document.getElementById("imagePreview");
    preview.removeAttribute("src");
    wrap.hidden = true;

    currentProduct = null;
    setFormMode(false);
}

function saveProduct() {

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("stock").value);

    var imageInput = document.getElementById("image");
    if (imageInput.files && imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
    }

    let url = "../vendorhub-back/add_products.php";

    if (currentProduct !== null) {
        formData.append("id", currentProduct);
        url = "../vendorhub-back/update_products.php";
    }

    fetch(url, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
    })
    .then(res => res.json())
    .then(data => {

        alert(data.message);

        if (data.success) {
            hideProductForm();
            loadProducts();
        }

    })
    .catch(error => {
        console.error(error);
        alert("Something went wrong.");
    });

}

function productImageSrc(image) {
    if (!image) {
        return "";
    }
    return "../vendorhub-back/ppdct/" + encodeURIComponent(image);
}

function escapeAttr(value) {
    return String(value ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, " ");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function stockClass(stock) {
    var n = Number(stock);
    if (n <= 0) return "stock-out";
    if (n <= 5) return "stock-low";
    return "stock-ok";
}

function stockLabel(stock) {
    var n = Number(stock);
    if (n <= 0) return "Out of stock";
    if (n <= 5) return "Low · " + n;
    return "In stock · " + n;
}

function emptyStateHtml() {
    return `
        <div class="product-empty-state">
            <div class="product-empty-icon">
                <i class="fas fa-box-open"></i>
            </div>
            <h3>No products yet</h3>
            <p>You have not added any products. Click <strong>Add Product</strong> at the top right to create your first one.</p>
            <button type="button" id="emptyAddBtn" class="btn-add">
                <i class="fas fa-plus"></i> Add Product
            </button>
        </div>
    `;
}

function loadProducts() {

    fetch("../vendorhub-back/get_products.php", { credentials: "same-origin" })
    .then(res => res.json())
    .then(products => {

        const grid = document.getElementById("productGrid");
        grid.innerHTML = "";

        if (!Array.isArray(products) || products.length === 0) {
            grid.innerHTML = emptyStateHtml();
            var emptyAddBtn = document.getElementById("emptyAddBtn");
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener("click", openAddForm);
            }
            return;
        }

        products.forEach(product => {

            const imgSrc = productImageSrc(product.image);
            const media = imgSrc
                ? `<img src="${imgSrc}" alt="${escapeHtml(product.name)}">`
                : `<div class="product-card-placeholder"><i class="fas fa-box"></i></div>`;

            grid.innerHTML += `
            <article class="product-card">
                <div class="product-card-media">
                    ${media}
                </div>
                <div class="product-card-body">
                    <p class="product-card-category">${escapeHtml(product.category)}</p>
                    <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
                    <div class="product-card-meta">
                        <span class="product-card-price">₦${escapeHtml(product.price)}</span>
                        <span class="product-card-stock ${stockClass(product.stock)}">${stockLabel(product.stock)}</span>
                    </div>
                    <div class="product-card-actions">
                        <button type="button" onclick="editProduct(
                            ${product.id},
                            '${escapeAttr(product.name)}',
                            '${escapeAttr(product.category)}',
                            '${escapeAttr(product.price)}',
                            '${escapeAttr(product.stock)}',
                            '${escapeAttr(product.image || "")}'
                        )">Edit</button>
                        <button type="button" class="btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                    </div>
                </div>
            </article>
            `;

        });

    })
    .catch(error => console.error(error));

}

function editProduct(id, name, category, price, stock, image) {

    document.getElementById("name").value = name;
    document.getElementById("category").value = category;
    document.getElementById("price").value = price;
    document.getElementById("stock").value = stock;
    document.getElementById("image").value = "";

    currentProduct = id;
    setFormMode(true);

    var wrap = document.getElementById("imagePreviewWrap");
    var preview = document.getElementById("imagePreview");
    var src = productImageSrc(image);

    if (src) {
        preview.src = src;
        wrap.hidden = false;
    } else {
        preview.removeAttribute("src");
        wrap.hidden = true;
    }

    showProductForm();
}

function deleteProduct(id) {

    if (!confirm("Delete this product?")) {
        return;
    }

    const formData = new FormData();
    formData.append("id", id);

    fetch("../vendorhub-back/delete_products.php", {
        method: "POST",
        body: formData,
        credentials: "same-origin"
    })
    .then(res => res.json())
    .then(data => {

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
