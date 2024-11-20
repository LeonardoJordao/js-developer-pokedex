import fetchApi from './fetch-api.js';
import Pokemon from './pokemon-model.js';

const pokeApi = {};

const convertDetailToPokemonModel = pokeDetail => {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;
  pokemon.type = pokeDetail.types[0].type.name;
  pokemon.types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
  pokemon.image = pokeDetail.sprites.other.dream_world.front_default;
  return pokemon;
};

const getPokemonDetail = pokemon => {
  return fetchApi.getJson(pokemon.url).then(convertDetailToPokemonModel);
};

pokeApi.getPokemons = (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetchApi
    .getJson(url)
    .then(jsonData => jsonData.results)
    .then(pokemons => pokemons.map(getPokemonDetail))
    .then(detailRequests => Promise.all(detailRequests))
    .then(pokemonsDetails => pokemonsDetails);
};

export default pokeApi;
