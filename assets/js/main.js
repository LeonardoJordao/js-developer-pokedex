import pokeApi from './poke-api.js';

const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector('#loadMoreButton');
const loading = document.querySelector('#loading');

const maxRecords = 151;
const LIMIT = 12;
let offset = 0;

const convertPokemonToLi = pokemon => {
  return `
    <li class="pokemon ${pokemon.type}">
      <span class="number">#${pokemon.number}</span>
      <span class="name">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
        </ol>
        <img
          src="${pokemon.image}"
          alt="${pokemon.name}"
        />
      </div>
    </li>`;
};

const loadPokemonItens = (offset, limit) => {
  loadMoreButton.style.display = 'none';
  loading.style.display = 'block';

  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const pokemonLi = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += pokemonLi;

    loading.style.display = 'none';
    if (offset + LIMIT >= maxRecords) {
      loadMoreButton.style.display = 'none';
    } else {
      loadMoreButton.style.display = 'block';
    }
  });
};

loadPokemonItens(offset, LIMIT);

loadMoreButton.addEventListener('click', () => {
  offset += LIMIT;

  if (offset + LIMIT >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
  } else {
    loadPokemonItens(offset, LIMIT);
  }
});
