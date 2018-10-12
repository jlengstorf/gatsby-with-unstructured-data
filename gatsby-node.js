const axios = require('axios');

const get = endpoint => axios.get(`https://pokeapi.co/api/v2${endpoint}`);
const getPokemon = names => Promise.all(names.map(n => get(`/pokemon/${n}`)));

exports.createPages = async ({ actions: { createPage } }) => {
  const pokemon = await getPokemon(['pikachu', 'charizard', 'squirtle']);

  createPage({
    path: `/`,
    component: require.resolve('./src/templates/all-pokemon.js'),
    context: { allPokemon: pokemon.map(({ data }) => data) }
  });

  pokemon.forEach(({ data: pokemon }) => {
    createPage({
      path: `/pokemon/${pokemon.name}`,
      component: require.resolve('./src/templates/pokemon.js'),
      context: { pokemon }
    });

    pokemon.abilities.map(async ({ ability: { name } }) => {
      const { data: ability } = await get(`/ability/${name}`);

      createPage({
        path: `/pokemon/${pokemon.name}/ability/${name}`,
        component: require.resolve('./src/templates/ability.js'),
        context: { pokemon, ability }
      });
    });
  });
};
