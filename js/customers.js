// ===============================
// CUSTOMERS.JS
// ===============================

let currentCustomer = null;

document.addEventListener("DOMContentLoaded", () => {

    loadCustomers();

    document.getElementById("addCustomerBtn").addEventListener("click", openAddCustomer);
    document.getElementById("saveCustomerBtn").addEventListener("click", saveCustomer);
    document.getElementById("closeCustomerFormBtn").addEventListener("click", hideCustomerForm);
    document.getElementById("cancelCustomerBtn").addEventListener("click", hideCustomerForm);
    document.getElementById("customerModalBackdrop").addEventListener("click", hideCustomerForm);

    var emptyBtn = document.getElementById("emptyAddCustomerBtn");
    if (emptyBtn) {
        emptyBtn.addEventListener("click", openAddCustomer);
    }

});

function openAddCustomer() {
    currentCustomer = null;
    clearCustomerForm();
    setCustomerFormMode(false);
    showCustomerForm();
}

function showCustomerForm() {
    document.getElementById("customerModal").hidden = false;
    document.body.style.overflow = "hidden";
    setTimeout(function () {
        document.getElementById("customerName").focus();
    }, 50);
}

function hideCustomerForm() {
    document.getElementById("customerModal").hidden = true;
    document.body.style.overflow = "";
    clearCustomerForm();
}

function setCustomerFormMode(editing) {
    var title = document.querySelector("#customerForm h2");
    var saveBtn = document.getElementById("saveCustomerBtn");
    if (title) {
        title.textContent = editing ? "Edit Customer" : "Add Customer";
    }
    if (saveBtn) {
        saveBtn.textContent = editing ? "Update Customer" : "Save Customer";
    }
}

function clearCustomerForm() {
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerEmail").value = "";
    document.getElementById("customerAddress").value = "";
    currentCustomer = null;
    setCustomerFormMode(false);
}

function emptyCustomerStateHtml() {
    return `
        <div class="product-empty-state">
            <div class="product-empty-icon">
                <i class="fas fa-users"></i>
            </div>
            <h3>No customers yet</h3>
            <p>You have not added any customers. Click <strong>Add Customer</strong> at the top right to create your first one.</p>
            <button type="button" id="emptyAddCustomerBtn" class="btn-add">
                <i class="fas fa-plus"></i> Add Customer
            </button>
        </div>
    `;
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

function initialFor(name) {
    var text = String(name || "?").trim();
    return text ? text.charAt(0).toUpperCase() : "?";
}

function loadCustomers() {

    fetch("../vendorhub-back/get_customers.php", { credentials: "same-origin" })
        .then(response => response.json())
        .then(customers => {

            const grid = document.getElementById("customerGrid");
            grid.innerHTML = "";

            if (!Array.isArray(customers) || customers.length === 0) {
                grid.innerHTML = emptyCustomerStateHtml();
                var emptyBtn = document.getElementById("emptyAddCustomerBtn");
                if (emptyBtn) {
                    emptyBtn.addEventListener("click", openAddCustomer);
                }
                return;
            }

            customers.forEach(customer => {
                grid.innerHTML += `
                <article class="customer-card">
                    <div class="customer-card-avatar">${escapeHtml(initialFor(customer.name))}</div>
                    <div class="customer-card-body">
                        <h3 class="customer-card-title">${escapeHtml(customer.name)}</h3>
                        <p class="customer-card-line"><i class="fas fa-phone"></i> ${escapeHtml(customer.phone || "—")}</p>
                        <p class="customer-card-line"><i class="fas fa-envelope"></i> ${escapeHtml(customer.email || "—")}</p>
                        <p class="customer-card-line"><i class="fas fa-location-dot"></i> ${escapeHtml(customer.address || "—")}</p>
                        <div class="product-card-actions">
                            <button type="button" onclick="editCustomer(
                                ${customer.id},
                                '${escapeAttr(customer.name)}',
                                '${escapeAttr(customer.phone)}',
                                '${escapeAttr(customer.email)}',
                                '${escapeAttr(customer.address)}'
                            )">Edit</button>
                            <button type="button" class="btn-danger" onclick="deleteCustomer(${customer.id})">Delete</button>
                        </div>
                    </div>
                </article>
                `;
            });

        })
        .catch(error => console.error(error));

}

function saveCustomer() {

    const formData = new FormData();
    formData.append("name", document.getElementById("customerName").value);
    formData.append("phone", document.getElementById("customerPhone").value);
    formData.append("email", document.getElementById("customerEmail").value);
    formData.append("address", document.getElementById("customerAddress").value);

    let url = "../vendorhub-back/add_customers.php";

    if (currentCustomer !== null) {
        formData.append("id", currentCustomer);
        url = "../vendorhub-back/update_customers.php";
    }

    fetch(url, {
        method: "POST",
        body: formData,
        credentials: "same-origin"
    })
        .then(response => response.text())
        .then(message => {
            alert(message);
            hideCustomerForm();
            loadCustomers();
        })
        .catch(error => {
            console.error(error);
            alert("Something went wrong.");
        });

}

function editCustomer(id, name, phone, email, address) {

    currentCustomer = id;
    document.getElementById("customerName").value = name;
    document.getElementById("customerPhone").value = phone;
    document.getElementById("customerEmail").value = email;
    document.getElementById("customerAddress").value = address;
    setCustomerFormMode(true);
    showCustomerForm();

}

function deleteCustomer(id) {

    if (!confirm("Delete this customer?")) return;

    fetch("../vendorhub-back/delete_customers.php?id=" + id, { credentials: "same-origin" })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadCustomers();
        })
        .catch(error => {
            console.error(error);
            alert("Delete failed.");
        });

}
