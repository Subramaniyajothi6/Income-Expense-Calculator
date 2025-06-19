const INCOME_API = 'https://685140bd8612b47a2c094278.mockapi.io/income';
const EXPENSE_API = 'https://685140bd8612b47a2c094278.mockapi.io/Expense';

let incomeList = [];
let expenseList = [];
let currentEdit = null;

function updateBudget() {
  const totalIncome = incomeList.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  const totalExpense = expenseList.reduce((acc, item) => acc + parseFloat(item.amount), 0);
  document.getElementById("budget-amount").textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
}

function renderList(list, selector, type) {
  const container = document.querySelector(selector);
  container.innerHTML = '';

  list.forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex justify-between items-center p-2 bg-pink-100 rounded';

    const span = document.createElement('span');
    span.textContent = `${item.text} : $${item.amount}`;

    const btnGroup = document.createElement('div');
    btnGroup.className = 'space-x-2';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'bg-yellow-500 text-white px-2 py-1 rounded';
    editBtn.onclick = () => startEdit(item, type);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remove';
    delBtn.className = 'bg-red-600 text-white px-2 py-1 rounded';
    delBtn.onclick = () => deleteItem(item.id, type);

    btnGroup.append(editBtn, delBtn);
    li.append(span, btnGroup);
    container.appendChild(li);
  });

  updateBudget();
}

async function addOrUpdateItem(type) {
  const textInput = document.getElementById(type === 'income' ? 'add-income' : 'add-expense');
  const amountInput = document.getElementById(type === 'income' ? 'add-amount' : 'add-e-amount');

  const text = textInput.value.trim();
  const amount = amountInput.value.trim();

  if (!text || isNaN(amount) || parseFloat(amount) <= 0) {
    return alert('Enter valid text and positive amount');
  }

  const payload = { text, amount: parseFloat(amount) };
  const API = type === 'income' ? INCOME_API : EXPENSE_API;

  if (currentEdit && currentEdit.type === type) {
    const res = await fetch(`${API}/${currentEdit.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const updated = await res.json();
    const list = type === 'income' ? incomeList : expenseList;
    const index = list.findIndex(i => i.id === updated.id);
    list[index] = updated;
    currentEdit = null;
  } else {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const newItem = await res.json();
    if (type === 'income') incomeList.push(newItem);
    else expenseList.push(newItem);
  }

  saveToLocal();
  renderAll();
  textInput.value = '';
  amountInput.value = '';
}

function startEdit(item, type) {
  currentEdit = { ...item, type };
  document.getElementById(type === 'income' ? 'add-income' : 'add-expense').value = item.text;
  document.getElementById(type === 'income' ? 'add-amount' : 'add-e-amount').value = item.amount;
}

async function deleteItem(id, type) {
  const API = type === 'income' ? INCOME_API : EXPENSE_API;
  await fetch(`${API}/${id}`, { method: 'DELETE' });

  if (type === 'income') incomeList = incomeList.filter(i => i.id !== id);
  else expenseList = expenseList.filter(e => e.id !== id);

  saveToLocal();
  renderAll();
}

function renderAll() {
  const filter = document.querySelector('input[name="filter"]:checked').value;

  const incomeBox = document.getElementById('income-box');
  const expenseBox = document.getElementById('expense-box');
  const boxContainer = document.getElementById('boxes');

  if (filter === 'income') {
    incomeBox.style.display = 'block';
    expenseBox.style.display = 'none';
    boxContainer.classList.remove('md:grid-cols-2');
    boxContainer.classList.add('grid-cols-1');
    renderList(incomeList, '.income-list', 'income');
  } else if (filter === 'expense') {
    expenseBox.style.display = 'block';
    incomeBox.style.display = 'none';
    boxContainer.classList.remove('md:grid-cols-2');
    boxContainer.classList.add('grid-cols-1');
    renderList(expenseList, '.expense-list', 'expense');
  } else {
    incomeBox.style.display = 'block';
    expenseBox.style.display = 'block';
    boxContainer.classList.remove('grid-cols-1');
    boxContainer.classList.add('md:grid-cols-2');
    renderList(incomeList, '.income-list', 'income');
    renderList(expenseList, '.expense-list', 'expense');
  }
}

function saveToLocal() {
  localStorage.setItem('incomeList', JSON.stringify(incomeList));
  localStorage.setItem('expenseList', JSON.stringify(expenseList));
}

function loadFromLocal() {
  const income = localStorage.getItem('incomeList');
  const expense = localStorage.getItem('expenseList');
  if (income) incomeList = JSON.parse(income);
  if (expense) expenseList = JSON.parse(expense);
}

async function fetchFromAPI() {
  const res1 = await fetch(INCOME_API);
  incomeList = await res1.json();
  const res2 = await fetch(EXPENSE_API);
  expenseList = await res2.json();
  saveToLocal();
}

window.onload = async () => {
  loadFromLocal();
  if (incomeList.length === 0 && expenseList.length === 0) {
    await fetchFromAPI();
  }
  renderAll();
};

document.getElementById('add-income-btn').onclick = () => addOrUpdateItem('income');
document.getElementById('add-expense-btn').onclick = () => addOrUpdateItem('expense');
document.getElementById('reset-btn').onclick = () => {
  ['add-income', 'add-amount', 'add-expense', 'add-e-amount'].forEach(id => document.getElementById(id).value = '');
  currentEdit = null;
};

document.querySelectorAll('input[name="filter"]').forEach(r => r.addEventListener('change', renderAll));
