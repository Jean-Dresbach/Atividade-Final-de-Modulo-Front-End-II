const api = axios.create();

const containerCards = document.getElementById("container-cards")
const prevPage = document.getElementById("prevPage")
const nextPage = document.getElementById("nextPage")

let characters

async function fetchCharacters(url) {
    try {
        const URL = url ?? "https://rickandmortyapi.com/api/character"
        
        const response = await api.get(URL)

        characters = response.data.results
        const info = response.data.info

        console.log(response.data)
        showCharacters(characters)
    } catch (error) {
        console.log(`Error when fetching characters: ${error}`)
    }
}

function showCharacters(characters) {
    containerCards.innerHTML = ""

    characters.forEach(character => {
        createCard(character)
    });
}

function createCard(character) {
    const characterImg = document.createElement("img")
    characterImg.src = character.image
    characterImg.classList.add("character-img")

    containerCards.appendChild(characterImg)

    characterImg.addEventListener("click", (e) => {
        e.preventDefault()
        showDetailedCharacterCard(character)
    })
}

function createDetailedCharacterCard(character) {
    const statusColor = defineStatusColor(character)
    
    const detailedCharacterCard = document.createElement("div")
    detailedCharacterCard.classList.add("detailed-character-card")

    detailedCharacterCard.innerHTML = `
        <img id="detailed-character-image" src="${character.image}">
        <div>
            <h2 class='text-h2'>${character.name}</h2>
            <p>${character.species} - ${character.gender} - <span style="color:${statusColor}">${character.status}</span></p>
            <p>Origin: ${character.origin.name}</p>
            <p>Last known location: ${character.location.name}</p>
        </div>
    `

    containerCards.appendChild(detailedCharacterCard)

    const detailedCharacterImage = document.getElementById("detailed-character-image")

    detailedCharacterImage.addEventListener("click", (e) => {
        e.preventDefault()
        closeDetailedCharacterCard(characters)
    })

    return detailedCharacterCard
}

function closeDetailedCharacterCard(characters) {
    showCharacters(characters)
}

function showDetailedCharacterCard(character) {
    containerCards.innerHTML = ""
    createDetailedCharacterCard(character)
}

function defineStatusColor(character) {
    let statusColor = ""
    if (character.status === "Alive") {
        statusColor = "#B6F300"
    } else if (character.status === "Dead") {
        statusColor = "#E23838"
    } else {
        statusColor = "#b3b3b3"
    }

    return statusColor
}

fetchCharacters()