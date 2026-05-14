// =============================
// SMART EXPENSE TRACKER APP
// =============================

// =============================
// DOM ELEMENTS
// =============================

const form = document.getElementById('transaction-form');

const transactionList =
    document.getElementById('transaction-list');

const incomeElement =
    document.getElementById('income');

const expenseElement =
    document.getElementById('expense');

const balanceElement =
    document.getElementById('balance');

const assistantMessage =
    document.getElementById('assistant-message');

const downloadButton =
    document.getElementById('download-report');

// =============================
// INPUT ELEMENTS
// =============================

const titleInput =
    document.getElementById('title');

const amountInput =
    document.getElementById('amount');

const categoryInput =
    document.getElementById('category');

const typeInput =
    document.getElementById('type');

// =============================
// TRANSACTION STORAGE
// =============================

let transactions =
    JSON.parse(
        localStorage.getItem('transactions')
    ) || [];

// =============================
// CHART VARIABLE
// =============================

let expenseChart;

// =============================
// ADD TRANSACTION
// =============================

form.addEventListener('submit', function (e) {

    e.preventDefault();

    const title =
        titleInput.value.trim();

    const amount =
        Number(amountInput.value);

    const category =
        categoryInput.value;

    const type =
        typeInput.value;

    // Validation

    if (
        !title ||
        !amount ||
        !category ||
        !type
    ) {

        alert('Please fill all fields');

        return;
    }

    // Create transaction object

    const transaction = {

        id: Date.now(),

        title: title,

        amount: amount,

        category: category,

        type: type,

        date: new Date().toLocaleDateString()
    };

    // Push to array

    transactions.push(transaction);

    // Save

    saveTransactions();

    // Update UI

    renderTransactions();

    updateSummary();

    updateChart();

    updateAssistant();

    // Reset form

    form.reset();
});

// =============================
// SAVE TO LOCAL STORAGE
// =============================

function saveTransactions() {

    localStorage.setItem(
        'transactions',
        JSON.stringify(transactions)
    );
}

// =============================
// RENDER TRANSACTIONS
// =============================

function renderTransactions() {

    transactionList.innerHTML = '';

    // Empty State

    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-receipt"></i>

                <p>No transactions added yet</p>

            </div>

        `;

        return;
    }

    // Reverse latest first

    transactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const item =
                document.createElement('div');

            item.classList.add('transaction-item');

            item.innerHTML = `

                <div>

                    <h4>
                        ${transaction.title}
                    </h4>

                    <p>
                        ${transaction.category}
                        •
                        ${transaction.date}
                    </p>

                </div>

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    "
                >

                    <span
                        class="transaction-amount"
                        style="
                            color:
                            ${transaction.type === 'income'
                                ? '#10b981'
                                : '#ef4444'}
                        "
                    >

                        ${transaction.type === 'income'
                            ? '+'
                            : '-'
                        }

                        ₹${transaction.amount}

                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})"
                    >

                        X

                    </button>

                </div>

            `;

            transactionList.appendChild(item);
        });
}

// =============================
// DELETE TRANSACTION
// =============================

function deleteTransaction(id) {

    transactions =
        transactions.filter(
            transaction => transaction.id !== id
        );

    saveTransactions();

    renderTransactions();

    updateSummary();

    updateChart();

    updateAssistant();
}

// =============================
// UPDATE SUMMARY
// =============================

function updateSummary() {

    let income = 0;

    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === 'income') {

            income += transaction.amount;

        } else {

            expense += transaction.amount;
        }
    });

    const balance =
        income - expense;

    incomeElement.innerText =
        `₹${income}`;

    expenseElement.innerText =
        `₹${expense}`;

    balanceElement.innerText =
        `₹${balance}`;
}

// =============================
// UPDATE CHART
// =============================

function updateChart() {

    const categoryTotals = {};

    // Expense only

    transactions.forEach(transaction => {

        if (transaction.type === 'expense') {

            if (
                categoryTotals[
                    transaction.category
                ]
            ) {

                categoryTotals[
                    transaction.category
                ] += transaction.amount;

            } else {

                categoryTotals[
                    transaction.category
                ] = transaction.amount;
            }
        }
    });

    const labels =
        Object.keys(categoryTotals);

    const data =
        Object.values(categoryTotals);

    const ctx =
        document.getElementById('expenseChart');

    // Destroy previous chart

    if (expenseChart) {

        expenseChart.destroy();
    }

    // Create chart

    expenseChart = new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: labels,

            datasets: [

                {

                    label: 'Expenses',

                    data: data,

                    backgroundColor: [

                        '#4f46e5',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6'
                    ],

                    borderWidth: 0
                }
            ]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    labels: {

                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

// =============================
// SMART ASSISTANT
// =============================

function updateAssistant() {

    const expenses =
        transactions.filter(
            transaction =>
                transaction.type === 'expense'
        );

    const totalExpense =
        expenses.reduce(
            (sum, item) =>
                sum + item.amount,
            0
        );

    const foodExpense =
        expenses
            .filter(
                item =>
                    item.category === 'Food'
            )
            .reduce(
                (sum, item) =>
                    sum + item.amount,
                0
            );

    let message = '';

    // Conditions

    if (transactions.length === 0) {

        message =
            'Start adding transactions to receive smart suggestions.';
    }

    else if (totalExpense > 10000) {

        message =
            '⚠️ Your monthly expenses are very high. Try reducing unnecessary spending.';
    }

    else if (foodExpense > 3000) {

        message =
            '🍔 Food expenses are increasing. Consider meal planning to save money.';
    }

    else if (totalExpense < 2000) {

        message =
            '✅ Excellent! Your spending is currently well managed.';
    }

    else {

        message =
            '📊 Your finances look balanced. Keep tracking regularly.';
    }

    assistantMessage.innerText =
        message;
}

// =============================
// DOWNLOAD REPORT
// =============================

downloadButton.addEventListener(
    'click',
    function () {

        if (transactions.length === 0) {

            alert(
                'No transactions available'
            );

            return;
        }

        let reportContent =
            'SMART EXPENSE TRACKER REPORT\n\n';

        transactions.forEach(transaction => {

            reportContent += `

Title: ${transaction.title}

Category: ${transaction.category}

Type: ${transaction.type}

Amount: ₹${transaction.amount}

Date: ${transaction.date}

----------------------------------

`;
        });

        // Blob

        const blob = new Blob(

            [reportContent],

            {
                type: 'text/plain'
            }
        );

        // Download Link

        const link =
            document.createElement('a');

        link.href =
            URL.createObjectURL(blob);

        link.download =
            'expense-report.txt';

        link.click();
    }
);

// =============================
// INITIAL LOAD
// =============================

renderTransactions();

updateSummary();

updateChart();

updateAssistant();