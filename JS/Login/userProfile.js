import { URL_USER } from "../API/URLS.js";
import { cleanHTML, get, update } from "../API/clientHTTP.js";

//Selectorspets
const dataUser = document.querySelector(".dataUser");
const editInfoUser = document.getElementById("editInfoUser");
const bodyModalEditInfoUser = document.getElementById("bodyModalEditInfoUser");
const imageDeafault = "https://assets.epuzzle.info/puzzle/069/107/original.jpg";
const pictureUserProfile = document.querySelector("#pictureUserProfile");
let id = localStorage.getItem("userid");
const misAmigos = document.getElementById("misAmigos");
const modalBody = document.getElementById("modalBody");
const nameUserMenu = document.getElementById("nameUserMenu");
let photoProfile = document.getElementById("photoProfile");
const modalBodyNotificaciones = document.getElementById("modalBodyNotificaciones");
const btnNotificaciones = document.querySelector(".btnNotificaciones");




//Events

document.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault()

  cambioFotoPerfil();
  paintInformationClient();
  infoNavbar();

});

btnNotificaciones.addEventListener("click", (event) => {
  event.preventDefault()
  notificacionAmistad()

})

editInfoUser.addEventListener("click", (event) => {
  event.preventDefault();
  editInformationProfile();

  formEditUser.addEventListener("submit", (event) => {
    event.preventDefault();

    editInfo();
  });
});

misAmigos.addEventListener("click", () => {
  mostrarAmigos()
})




//Functions


async function infoNavbar() {

  const response = await get(`${URL_USER}/${id}`);

  nameUserMenu.textContent = response.nameUser;

  photoProfile.innerHTML = `
  <img
  src="${response.urlPhoto || imageDeafault}"  alt="foto de perfil"
/>`
}

async function cambioFotoPerfil() {

  const response = await get(`${URL_USER}/${id}`);

  pictureUserProfile.innerHTML += `
  <img src="${response.urlPhoto || imageDeafault}" class="rounded photoUser" alt="Cliente 1" />
`;
}

async function paintInformationClient() {
  const response = await get(`${URL_USER}/${id}`);


  dataUser.innerHTML = `

            <h5 class="nameUser">${response.nameUser}</h5>
            <br>
            <div class="line"></div>
            <br>
            <p><strong>Telefono: </strong><span>${response.cellphoneUser}</span></p>
            <p id = "id-user" data-id = ${response.id}></p>
    `;

}

async function editInformationProfile() {
  const response = await get(`${URL_USER}/${id}`);

  bodyModalEditInfoUser.innerHTML = `
  
                  <label for="formFileUser" class="form-label">Agrega tu foto de perfil</label>
                  <input class="form-control" value= "${response.urlPhoto}" type="file" type="file" id="formFileUser">

                  <label for="telphoneEditUser" class="form-label">Edita tu numero celular</label>
                  <input type="number" value= "${response.cellphoneUser}" id="telphoneEditUser"/>
                  <label for="passwordEditUser" class="form-label">Ingrese la nueva contraseña</label>
                  <input type="password" value= "${response.password}" id="passwordEditUser" placeholder="Ingrese su di"/>
                `;
}

async function editInfo() {
  let data = "";

  if (formFileUser.files[0]) {
    const file = formFileUser.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "eo8kkawj");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dlghqei9h/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    data = await response.json();
  }

  const response = await get(`${URL_USER}/${id}`);

  console.log(data.url);

  response.urlPhoto = data.url != undefined ? data.url : response.urlPhoto;
  response.cellphoneUser = telphoneEditUser.value;

  await update(`${URL_USER}/${id}`, response);
}

async function mostrarAmigos() {

  cleanHTML(modalBody);

  const responseFriends = await get(`${URL_USER}/${id}`);

  const responseFriendAll = await get(`${URL_USER}`);

  responseFriends.friends.forEach(friend => {

    responseFriendAll.forEach(friends => {

      if (friend.friendId == friends.id && friend.status == "Aceptado") {

        modalBody.innerHTML += `
        <div class="cardModalVerAmigos">
          <img src="${friends.urlPhoto || imageDeafault}" class="profileImageVerAmigos" alt="...">
          <div class="infoModalVerAmigos">
            <h5 class= "text-center">${friends.nameUser}</h5>
            <div class="buttonsModalVerAmigos">
              <button class= "btn btn-danger btnElimanarAmigo" data-id="${friend.matchId}">Eliminar amigo</button>
            </div>
          </div>
        </div>
    
        `
      }
    });
  });

  let matchId = "";

  modalBody.addEventListener("click", (event) => {
    matchId = event.target.dataset.id;
    eliminarAmigo(matchId);
  })
}


