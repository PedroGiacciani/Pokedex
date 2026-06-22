import { tiposPokemon } from "./tipos.js"

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
            const tipo1 = pokemon.types[0].type.name
            const tipo2 = pokemon.types[1]?.type.name
            const cor1 = tiposPokemon[tipo1].cor
            if(tipo2){
                campoRes.style.background = `
                linear-gradient(135deg, ${cor1}, ${tiposPokemon[tipo2].cor})
                `
            }else{
                campoRes.style.background = cor1
            }
            
            const icone1 = tiposPokemon[tipo1].icon
            const icone2 = tiposPokemon[tipo2]?.icon
            const favoritado = favoritos.includes(pokeName.value.toLowerCase())
            
            campoRes.innerHTML = ``
            
            campoRes.innerHTML += `
            <div id="inicio">
                <div id="estrela">
                    <p><b>${pokemon.name}</b></p>
                    <i class="${favoritado? 'fa-solid fa-star': 'fa-regular fa-star'}" id="btn-star" style="color: ${favoritado? 'gold': 'black'}"></i>
                </div>
                <p><i class="${icone1}"></i> <b>${pokemon.types.map(pos => pos.type.name).join(` - <i class="${icone2}"></i>`)}</b></p>
            </div>
            <div id="imagem">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="imagem do ${pokemon.name}">
            </div>
            <div id="status">
                ${pokemon.stats.map(pos => `<p><b>${pos.stat.name}</b>: ${pos.base_stat}</p>`).join('')}
            </div>
            `
            let btnEstrela = document.getElementById('btn-star')
            btnEstrela.addEventListener('click', favoritarPokemon)
        })
        .catch(error => {
            campoRes.innerHTML = `<p>[ERRO]: ${error}</p>`
        })
    }
    
    pokeName.focus()
}

function favoritarPokemon(){
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