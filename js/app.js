//Assign parts of the HTML document to variables.  This makes it easier to work with the selected areas in the code.
//------------------------------------------------------------------------------------------------------------------
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.todo-filter');
const form = document.getElementById('listForm');


//Add Event Listeners to the html document, button, list and filter
//-----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);


//FUNCTIONS
//---------

//This function is triggered when the add button is clicked
//---------------------------------------------------------
function addTodo(event) {
    event.preventDefault();

    //assign user input to listItem variable
    let listItem = todoInput.value;

    //Pass todo item to add if available
    if(listItem.trim() === '' || listItem.trim() == null) {
        validateInputForm();
    }
    else {
        addTodoItem(todoInput.value);
    }

    //Clear Input value
    todoInput.value = '';
}

//1.  Create a new HTML DIV.
//2.  Add a class ('todo') to the new DIV 
//3.  Create a new HTML <li> with a class of 'todo-item' and attach it to the div
//4.  Create a new HTML <button> with an <i (icon)> attribute and a class of 'complete-btn' and attach it to the div
//5.  Create another HTML <button> with an <i (icon)> attribute and a class of 'trash-btn' and attach it to the div
//6.  Append this to the HTML "todoList" that already exists in your html doc.
//7.  Clear the input field.
//    <DIV class="todo"><li class="todo-item"><button class="complete-btn"></b><button class=trash-btn></b></li></div>

function addTodoItem(todo) {

    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todo;   //todoInput.value
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //SAVE TO LOCAL STORAGE
    saveLocalTodos(todoInput.value);

    //CHECKMARK BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    //TRASH BUTTON
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add('trash-btn');
    todoDiv.appendChild(trashButton);

    //APPEND TO LIST
    todoList.appendChild(todoDiv);
}

//This function is triggered when a user tries to submit empty form
//-----------------------------------------------------------------
function validateInputForm() {
    let todoItem = document.forms['listForm']['todoItem'].value;

    if (todoItem === '' || todoItem == null) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter todo list item. . .',
        });
        return false;
    }
    else {
        return true;
    }
}


//This function is triggered when an item on the todo list is clicked.

//1.  Was the delete button clicked?
//2.  If the delete button is clicked, call the removeLocalTodos function and then remove item from list.
//-------------------------------------------------------------------------------------------------------
function deleteCheck(e) {
    const item = e.target;

    //DELETE TODO
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement;

        //Animation
        todo.classList.add('fall');
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function () {
            todo.remove();
        })
    }

    //3.  Was the 'completed' button clicked?//CHECK MARK
    //4.  If the completed button is clicked, toggle the item between ruled out and not ruled out.
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement;
        todo.classList.toggle('completed');
    }
}

//This function is triggered when the filter button is clicked.
// It filters the items in the to do list, based on what was chosen from the trigger list.
//----------------------------------------------------------------------------------------
function filterTodo(e) {
    const todos = todoList.childNodes;

    todos.forEach(function (todo) {
        switch (e.target.value) {
            case 'all':
                todo.style.display = 'flex';
                break;
            case 'completed':
                if (todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                }
                else {
                    todo.style.display = 'none';
                }
                break;
            case 'notCompleted':
                if (!todo.classList.contains('completed')) {
                    todo.style.display = 'flex';
                }
                else {
                    todo.style.display = 'none';
                }
                break;
        }
    });
}

//This function is called when a new item is added to the todo list.
//------------------------------------------------------------------
function saveLocalTodos(todo) {
    //check do I already have a local todo storage?

    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

//This function is triggered when the DomContentLoaded event occurs (the html document finishes loading)
//------------------------------------------------------------------------------------------------------
// 1.  if there is no existing local storage called 'todos' then assign an empty array to variable todos.
// 2.  If there is an existing local storeage called 'todos' fetch the items from local storage and parse then to a string using JSON.parse
// 3.  For each item in the todo array, create the html structure for an item and add it to the document
function getTodos() {
    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(todo => todoItems(todo));
}

//This function is called when when the browser is refreshed.
//-----------------------------------------------------------
function todoItems(todo) {
    //Todo DIV
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //Create LI
    const newTodo = document.createElement('li');
    newTodo.innerText = todo;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);

    //CHECKMARK BUTTON
    const completedButton = document.createElement('button');
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add('complete-btn');
    todoDiv.appendChild(completedButton);

    //TRASH BUTTON
    const trashButton = document.createElement('button');
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    //APPEND TO LIST
    todoList.appendChild(todoDiv);
}

//This function is called when an item is deleted from the list of items.
//It removes the item from the local storage array.
//-------------------------------------------------
function removeLocalTodos(todo) {

    let todos;

    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.splice(todos.indexOf(todo.children[0].innerText), 1);

    localStorage.setItem('todos', JSON.stringify(todos));
}
