import fetchApi from './fetch-api.js';
import PokemonDetail from './pokemon-detail-model.js';

const pokeDetailApi = {};

const convertDetailToPokemonDetailModel = pokeDetail => {
  // console.log(pokeDetail);
  const pokemonDetail = new PokemonDetail();
  pokemonDetail.name = pokeDetail.name;
  pokemonDetail.habitat = pokeDetail.habitat.name;
  pokemonDetail.evolves_from_species = pokeDetail.evolves_from_species ? pokeDetail.evolves_from_species.name : '';
  // pokemonDetail.flavor_text_entries = pokeDetail.flavor_text_entries;
  for (var i = 1; i < 6; i++) {
    pokemonDetail.flavor_text_entries.push(pokeDetail.flavor_text_entries[i].flavor_text);
  }
  return pokemonDetail;
};

pokeDetailApi.getPokemonDetail = pokemonNumber => {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNumber}/`;
  return fetchApi.getJson(url).then(convertDetailToPokemonDetailModel);
};

export default pokeDetailApi;
