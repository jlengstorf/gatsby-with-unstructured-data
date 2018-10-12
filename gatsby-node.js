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

  await Promise.all(
    pokemon.map(async ({ data: pokemon }) => {
      await createPage({
        path: `/pokemon/${pokemon.name}`,
        component: require.resolve('./src/templates/pokemon.js'),
        context: { pokemon }
      });

      await Promise.all(
        pokemon.abilities.map(async ({ ability: { name } }) => {
          const { data: ability } = await get(`/ability/${name}`);

          await createPage({
            path: `/pokemon/${pokemon.name}/ability/${name}`,
            component: require.resolve('./src/templates/ability.js'),
            context: { pokemon, ability }
          });
        })
      );
    })
  );
};
