import { tiposPokemon } from "./tipos.js"
import { criarCard } from "./criarCard.js"

let btnEnvio = document.getElementById('btn-enviar')
let pokeName = document.getElementById('inome-pokemon')

let favoritos = JSON.parse(localStorage.getItem('bancoFavoritos')) || []

pokeName.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        procurarPokemon(pokeName)
    }
})

btnEnvio.addEventListener('click', () => procurarPokemon(pokeName))

function procurarPokemon(pokeName){
    let campoRes = document.getElementById('card')
    campoRes.style.display = 'block'
    
    if(pokeName.value.length == 0){
        campoRes.innerHTML = `<p>[ERRO]: Campo vazio, digite um nome para procurar</p>`
    }else{
        campoRes.innerHTML = `Carregando...`
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.value}`)
        .then(response => {
            if(!response.ok){
                throw new Error(`Pokémom não encontrado, corrija a ortografia e lembre-se de digitar o nome em inglês!`)
            }
            
            return response.json()
        })
        .then(pokemon => {
            criarCard(pokemon)
        })
        .catch(error => {
            campoRes.innerHTML = `<p>[ERRO]: ${error}</p>`
        })
    }
    
    pokeName.focus()
}

export function favoritarPokemon(){
    let index = favoritos.indexOf(pokeName.value.toLowerCase())
    let btnEstrela = document.getElementById('btn-star')
    
    if(!favoritos.includes(pokeName.value.toLowerCase())){
        favoritos.push(pokeName.value.toLowerCase())
        
        btnEstrela.classList.remove('fa-regular')
        btnEstrela.classList.add('fa-solid')
        btnEstrela.style.color = 'gold'
    }else{
        favoritos.splice(index, 1)

        btnEstrela.classList.remove('fa-solid')
        btnEstrela.classList.add('fa-regular')
        btnEstrela.style.color = 'black'
    }

    localStorage.setItem('bancoFavoritos', JSON.stringify(favoritos))
}