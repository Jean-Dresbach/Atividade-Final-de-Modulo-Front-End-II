const api = axios.create();

const searchCharactersByName = document.getElementById("search-characters-by-name")
const selectPages = document.getElementById("select-pages")
const containerCards = document.getElementById("container-cards")
const prevPageButton = document.getElementById("prevPage")
const nextPageButton = document.getElementById("nextPage")

prevPageButton.addEventListener("click", goToPrevPage)
nextPageButton.addEventListener("click", goToNextPage)
selectPages.addEventListener("change", selectPage)

let characters
let info

async function fetchCharacters(url, selectedOptionIndex) {
    try {
        const URL = url ?? "https://rickandmortyapi.com/api/character"
        
        const response = await api.get(URL)

        characters = response.data.results
        info = response.data.info

        console.log(response.data)
        showCharacters(characters)
        createOption(selectedOptionIndex)
        disableButtonsIfPageNull(info)
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
        option.value = `https://rickandmortyapi.com/api/character/?page=${index}`
        option.innerText = `Page ${index}`
        selectPages.appendChild(option)
    }

    if (selectedOptionIndex) {
        selectPages.options[selectedOptionIndex].selected = true 
    }
}

function selectPage(e) {
    e.preventDefault()
    
    selectPages.options[selectPages.selectedIndex].selected = true
    const selectedOptionUrl = selectPages.options[selectPages.selectedIndex].value
    const selectedOptionIndex = selectPages.selectedIndex

    fetchCharacters(selectedOptionUrl, selectedOptionIndex)
}

function goToPrevPage() {
    const prevPageUrl = info.prev
    for (let index = 0; index < selectPages.options.length; index++) {
        if (selectPages.options[index].value === prevPageUrl) {
            const selectedOptionIndex = index
            fetchCharacters(prevPageUrl, selectedOptionIndex)
            break
        }
    } 
}

function goToNextPage() {
    const nextPageUrl = info.next
    for (let index = 0; index < selectPages.options.length; index++) {
        if (selectPages.options[index].value === nextPageUrl) {
            const selectedOptionIndex = index
            fetchCharacters(nextPageUrl, selectedOptionIndex)
            break
        }
    }    
}

function disableButtonsIfPageNull(info) {
    if (!info.prev) {
        prevPageButton.classList.add("disabled-button")
    } else {
        prevPageButton.classList.remove("disabled-button")
    }

    if (!info.next) {
        nextPageButton.classList.add("disabled-button")
    } else {
        nextPageButton.classList.remove("disabled-button")
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

searchCharactersByName.addEventListener('input', () => {
    const url = `https://rickandmortyapi.com/api/character/?name=${searchCharactersByName.value}`

    fetchCharacters(url)
})
  

fetchCharacters()