async function eliminarAmigo(matchId) {

  console.log(matchId);

  let responseUser = await get(`${URL_USER}/${id}`);

  const objetFriend = responseUser.friends.filter(friend => friend.matchId == matchId);
  let responseUserFriend = await get(`${URL_USER}/${objetFriend[0].friendId}`);

  console.log(responseUserFriend);


  responseUser.friends = responseUser.friends.filter(friend => friend.matchId != matchId);
  await update(`${URL_USER}/${id}`, responseUser);

  responseUserFriend.friends = responseUserFriend.friends.filter(friend => friend.matchId != matchId);

  await update(`${URL_USER}/${objetFriend[0].friendId}`, responseUserFriend);

  console.log(responseUserFriend);

}


async function notificacionAmistad() {

  cleanHTML(modalBodyNotificaciones)

  let friendArray = [];

  const responseFriends = await get(`${URL_USER}/${id}`);

  let friends = responseFriends.friends.filter(friend => friend.status == "Pendiente" && friend.isTheAggregator == false);

  for (let index = 0; index < friends.length; index++) {

    const response = await get(`${URL_USER}/${friends[index].friendId}`);
    let data = {
      id: response.id,
      urlPhoto: response.urlPhoto,
      name: response.nameUser,
      tableMatchId: friends[index].matchId
    }

    friendArray.push(data);

    console.log(friendArray);
  }


  friendArray.forEach(friend => {
    modalBodyNotificaciones.innerHTML += `

         <div class="cardModalInfo">
              <img class="profileImageInfo" 
              src="${friend.urlPhoto}">
              <div class="infoModal">
                <h3>${friend.name}</h3>
                <div class="buttonsModalInfo">
                  <button class= "btn btn-success btnAceptarAmigo" id-aceptar="${friend.tableMatchId}">Aceptar solicitud</button>
                  <button class= "btn btn-danger btnEliminarAmigo" id-eliminar="${friend.tableMatchId}">Cancelar solicitud</button>
                </div>
              </div>
             </div>
         `
  });

  aceptarSolicitud();

  const botones = document.querySelectorAll(".btnEliminarAmigo");

  botones.forEach(boton => {

    boton.addEventListener("click", async () => {

      const idSolicitudEliminar = boton.getAttribute("id-eliminar");

      eliminarAmigo(idSolicitudEliminar);
      
    });
  })

}

async function aceptarSolicitud() {

  const botones = document.querySelectorAll(".btnAceptarAmigo");
  let user = await get(`${URL_USER}/${id}`);

  botones.forEach(boton => {

    boton.addEventListener("click", async () => {

      const idSolicitudAceptar = boton.getAttribute("id-aceptar");

      let friendsStatusNoChange = user.friends.filter(friend => friend.matchId != idSolicitudAceptar);
      user.friends = user.friends.filter(friend => friend.matchId == idSolicitudAceptar);

      let userFriend = await get(`${URL_USER}/${user.friends[0].friendId}`);
      console.log(userFriend);
      user.friends[0].status = "Aceptado";
      friendsStatusNoChange.forEach(element => {

        user.friends.push(element);
      });

      await update(`${URL_USER}/${id}`, user);
      console.log(idSolicitudAceptar);

      let friendsStatusAcept = userFriend.friends.filter(friend => friend.matchId != idSolicitudAceptar);
      userFriend.friends = userFriend.friends.filter(friend => friend.matchId == idSolicitudAceptar);
      console.log(friendsStatusAcept);

      console.log(userFriend);
      userFriend.friends[0].status = "Aceptado";

      friendsStatusAcept.forEach(element => {

        userFriend.friends.push(element);
      });

      await update(`${URL_USER}/${user.friends[0].friendId}`, userFriend);
    });
  })

}

