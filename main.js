const todoApp = document.querySelector('.todo-app');
const todoInput = document.querySelector('#todo-input');
const todoForm = document.querySelector('#todo-form');
const todoList = document.querySelector('#todo-list');
let remaining = document.querySelector('#remaining');
let freshLoad = true;

function buildTodoItem(input) {
  // Create li-element with calss todo-item
  const newElement = document.createElement('li');
  newElement.classList.add('todo-item');

  // Create Checkbox
  const newInput = document.createElement('input');
  newInput.setAttribute('type', 'checkbox');
  newInput.setAttribute('name', 'check');
  newInput.classList.add('todo-check');
  if (input.checked === 'true') {
    newInput.checked = true;
  }

  // Create Span that holds the input
  const newSpan = document.createElement('span');
  newSpan.textContent = input.value;
  // Check if span should be striked through.
  if (input.checked === 'true') {
    newSpan.classList.add('strikethrough');
  }
  // Create Deletebutton
  const newButton = document.createElement('button');
  newButton.classList.add('btn', 'btn-remove');
  newButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  // Append all to
  newElement.appendChild(newInput);
  newElement.appendChild(newSpan);
  newElement.appendChild(newButton);

  return newElement;
}

function createLocalStorage(key, value) {
  let storage = [];
  // storage.push({value: `${value}`, checked: false})
  localStorage.setItem(key, JSON.stringify(storage));
}

function readLocalStorage() {
  if (localStorage.saveData === undefined) {
    return false;
  } else {
    return JSON.parse(localStorage.getItem('saveData'));
  }
}

function UpdateLocalStorage(key, value) {
  let storage = JSON.parse(localStorage.getItem('saveData'));
  storage.push({ value: `${value}`, checked: 'false' });
  localStorage.setItem(key, JSON.stringify(storage));
}

function checkDuplicateLocalStorage(key, value) {
  let storage = JSON.parse(localStorage.getItem(key));
  let answere = [];
  storage.forEach((item) => {
    if (item.value === value) {
      answere.push(value);
    }
  });

  if (answere.length === 0) {
    return false;
  } else {
    return true;
  }
}

function changeCheckLocalStorage(key, value) {
  let storage = JSON.parse(localStorage.getItem('saveData'));
  let k = 'value';
  let index = storage.map((temp) => temp[k]).indexOf(value);
  if (storage[index].checked === 'false') {
    storage[index].checked = 'true';
  } else {
    storage[index].checked = 'false';
  }
  localStorage.setItem(key, JSON.stringify(storage));
}

function deleteLocalStorage(key, value) {
  let storage = JSON.parse(localStorage.getItem('saveData'));
  let k = 'value';
  let index = storage.map((temp) => temp[k]).indexOf(value);
  storage.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(storage));
}

function showTodos(todos) {
  todoList.innerHTML = '';
  todos.forEach((todo) => {
    todoList.append(buildTodoItem(todo));
  });
}

function itemsRemaining() {
  let itemsTotal = document.querySelectorAll('.todo-item').length;
  let finished = document.querySelectorAll('.strikethrough').length;

  remaining.textContent = `${itemsTotal - finished} items remaining.`;
}

function flash(message, color){
  // Create div-element with class of flash
  const newElement = document.createElement('div');
  newElement.classList.add('flash');
  newElement.style.backgroundColor = `var(${color})`;
  
  // Create paragraph that holds the message
  const newP = document.createElement('p');
  newP.textContent = message;

  // Append paragraph to div
  newElement.appendChild(newP);

  todoApp.insertAdjacentElement("afterbegin", newElement);

  setTimeout(()=>{
    newElement.remove();
  },3000)

}
// Check if its first time user and setup accordingly.
if (freshLoad && readLocalStorage() === false) {
  freshLoad = false;
  createLocalStorage('saveData', '');
  itemsRemaining();
} else {
  showTodos(readLocalStorage());
  itemsRemaining();
}
// Duplicate check, update localstorage and display
todoForm.addEventListener('submit', (e) => {
  e.preventDefault;
  if (!checkDuplicateLocalStorage('saveData', todoInput.value)) {
    UpdateLocalStorage('saveData', todoInput.value);
    showTodos(readLocalStorage());
    todoInput.value = '';
    itemsRemaining();
  } else{
    flash('You already have that todo!', '--clr-error')
    todoInput.value = '';
  }
});
// Add eventlistener to the ul-element
todoList.addEventListener('click', (e) => {

  //Toggle strikethrough and update localstorage.
  if (e.target.classList.contains('todo-check')) {
    let li = e.target.closest('li');
    li.querySelector('span').classList.toggle('strikethrough');
    changeCheckLocalStorage('saveData', li.querySelector('span').textContent);
    itemsRemaining();
    showTodos(readLocalStorage());
  }
  // Remove item if delete-button is clicked
  if (e.target.closest('.btn-remove')) {
    const deleteButton = e.target.closest('.btn-remove');
    if (deleteButton.contains(e.target)) {
      e.target.closest('.todo-item').remove();
      let li = e.target.closest('li');
      deleteLocalStorage('saveData', li.querySelector('span').textContent);
      showTodos(readLocalStorage());
      itemsRemaining();
    }
  }
});
