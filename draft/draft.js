// const income_list = document.getElementsByClassName("income-list");



// function addIncome() {
//     const create_li = document.createElement("li");

//     const sp_income_name = document.createElement("span");
//     const sp_income_amount = document.createElement("span");

//     const sp_cl_income_name = document.createAttribute("class");
//     const sp_cl_income_amount = document.createAttribute("class");

//     sp_cl_income_name.value = "sp_income_name";
//     sp_cl_income_amount.value = "sp_income_amount";

//     sp_income_name.setAttributeNode(sp_cl_income_name);
//     sp_income_amount.setAttributeNode(sp_cl_income_amount);

//     const income_name = document.getElementById("add-income");
//     const income_amount = document.getElementById("add-amount");

//     sp_income_name.textContent = income_name.value + " :";
//     sp_income_amount.textContent = income_amount.value;

//     const d_btn = document.createElement("button");
//     const d_btn_cl = document.createAttribute("class");

//     d_btn_cl.value = "delete-btn";
//     d_btn.setAttributeNode(d_btn_cl);
//     d_btn.onclick = deleteIncome;
//     d_btn.textContent = "x";

//     create_li.appendChild(d_btn);
//     create_li.appendChild(sp_income_name);
//     create_li.appendChild(sp_income_amount);

//     income_list[0].appendChild(create_li);

//     console.log(income_list[0].innerHTML);


//     const total = document.getElementById("expense");
//     total.textContent = eval(total.textContent) + eval(sp_income_amount.textContent)  ;


//     function deleteIncome(e) {
//     e.target.parentElement.remove();
//     total.textContent = eval(total.textContent) - eval(sp_income_amount.textContent);

// }

// }





// const API_URL = "https://685140bd8612b47a2c094278.mockapi.io/income";


// async function getIncome() {
//     try{
//         const response = await fetch(API_URL);
//         const data = await response.json();
//         console.log(data);
//     }catch(error){
//         console.log(error.message);
//     }

// }

// getIncome();





// ============================================================================================================= //



// // Global variables or constants
// let income_lists = [];
// let expense = [];
// let API_URL = `https://685140bd8612b47a2c094278.mockapi.io/income`;

// async function fetchTodos() {
//     try {
//         // make an api call to the url: https://684c3f27ed2578be881e37e6.mockapi.io/todos

//         const response = await fetch(API_URL);

//         // convert the response object to JS object

//         // store the data to the todos variable

//         return response.json();
//     } catch (error) {
//         console.log(error);
//     }
// }

// function renderTodoList(income_lists) {
//     // identify the ul list item from the main page
//     const income_list = document.querySelector('.income-list');

//     // loop through the data
//     income_lists.forEach(income => {

//         // for each todo object, create a list item
//         const income_item = document.createElement('li');

//         income_item.textContent = income.text + " : " + income.amount;

//         const d_btn = document.createElement("button");
//         const d_btn_cl = document.createAttribute("class");
//         d_btn_cl.value = "delete-btn";
//         d_btn.setAttributeNode(d_btn_cl);
//         d_btn.onclick = deleteIncome;
//         d_btn.textContent = "Remove";
//         income_item.appendChild(d_btn);


//         async function deleteIncome(e) {
//             e.target.parentElement.remove();
//             try {
//                 await fetch(`${API_URL}/${income.id}`, {
//                     method: "DELETE",
//                 })
//             }
//             catch {
//                 error => console.log(error);
//             }

//         }



//         // append each of the created list item the unordered list
//         income_list.appendChild(income_item);

//     })

//     console.log(income_list);
// }

// // Entry point for the index.js
// async function Main() {

//     income_lists = await fetchTodos();
//     renderTodoList(income_lists);

// }



// const add_income_btn = document.getElementById("add-income-btn");
// add_income_btn.onclick = addIncome;


// async function addIncome() {
//     try {
//         const response = await fetch(API_URL, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 text: document.getElementById("add-income").value,
//                 amount: document.getElementById("add-amount").value,
//             }),
//         });
//         const data = await response.json();
//         console.log(data);

//     } catch (error) {
//         console.log(error);
//     }



// }



// Main();



// ============================================================================================================== //




// // Global variables or constants
// let expense = [];
// let API_URL_expense = `https://685140bd8612b47a2c094278.mockapi.io/Expense`;

// async function fetchExpense() {
//     try {
//         const response = await fetch(API_URL_expense);
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching income data:', error);
//         return []; // Return empty array on error
//     }
// }






// function renderExpenseList(expense_lists) {
//     // identify the ul list item from the main page
//     const expense_list = document.querySelector('.expense-list');
    
//     // Clear existing items to prevent duplicates
//     expense_list.innerHTML = '';

//     // loop through the data
//     expense_lists.forEach(expense => {
//         // for each income object, create a list item
//         const expense_item = document.createElement('li');
//         expense_item.textContent = `${expense.text} : $${expense.amount}`;

//         const d_btn = document.createElement("button");
//         d_btn.className = "delete-btn"; // Simpler way to set class
//         d_btn.textContent = "Remove";
        
//         // Add click handler for delete
//         d_btn.onclick = async (e) => {
//             await deleteIncome(e, expense.id);
//         };
        
//         expense_item.appendChild(d_btn);
//         expense_list.appendChild(expense_item);
//     });

//     console.log('Rendered income list:', expense_list);
// }

// async function deleteIncome(e, expenseId) {
//     try {
//         // Remove from UI immediately for better UX
//         e.target.parentElement.remove();
        
//         // Delete from API
//         const response = await fetch(`${API_URL_expense}/${expenseId}`, {
//             method: "DELETE",
//         });
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         // Update local data
//         expense_lists = expense_lists.filter(expense => expense.id !== expenseId);
        
//         console.log('Income deleted successfully');
//     } catch (error) {
//         console.error('Error deleting income:', error);
//         // Optionally re-render to restore the item if deletion failed
//         renderExpenseList(expense_lists);
//     }
// }

// // Entry point for the index.js
// async function Main() {
//     expense_lists = await fetchExpense();
//     console.log(expense_lists);
//     renderExpenseList(expense_lists);
// }



// const add_expense_btn = document.getElementById("add-expense-btn");
// add_expense_btn.onclick = addExpense;

// async function addExpense() {
//     const expenseText = document.getElementById("add-expense").value.trim();
//     const expenseAmount = document.getElementById("add-e-amount").value.trim();
    
//     // Input validation
//     if (! expenseText || !expenseAmount) {
//         alert('Please fill in both income description and amount');
//         return;
//     }
    
//     if (isNaN(expenseAmount) || parseFloat(expenseAmount) <= 0) {
//         alert('Please enter a valid positive amount');
//         return;
//     }

//     try {
//         const response = await fetch(API_URL_expense, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 text: expenseText,
//                 amount: parseFloat(expenseAmount), // Convert to number
//             }),
//         });
        
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const newExpense = await response.json();
//         console.log('New income added:', newExpense);
        
//         // Add to local array and re-render
//         expense_lists.push(newExpense);
//         renderTodoList(expense_lists);
        
//         // Clear input fields
//         document.getElementById("add-expense").value = '';
//         document.getElementById("add-expense").value = '';
        
//     } catch (error) {
//         console.error('Error adding income:', error);
//         alert('Failed to add income. Please try again.');
//     }
// }

// // Initialize the application
// Main();

