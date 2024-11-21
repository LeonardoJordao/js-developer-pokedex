import pokeApi from './poke-api.js';
import pokeDetailApi from './poke-detail-api.js';

const loading = document.querySelector('#loading');
const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector('#loadMoreButton');

const maxRecords = 151;
const LIMIT = 6;
let offset = 0;

const convertPokemonToLi = pokemon => {
  return `
    <li class="pokemon ${pokemon.type}">
      <span class="number">#${pokemon.number}</span>
      <div class="open-modal" id="pokemon-${pokemon.number}">
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ul class="types">
            ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
          </ul>
          <img
            src="${pokemon.image}"
            alt="${pokemon.name}"
          />
        </div>
      </div>
      <input type="hidden" id="type-${pokemon.number}" value="${pokemon.type}" />
      <input type="hidden" id="height-${pokemon.number}" value="${pokemon.height}" />
      <input type="hidden" id="weight-${pokemon.number}" value="${pokemon.weight}" />
      <input type="hidden" id="image-${pokemon.number}" value="${pokemon.image}" />
      <!--</a> -->
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
    configModalHandlers();
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

const configModalHandlers = () => {
  const openModal = document.querySelectorAll('.open-modal');
  openModal.forEach(modalHandler => {
    modalHandler.addEventListener('click', () => {
      const pokemonId = modalHandler.id.replace('pokemon-', '');
      const pokemonHeight = document.querySelector(`#height-${pokemonId}`);
      const pokemonWeight = document.querySelector(`#weight-${pokemonId}`);
      const pokemonImage = document.querySelector(`#image-${pokemonId}`);
      const pokemonType = document.querySelector(`#type-${pokemonId}`);

      pokeDetailApi.getPokemonDetail(pokemonId).then(pokemon => {
        // console.log(pokemon);
        document.querySelector('#pokemon-name').innerHTML = pokemon.name;
        document.querySelector('.modal img').src = pokemonImage.value;
        document.querySelector('.modal img').alt = pokemon.name;
        document.querySelector('.modal-content').classList.add(pokemonType.value);

        document.querySelector('#pokemon-items').innerHTML = '<li>Altura: ' + pokemonHeight.value + '</li>';
        document.querySelector('#pokemon-items').innerHTML += '<li>Peso: ' + pokemonWeight.value + '</li>';
        document.querySelector('#pokemon-items').innerHTML += '<li>Habitat: ' + pokemon.habitat + '</li>';
        if (pokemon.evolves_from_species)
          document.querySelector('#pokemon-items').innerHTML +=
            '<li>Evolui de: <span class="name">' + pokemon.evolves_from_species + '</span></li>';

        document.querySelector('#pokemon-description').innerHTML = '';
        pokemon.flavor_text_entries.map(entry => {
          document.querySelector('#pokemon-description').innerHTML += '<p>' + entry.replace(/\f/g, '') + '</p>';
        });

        const modal = document.querySelector('.modal');
        const overlay = document.querySelector('.overlay');
        const closeModalBtn = document.querySelector('.btn-close');

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

        const closeModal = () => {
          modal.classList.add('hidden');
          overlay.classList.add('hidden');
        };

        closeModalBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
      });
    });
  });
};
