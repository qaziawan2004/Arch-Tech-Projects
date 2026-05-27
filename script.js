let inp = document.getElementById("input");
let ul = document.getElementById("ul");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

todos = todos.filter(item => item && item.id && item.text);

function submit() {

    if (inp.value.trim() === "") {
        return;
    }

    let obj = {
        id: Date.now(),
        text: inp.value,
        isCompleted: false
    };

    todos.push(obj);

    localStorage.setItem("todos", JSON.stringify(todos));

    inp.value = "";

    getTodo();
}

function getTodo() {

    if (!ul) return;

    ul.innerHTML = "";

    for (let i = 0; i < todos.length; i++) {

        // SKIP INVALID
        if (!todos[i]) continue;

        let id = todos[i].id;

        // CREATING  LI
        let li = document.createElement("li");

        li.style.listStyle = "none";
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.marginTop = "10px";
        li.style.padding = "10px";
        li.style.backgroundColor = "#f1f1f1";
        li.style.borderRadius = "8px";

        let span = document.createElement("span");
        span.innerText = todos[i].text;

        if (todos[i].isCompleted) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        let btnDiv = document.createElement("div");

        // DELETE BUTTON
        let dlt = document.createElement("button");

        dlt.innerText = "🗑️";

        dlt.style.backgroundColor = "#dd0303";
        dlt.style.color = "white";
        dlt.style.border = "none";
        dlt.style.padding = "8px";
        dlt.style.marginLeft = "5px";
        dlt.style.borderRadius = "5px";
        dlt.style.cursor = "pointer";

        dlt.addEventListener("click", function () {
            dltTodo(id);
        });

        //  UPDATE BUTTON

        let update = document.createElement("button");

        update.innerText = "Update";

        update.style.backgroundColor = "#0000FF";
        update.style.color = "white";
        update.style.border = "none";
        update.style.padding = "8px";
        update.style.marginLeft = "5px";
        update.style.borderRadius = "5px";
        update.style.cursor = "pointer";

        update.addEventListener("click", function () {
            upDateTodo(id);
        });

        // status button
        let pnd = document.createElement("button");

        pnd.innerText = todos[i].isCompleted ? "✅" : "...";

        pnd.style.backgroundColor = "#7F00FF";
        pnd.style.color = "white";
        pnd.style.border = "none";
        pnd.style.padding = "8px";
        pnd.style.marginLeft = "5px";
        pnd.style.borderRadius = "5px";
        pnd.style.cursor = "pointer";

        pnd.addEventListener("click", function () {
            pndTodo(id);
        });

        btnDiv.appendChild(update);
        btnDiv.appendChild(dlt);
        btnDiv.appendChild(pnd);

        li.appendChild(span);
        li.appendChild(btnDiv);

        ul.appendChild(li);
    }
}

// DELETE TODO
function dltTodo(id) {

    todos = todos.filter(todo => todo.id !== id);

    localStorage.setItem("todos", JSON.stringify(todos));

    getTodo();
}

// UPDATE TODO
function upDateTodo(id) {

    for (let i = 0; i < todos.length; i++) {

        if (todos[i].id === id) {

            let updated = prompt("Enter updated value");

            if (updated && updated.trim() !== "") {

                todos[i].text = updated;
            }
        }
    }

    localStorage.setItem("todos", JSON.stringify(todos));

    getTodo();
}
//checkstatus 
function pndTodo(id) {

    for (let i = 0; i < todos.length; i++) {

        if (todos[i].id === id) {

            todos[i].isCompleted = !todos[i].isCompleted;
        }
    }

    localStorage.setItem("todos", JSON.stringify(todos));

    getTodo();
}

getTodo();

function home() {
    window.location.href="./index.html";
};


// SIGNUP INPUTS
let userName = document.querySelector(".userName");
let storedEmail = document.querySelector(".userEmail");
let storedPass = document.querySelector(".userPassword");

// LOGIN INPUTS
let userEmail = document.getElementById("userEmail");
let userPass = document.getElementById("userPass");

// STORAGE
let storage = JSON.parse(localStorage.getItem("storage")) || [];

// REMOVE INVALID USERS
storage = storage.filter(user =>
    user &&
    user.id &&
    user.userName &&
    user.email &&
    user.password
);

//  SIGNUP 

function goSign() {

    // CHECK EMPTY
    if (!userName || !storedEmail || !storedPass) return;

    if (userName.value.trim() === "") return;
    if (storedEmail.value.trim() === "") return;
    if (storedPass.value.trim() === "") return;

    // CHECK EXISTING USER
    let alreadyExist = storage.find(user =>
        user.email === storedEmail.value
    );

    if (alreadyExist) {
        alert("Email already exists!");
        return;
    }

    // CREATE USER OBJECT
    let user = {
        id: Date.now(),
        userName: userName.value,
        email: storedEmail.value,
        password: storedPass.value
    };

    storage.push(user);

    localStorage.setItem("storage", JSON.stringify(storage));

    userName.value = "";
    storedEmail.value = "";
    storedPass.value = "";


    alert("Signup Successful!");
    window.location.href = "./Login.html";
}

// LOGIN
function login() {

    if (!userEmail || !userPass) return;

    if (userEmail.value.trim() === "") {
        alert("Enter Email");
        return;
    }

    if (userPass.value.trim() === "") {
        alert("Enter Password");
        return;
    }

    let foundUser = storage.find(user =>
        user.email === userEmail.value &&
        user.password === userPass.value
    );

    if (foundUser) {

        alert("Login Successful");

        // SAVE CURRENT USER
        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        // REDIRECT
        window.location.href = "./index.html";

    } else {

        alert("Invalid Email or Password");
    }
}
function logOut(){
 

    localStorage.removeItem("storage", JSON.stringify(storage));
    localStorage.removeItem("todos", JSON.stringify(todos))
    alert("Log out Successful");
    window.location.href = "./SignUp.html"
};