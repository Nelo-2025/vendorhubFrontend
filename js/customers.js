// ===============================
// CUSTOMERS.JS
// ===============================

let currentCustomer = null;

// =====================================
// LOAD WHEN PAGE OPENS
// =====================================
document.addEventListener("DOMContentLoaded", () => {

    loadCustomers();

    document.getElementById("addCustomerBtn").onclick = function(){

        currentCustomer = null;

        document.getElementById("customerForm").style.display = "block";

        document.getElementById("customerName").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerEmail").value = "";
        document.getElementById("customerAddress").value = "";

        document.getElementById("saveCustomerBtn").innerHTML =
        "Save Customer";

    };

    document.getElementById("saveCustomerBtn").onclick = saveCustomer;

});

// =====================================
// LOAD CUSTOMERS
// =====================================
function loadCustomers(){

    fetch("../vendorhub-back/get_customers.php")

    .then(response => response.json())

    .then(customers => {

        let html = "";

        customers.forEach(customer => {

            html += `

            <tr>

                <td>${customer.id}</td>

                <td>${customer.name}</td>

                <td>${customer.phone}</td>

                <td>${customer.email}</td>

                <td>${customer.address}</td>

                <td>

                    <button onclick="editCustomer(
                        ${customer.id},
                        '${customer.name}',
                        '${customer.phone}',
                        '${customer.email}',
                        '${customer.address}'
                    )">

                        Edit

                    </button>

                    <button onclick="deleteCustomer(${customer.id})">

                        Delete

                    </button>

                </td>

            </tr>

            `;

        });

        document.getElementById("customerTable").innerHTML = html;

    });

}

// =====================================
// SAVE / UPDATE CUSTOMER
// =====================================
function saveCustomer(){

    const formData = new FormData();

    formData.append(
        "name",
        document.getElementById("customerName").value
    );

    formData.append(
        "phone",
        document.getElementById("customerPhone").value
    );

    formData.append(
        "email",
        document.getElementById("customerEmail").value
    );

    formData.append(
        "address",
        document.getElementById("customerAddress").value
    );

    let url;

    if(currentCustomer == null){

        url = "../vendorhub-back/add_customers.php";

    }else{

        formData.append("id", currentCustomer);

        url = "../vendorhub-back/update_customers.php";

    }

    fetch(url,{

        method:"POST",

        body:formData

    })

    .then(response => response.text())

    .then(message => {

        alert(message);

        currentCustomer = null;

        document.getElementById("customerForm").style.display = "none";

        document.getElementById("saveCustomerBtn").innerHTML =
        "Save Customer";

        loadCustomers();

    });

}

// =====================================
// EDIT CUSTOMER
// =====================================
function editCustomer(id, name, phone, email, address){

    currentCustomer = id;

    document.getElementById("customerForm").style.display = "block";

    document.getElementById("customerName").value = name;
    document.getElementById("customerPhone").value = phone;
    document.getElementById("customerEmail").value = email;
    document.getElementById("customerAddress").value = address;

    document.getElementById("saveCustomerBtn").innerHTML =
    "Update Customer";

}

// =====================================
// DELETE CUSTOMER
// =====================================
function deleteCustomer(id){

    if(!confirm("Delete this customer?")) return;

    fetch("../vendorhub-back/delete_customers.php?id=" + id)

    .then(response => response.text())

    .then(message => {

        alert(message);

        loadCustomers();

    });

}