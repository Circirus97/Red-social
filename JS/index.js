import { URL_USER } from "./API/URLS.js";
import { get, update } from "./API/clientHTTP.js";



let id = localStorage.getItem("userid");
const sugerenciaAmigosCard = document.getElementById("sugerenciaAmigosCard");
const imageDeafault = "https://assets.epuzzle.info/puzzle/069/107/original.jpg";
// const btnAgregarAmigo = document.querySelector(".btnAgregarAmigo");



//Eventos

document.addEventListener("DOMContentLoaded", () => {
    infoNavbar();
    sugerenciaAmistades();
});

//Funciones


async function infoNavbar() {

    const response = await get(`${URL_USER}/${id}`);

    nameUserMenu.textContent = response.nameUser;

    photoProfile.innerHTML = `
    <img
    src="${response.urlPhoto || imageDeafault}"  alt="foto de perfil"
  />`
}


async function sugerenciaAmistades() {
    const responseFriendAll = await get(`${URL_USER}`);

    responseFriendAll.forEach(friends => {

        if (id != friends.id ) {

            sugerenciaAmigosCard.innerHTML += `
                <div class="card mb-3">
                    <div class="row g-0 cardAgregarAmigos">
                        <div class="col-md-4" >
                            <img
                            src="${friends.urlPhoto || imageDeafault}"
                            class="img-fluid rounded-start imgCard"
                            alt="..."
                            />
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                            <h5 class="card-title">${friends.nameUser}</h5>
                            <button class= "btn btn-primary btnAgregarAmigo" data-id="${friends.id}">Agregar amigo</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                `
        }
    });

    let friendId = "";

    sugerenciaAmigosCard.addEventListener("click", (event) => {
        friendId = event.target.dataset.id;

        agregarAmigo(friendId);
    })

}

async function agregarAmigo(friendId) {

    const responseUser = await get(`${URL_USER}/${id}`);
    const responseUserFriend = await get(`${URL_USER}/${friendId}`);

    console.log(responseUser.friends);
    const friend = {
        id: self.crypto.randomUUID(),
        friendId: friendId,
        status: "Pendiente",
        isTheAggregator: true,
        matchId : self.crypto.randomUUID()
    }

    responseUser.friends.push(friend);

    await update(`${URL_USER}/${id}`, responseUser);

    const friendAdd = {
        id: self.crypto.randomUUID(),
        friendId: id,
        status: "Pendiente",
        isTheAggregator: false,
        matchId : friend.matchId
    }

    responseUserFriend.friends.push(friendAdd);

    await update(`${URL_USER}/${friendId}`, responseUserFriend);

}



