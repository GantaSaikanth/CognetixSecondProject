let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let transactionForm = document.getElementById("transactionForm");
let transactionsElements = document.getElementById("transactionsElements");

let taskInput = document.getElementById("taskInput");
let amountInput = document.getElementById("amountInput");
let typeSelect = document.getElementById("typeSelect");
let dateInput = document.getElementById("dateInput");

let incomeParagraph = document.getElementById("incomeParagraph");
let expenseParagraph = document.getElementById("expenseParagraph");
let balanceParagraph = document.getElementById("balanceParagraph");

let editId = null;

transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskInputValue = taskInput.value.trim();
    const amountInputValue = parseFloat(amountInput.value);
    const typeSelectValue = typeSelect.value;
    const dateInputValue = dateInput.value;

    if (!taskInputValue || !amountInputValue || !dateInputValue) return;

    if (editId !== null) {
        transactions = transactions.map(each =>
            each.id === editId
                ? { ...each, task: taskInputValue, amount: amountInputValue, type: typeSelectValue, date: dateInputValue }
                : each
        );
        editId = null;
    } else {
        transactions.push({
            id: Date.now(),
            task: taskInputValue,
            amount: amountInputValue,
            type: typeSelectValue,
            date: dateInputValue
        });
    }

    localStorage.setItem("transactions", JSON.stringify(transactions));

    transactionForm.reset();
    typeSelect.value = "income";

    renderTransactionList();
    updateSummary();
});


function renderTransactionList () {
    transactionsElements.innerHTML = "";

    transactions.forEach(eachTransaction => {
        const li = document.createElement("li");
        li.classList.add("transaction-item");
        const typeClass = eachTransaction.type === "income" ? "income-type" : "expense-type";


        li.innerHTML = `
            <span>${eachTransaction.id}</span>
            <span>${eachTransaction.task}</span>
            <span>${eachTransaction.amount}</span>
            <span class=${typeClass}>${eachTransaction.type}</span>
            <span>${eachTransaction.date}</span>
            <div>
                <button class="action-btn" onclick="editTransaction(${eachTransaction.id})">✏️</button>
                <button class="action-btn" onclick="deleteTransaction(${eachTransaction.id})">🗑️</button>
            </div>
        `;

        transactionsElements.appendChild(li);
    })
}

function editTransaction (id) {
    const transactionToEdit = transactions.find(each => each.id === id);

    taskInput.value = transactionToEdit.task;
    amountInput.value = transactionToEdit.amount;
    typeSelect.value = transactionToEdit.type;
    dateInput.value = transactionToEdit.date;

    editId = id;
}

function deleteTransaction(id) {
    transactions = transactions.filter(each => each.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactionList();
    updateSummary();
}

function updateSummary() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    incomeParagraph.textContent = "₹ " + income;
    expenseParagraph.textContent = "₹ " + expense;
    balanceParagraph.textContent = "₹ " + (income - expense);
}

renderTransactionList();
updateSummary();