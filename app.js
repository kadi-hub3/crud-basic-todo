const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = "";



const addItem = (e) => {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();//unique id using only vanilla js no frmwrk
    if (value && !editFlag) {
        createListItems(id, value);
        //display alert
        displayAlert('item added', 'success');
        //show container
        container.classList.add('show-container');
        //add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault();

    }
    else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert('item edited', 'success');
        //edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    } else {
        displayAlert('please enter a value', 'danger');
    }
}



const displayAlert = (text, action) => {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(() => {
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 1000);
};

const clearItems = () => {
    const items = document.querySelectorAll('.grocery-item');
    if (items.length > 0) {
        items.forEach((item) => {
            list.removeChild(item)
        });
    }
    container.classList.remove('show-container');
    displayAlert('list cleared', 'danger');
    setBackToDefault();
    localStorage.removeItem('list');
}


const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if (list.children.length === 0) {
        container.classList.remove('show-container');
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);
}

const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}

const setBackToDefault = () => {
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit';
}

// ***** local storage ******
const addToLocalStorage = (id, value) => {

    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}

const removeFromLocalStorage = (id) => {
    let items = getLocalStorage();
    items = items.filter((item) => {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}

const editLocalStorage = (id, value) => {
    //set item 
    let items = getLocalStorage();
    //get item
    items = items.map((item) => {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
    //remove item
    //save as strings
}

const getLocalStorage = () => {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

//*****Set up Items *******/

const setupItems = () => {
    let items = getLocalStorage();
    if (items.length > 0) {
        items.forEach((item) => {
            createListItems(item.id, item.value);
        });
        container.classList.add('show-container');

    }
}
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

const createListItems = (id, value) => {
    const element = document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    //add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fa fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fa fa-trash"></i>
        </button>
    </div>`
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    //append child
    list.appendChild(element);
}
