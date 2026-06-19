let btnEnvio = document.getElementById('btn-enviar')
let pokeName = document.getElementById('inome-pokemon')

let favoritos = JSON.parse(localStorage.getItem('bancoFavoritos')) || []

pokeName.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        procurarPokemon()
    }
})

btnEnvio.addEventListener('click', () => procurarPokemon())

function procurarPokemon(){
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

            console.log(pokemon)

            const tiposPokemon = {
                normal: { cor: '#a8a77a', icon: "fa-regular fa-circle-dot"},
                fire: {cor: '#EE8130', icon: "fa-solid fa-fire"},
                water: {cor: '#6390F0', icon: "fa-solid fa-water"},
                electric: {cor: '#F7D02C', icon: "fa-solid fa-bolt-lightning"},
                grass: {cor: '#7AC74C', icon: "fa-solid fa-seedling"},
                ice: {cor: '#96D9D6', icon: "fa-solid fa-snowflake"},
                fighting: {cor: '#C22E28', icon: "fa-solid fa-hand-fist"},
                poison: {cor: '#A33EA1', icon: "fa-solid fa-skull-crossbones"},
                ground: {cor: '#E2BF65', icon: "fa-solid fa-mountain"},
                flying: {cor: '#A98FF3', icon: "fa-solid fa-wind"},
                psychic: {cor: '#F95587', icon: "fa-solid fa-brain"},
                bug: {cor: '#A6B91A', icon: "fa-solid fa-bug"},
                rock: {cor: '#B6A136', icon: "fa-solid fa-hill-rockslide"},
                ghost: {cor: '#735797', icon: "fa-solid fa-ghost"},
                dragon: {cor: '#6F35FC', icon: "fa-solid fa-dragon"},
                dark: {cor: '#705746', icon: "fa-brands fa-sith"},
                steel: {cor: '#B7B7CE', icon: "fa-solid fa-magnet"},
                fairy: {cor: '#D685AD', icon: "fa-solid fa-hand-sparkles"}
            }

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
                        <i class="${favoritado? 'fa-solid fa-star': 'fa-regular fa-star'}" onclick="favoritarPokemon()" id="btn-star" style="color: ${favoritado? 'gold': 'black'}"></i>
                    </div>
                    <p><i class="${icone1}"></i> <b>${pokemon.types.map(pos => pos.type.name).join(` - <i class="${icone2}"></i>`)}</b></p>
                </div>
            `

            campoRes.innerHTML += `<div id="imagem"><img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="imagem do ${pokemon.name}"></div>`

            campoRes.innerHTML += `<div id="status">${pokemon.stats.map(pos => `<p><b>${pos.stat.name}</b>: ${pos.base_stat}</p>`).join('')}</div>`
        })
        .catch(error => {
            campoRes.innerHTML = `<p>[ERRO]: ${error}</p>`
        })
    }

    pokeName.focus()
}

function favoritarPokemon(){
    let btnEstrela = document.getElementById('btn-star')
    let index = favoritos.indexOf(pokeName.value.toLowerCase())
    
    if(!favoritos.includes(pokeName.value)){
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
