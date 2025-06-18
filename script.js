

let income_lists = [];
let API_URL = `https://685140bd8612b47a2c094278.mockapi.io/income`;

async function fetchTodos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching income data:', error);
        return [];
    }
}

function renderTodoList(income_lists) {

    const income_list = document.querySelector('.income-list');

    income_list.innerHTML = '';

    income_lists.forEach(income => {

        const income_item = document.createElement('li');
        income_item.textContent = `${income.text} : $${income.amount}`;

        const d_btn = document.createElement("button");
        d_btn.className = "delete-btn";
        d_btn.textContent = "Remove";


        d_btn.onclick = async (e) => {
            await deleteIncome(e, income.id);
        };

        income_item.appendChild(d_btn);
        income_list.appendChild(income_item);
    });

    console.log('Rendered income list:', income_list);
}

async function deleteIncome(e, incomeId) {
    try {

        e.target.parentElement.remove();

        const response = await fetch(`${API_URL}/${incomeId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        income_lists = income_lists.filter(income => income.id !== incomeId);

        console.log('Income deleted successfully');
        updateBudget();
    } catch (error) {
        console.error('Error deleting income:', error);

        renderTodoList(income_lists);
    }

    
}




const add_income_btn = document.getElementById("add-income-btn");
add_income_btn.onclick = addIncome;

async function addIncome() {
    const incomeText = document.getElementById("add-income").value.trim();
    const incomeAmount = document.getElementById("add-amount").value.trim();

    // Input validation
    if (!incomeText || !incomeAmount) {
        alert('Please fill in both income description and amount');
        return;
    }

    if (isNaN(incomeAmount) || parseFloat(incomeAmount) <= 0) {
        alert('Please enter a valid positive amount');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: incomeText,
                amount: parseFloat(incomeAmount),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newIncome = await response.json();
        console.log('New income added:', newIncome);

        income_lists.push(newIncome);
        renderTodoList(income_lists);

        document.getElementById("add-income").value = '';
        document.getElementById("add-amount").value = '';
        updateBudget();
    } catch (error) {
        console.error('Error adding income:', error);
        alert('Failed to add income. Please try again.');
    }

    
}







// ===================================================== Expense  ==================================================== //


// Global variables or constants
let expenseList = []; // Fixed: consistent naming
let API_URL_expense = `https://685140bd8612b47a2c094278.mockapi.io/Expense`;

async function fetchExpense() {
    try {
        const response = await fetch(API_URL_expense);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching expense data:', error);
        return [];
    }
}

function renderExpenseList(expenseList) {

    const expense_list = document.querySelector('.expense-list');

    expense_list.innerHTML = '';

    // loop through the data
    expenseList.forEach(expense => {

        const expense_item = document.createElement('li');
        expense_item.textContent = `${expense.text} : $${expense.amount}`;

        const d_btn = document.createElement("button");
        d_btn.className = "delete-btn";
        d_btn.textContent = "Remove";

        d_btn.onclick = async (e) => {
            await deleteExpense(e, expense.id);
        };

        expense_item.appendChild(d_btn);
        expense_list.appendChild(expense_item);
    });

    console.log('Rendered expense list:', expense_list);
}


async function deleteExpense(e, expenseId) {
    try {

        e.target.parentElement.remove();


        const response = await fetch(`${API_URL_expense}/${expenseId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        expenseList = expenseList.filter(expense => expense.id !== expenseId);

        console.log('Expense deleted successfully');
        updateBudget();
    } catch (error) {
        console.error('Error deleting expense:', error);
        renderExpenseList(expenseList);
    }
    
}


const add_expense_btn = document.getElementById("add-expense-btn");
add_expense_btn.onclick = addExpense;

async function addExpense() {
    const expenseText = document.getElementById("add-expense").value.trim();
    const expenseAmount = document.getElementById("add-e-amount").value.trim();

    if (!expenseText || !expenseAmount) {
        alert('Please fill in both expense description and amount');
        return;
    }

    if (isNaN(expenseAmount) || parseFloat(expenseAmount) <= 0) {
        alert('Please enter a valid positive amount');
        return;
    }

    try {
        const response = await fetch(API_URL_expense, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: expenseText,
                amount: parseFloat(expenseAmount),
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const newExpense = await response.json();
        console.log('New expense added:', newExpense);

        expenseList.push(newExpense);
        renderExpenseList(expenseList);

        document.getElementById("add-expense").value = '';
        document.getElementById("add-e-amount").value = '';

        updateBudget();
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
    }
    
}

function updateBudget() {
    const totalIncome = income_lists.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalExpense = expenseList.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const balance = totalIncome - totalExpense;

    document.getElementById("budget-amount").textContent = `$${balance.toFixed(2)}`;
}



async function Main() {
    expenseList = await fetchExpense();
    renderExpenseList(expenseList);    
    localStorage.setItem('expense_lists', JSON.stringify(expenseList));
    
    income_lists = await fetchTodos();
    renderTodoList(income_lists);
    localStorage.setItem('income_lists', JSON.stringify(income_lists));

    updateBudget();
}

Main();