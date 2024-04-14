import { URL_USER } from "../API/URLS.js";
import { get, post } from "../API/clientHTTP.js";

//Selectores
const formUserResgister = document.getElementById("form");
const nameUser = document.getElementById("name");
const emailUser = document.getElementById("email");
const cellphoneUser = document.getElementById("telphone");
const passwordUser = document.getElementById("password");
const submitLogin = document.getElementById("submitLogin");
const btnSubmitCreateAccount = document.getElementById("submitCreateAccount");

//Eventos

formUserResgister.addEventListener("submit", (event) => {
  event.preventDefault();
  addUser();
  window.location.href = "userLogin.html";
});

submitLogin.addEventListener("click", (event) => {
  event.preventDefault();
  formUserResgister.classList.remove("was-validated");
  window.location = "userLogin.html";
});


//Functions

async function addUser() {

  if (await validateEmail()) {
    console.error("El email ya se encuentra registrado.");
    return;
  }

  console.log("Pasaste las validaciones");

  const newUser = {

    email: emailUser.value,
    passwordUser: passwordUser.value,
    nameUser: nameUser.value,
    cellphoneUser: cellphoneUser.value,
    friends: []
  }

  await post(URL_USER, newUser);

}

async function validateEmail() {


  const userResponse = await get(`${URL_USER}?email=${emailUser.value}`);

  console.log(userResponse);

  if (userResponse == []) {
    return true;
  }

  return false;



}
