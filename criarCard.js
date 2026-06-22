import { tiposPokemon } from "./tipos.js"
import { favoritarPokemon } from "./script.js"

export function criarCard(pokemon){
    let favoritos = JSON.parse(localStorage.getItem('bancoFavoritos')) || []
    let campoRes = document.getElementById('card')
    let pokeName = document.getElementById('inome-pokemon')
    
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
}