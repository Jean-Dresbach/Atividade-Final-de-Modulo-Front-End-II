const api = axios.create({
    baseURL: "https://rickandmortyapi.com/api"
});

const containerCards = document.getElementById("container-cards");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");

async function fetchCharacters() {
    try {
        const response = await api.get("/character");
        
        const characters = response.data.results;
        const info = response.data.info;

        
        console.log(response.data);
        showCharacters(characters);
    } catch (error) {
        console.log(`Error when fetching characters: ${error}`);
    }
}

function showCharacters(characters) {   
    characters.forEach(character => {
        const card = document.createElement("div");
        card.classList.add('card');
        card.style.backgroundColor = "none";
        card.style.border = "none";
        card.style.padding = "0";
        card.innerHTML = `
            <img src="${character.image}">
        `;
        card.addEventListener("click", () => {
            let statusColor = "";
            if(character.status === "Alive") {
                statusColor = "#B6F300";
            } else if(character.status === "Dead") {
                statusColor = "#E23838";
            } else {
                statusColor = "#737373";
            }
            
            containerCards.innerHTML = `
                <img id="close-button" src="./images/remove.png" alt="close-icon"> 
            `;
            
            const closeButton = document.getElementById("close-button");
            closeButton.style.display = "block";
            closeButton.addEventListener("click", () => {
                window.location.reload();
            });
            card.style.backgroundColor = "#00b4cc90";
            card.style.border = "2px solid white";
            card.style.padding = "30px";
            card.innerHTML = `
                <img id="focused-card" style="opacity: 1; filter: grayscale(0); transform: scale(1)" src="${character.image}">
                <h2>${character.name}</h2>
                <p>${character.species} - ${character.gender} - <span style="font-weight: bold; color:${statusColor}">${character.status}</span></p>
                <p>Origin: ${character.origin.name}</p>
                <p>Last known location: ${character.location.name}</p>
            `;
            
            containerCards.appendChild(card);
        })

        containerCards.appendChild(card);
    });
}

fetchCharacters();