const api = axios.create({
    baseURL: "https://rickandmortyapi.com/api"
});

const searchCharactersByName = document.getElementById("search-characters-by-name")
const selectPages = document.getElementById("select-pages")
const containerCards = document.getElementById("container-cards")
const prevPageButton = document.getElementById("prevPage")
const nextPageButton = document.getElementById("nextPage")

prevPageButton.addEventListener("click", goToPrevPage)
nextPageButton.addEventListener("click", goToNextPage)

let characterName = ''
let characters
let info

async function fetchCharacters(page = 1, name = "", selectedOptionIndex) {
    try {
        const params = {
            page,
            name
          }

        const response = await api.get("/character/", {
            params
        })

        characters = response.data.results
        info = response.data.info

        showCharacters(characters)
        createOption(selectedOptionIndex)
        disableButtonsIfPageNull(info)
        updateSelectedPage(page)
    } catch (error) {
        console.log(`Error when fetching characters: ${error}`)
    }
}

function createOption(selectedOptionIndex) {
    selectPages.innerHTML = `
        <option id="disabled-option" value="" disabled>Select Page</option>
    `

    for (let index = 1; index <= info.pages; index++) {
        const option = document.createElement("option")    
        option.value = index
        option.innerText = `Page ${index}`
        selectPages.appendChild(option)
    }

    if (selectedOptionIndex) {
        selectPages.options[selectedOptionIndex].selected = true 
    }

    selectPages.addEventListener("change", () => {
        const selectedOptionIndex = selectPages.selectedIndex

        selectPages.options[selectedOptionIndex].selected = true
        
        const page = selectPages.options[selectedOptionIndex].value
        
        const name = verificateInput()

        fetchCharacters(page, name, selectedOptionIndex)
    })
}

function verificateInput() {
    if(searchCharactersByName.value !== "")

    return searchCharactersByName.value
}

function updateSelectedPage(currentPage) {
    selectPages.value = currentPage
}


function goToPrevPage() {
    const prevPageUrl = info.prev

    const prevPage = Number(prevPageUrl.split('?page=')[1].split("&")[0])

    const name = verificateInput()

    fetchCharacters(prevPage, name)
}

function goToNextPage() {
    const nextPageUrl = info.next

    const nextPage = Number(nextPageUrl.split('?page=')[1].split("&")[0])

    const name = verificateInput()

    fetchCharacters(nextPage, name)
}

function disableButtonsIfPageNull(info) {
    !info.prev ? prevPageButton.classList.add("disabled-button") : prevPageButton.classList.remove("disabled-button")
    
    !info.next ? nextPageButton.classList.add("disabled-button") : nextPageButton.classList.remove("disabled-button")
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

function showDetailedCharacterCard(character) {
    containerCards.innerHTML = ""
    createDetailedCharacterCard(character)
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

function closeDetailedCharacterCard(characters) {
    fetchCharacters()
}

searchCharactersByName.addEventListener('input', () => {
    const page = 1

    characterName = searchCharactersByName.value

    fetchCharacters(page, characterName)
})

fetchCharacters()