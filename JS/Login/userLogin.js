import { get } from "../API/clientHTTP.js";
import { URL_USER } from "../API/URLS.js";


//Selectores
const emailUser = document.getElementById("email");
const passwordUser = document.getElementById("password");
const btnSubmit = document.getElementById("submitLogin");
const submitCreateAccount = document.getElementById("submitCreateAccount");

//Events

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  userLogin();
});

submitCreateAccount.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.href = "userRegister.html";
});

//Funciones

async function userLogin() {

  const response = await get(`${URL_USER}?email=${emailUser.value}&password=${passwordUser.value}`);

  if (!response.length) {
    console.error("Email no registrado");
    return;
  }

  if (response[0].password == passwordUser.value) {
    localStorage.clear();
    localStorage.setItem("isAuthenticatedUser", true);
    localStorage.setItem("userid", response[0].id);
    window.location.href = "index.html";
  }

}
