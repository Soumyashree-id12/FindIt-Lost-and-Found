// FINDIT - LOST & FOUND MANAGEMENT

// 1. GET SAVED ITEMS FROM LOCAL STORAGE

let items = JSON.parse(localStorage.getItem("finditItems")) || [];

// 2. OPEN REPORT FORM

function openReportForm(type) {
    const modal = document.getElementById("reportModal");

    modal.style.display = "flex";

    document.getElementById("itemType").value = type;

    document.getElementById("formTitle").textContent =
        "Report " + type + " Item";
}

// 3. CLOSE REPORT FORM

function closeReportForm() {
    document.getElementById("reportModal").style.display = "none";
}

// 4. CLOSE WHEN CLICKING OUTSIDE

document.getElementById("reportModal").addEventListener("click", function(event) {
    if (event.target === this) {
        closeReportForm();
    }
});


// 5. SAVE ITEM DETAILS

document.getElementById("reportForm").addEventListener("submit", function(event) {

    event.preventDefault();

    const newItem = {
        id: Date.now(),
        type: document.getElementById("itemType").value,
        name: document.getElementById("itemName").value.trim(),
        category: document.getElementById("itemCategory").value,
        location: document.getElementById("itemLocation").value.trim(),
        date: document.getElementById("itemDate").value,
        description: document.getElementById("itemDescription").value.trim(),
        contact: document.getElementById("itemContact").value.trim(),
        status: "Active"
    };

    items.push(newItem);

    localStorage.setItem("finditItems", JSON.stringify(items));

    alert("Your item has been reported successfully!");

    this.reset();

    closeReportForm();

    displayItems();
});


// 6. DISPLAY REPORTED ITEMS

function displayItems() {

    const itemGrid = document.getElementById("itemGrid");

    itemGrid.innerHTML = "";

    const searchText = document.getElementById("searchInput").value.toLowerCase();

    const category = document.getElementById("filterCategory").value;

    const type = document.getElementById("filterType").value;

    const filteredItems = items.filter(function(item) {

        const matchesSearch =
            item.name.toLowerCase().includes(searchText) ||
            item.location.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "All" || item.category === category;

        const matchesType =
            type === "All" || item.type === type;

        return matchesSearch && matchesCategory && matchesType;
    });


    if (filteredItems.length === 0) {

      itemGrid.innerHTML = `
    <div class="empty-message">
        <h3>No items found</h3>
    </div>
    `;

    }


    filteredItems.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "item-card";

        // Use textContent to safely display user-entered details.

        const badge = document.createElement("span");
        badge.className = "item-badge " +
            (item.type === "Lost" ? "lost-badge" : "found-badge");
        badge.textContent = item.type;

        const title = document.createElement("h3");
        title.textContent = item.name;

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + item.category;

        const locationText = document.createElement("p");
        locationText.textContent = "📍 " + item.location;

        const dateText = document.createElement("p");
        dateText.textContent = "📅 " + item.date;

        const description = document.createElement("p");
        description.textContent = item.description;

        
const status = document.createElement("span");
status.className = "item-status";
status.textContent = item.status;

if (item.status === "Returned") {
    status.style.background = "#dcf8ed";
    status.style.color = "#15966d";
}

// Create action buttons

const actions = document.createElement("div");
actions.className = "card-actions";

const returnBtn = document.createElement("button");
returnBtn.className = "return-btn";
returnBtn.textContent =
    item.status === "Returned" ? "✓ Returned" : "Mark as Returned";

returnBtn.disabled = item.status === "Returned";

returnBtn.addEventListener("click", function() {
    markAsReturned(item.id);
});

const deleteBtn = document.createElement("button");
deleteBtn.className = "delete-btn";
deleteBtn.textContent = "Delete";

deleteBtn.addEventListener("click", function() {
    deleteItem(item.id);
});

actions.append(returnBtn, deleteBtn);

card.append(
    badge,
    title,
    categoryText,
    locationText,
    dateText,
    description,
    status,
    actions
);

itemGrid.appendChild(card);


    });

    updateStatistics();
}


// 7. UPDATE DASHBOARD STATISTICS

function updateStatistics() {

    document.getElementById("totalItems").textContent =
        items.length;

    document.getElementById("lostItems").textContent =
        items.filter(item => item.type === "Lost" && item.status === "Active").length;

    document.getElementById("foundItems").textContent =
        items.filter(item => item.type === "Found" && item.status === "Active").length;

    document.getElementById("claimedItems").textContent =
        items.filter(item => item.status === "Returned").length;
}


// 8. SEARCH AND FILTER EVENTS

document.getElementById("searchInput").addEventListener("input", displayItems);

document.getElementById("filterCategory").addEventListener("change", displayItems);

document.getElementById("filterType").addEventListener("change", displayItems);


// 9. LOAD ITEMS WHEN WEBSITE OPENS

displayItems();


// MARK ITEM AS RETURNED 

function markAsReturned(id) {

    const confirmReturn = confirm(
        "Are you sure this item has been returned?"
    );

    if (!confirmReturn) return;

    items = items.map(function(item) {
        if (item.id === id) {
            return { ...item, status: "Returned" };
        }
        return item;
    });

    localStorage.setItem("finditItems", JSON.stringify(items));

    displayItems();
}

// ===== DELETE ITEM =====

function deleteItem(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this report?"
    );

    if (!confirmDelete) return;

    items = items.filter(function(item) {
        return item.id !== id;
    });

    localStorage.setItem("finditItems", JSON.stringify(items));

    displayItems();
}

