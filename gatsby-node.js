exports.createPages = async ({ graphql, actions: { createPage } }) => {
  return new Promise((resolve, reject) => {
    graphql(
      `
        query {
          allPokeapiPokemon {
            edges {
              node {
                name
                id
                abilities {
                  id
                  name
                }
              }
            }
          }
        }
      `
    ).then(result => {
      if (result.errors) {
        return reject(result.errors);
      }

      // Create a page that lists all Pokémon.
      createPage({
        path: `/`,
        component: require.resolve("./src/templates/all-pokemon.js"),
        context: {
          slug: `/`
        }
      });

      const allPokemon = result.data.allPokeapiPokemon.edges;

      // Create a page for each Pokémon.
      allPokemon.forEach(pokemon => {
        createPage({
          path: `/pokemon/${pokemon.node.name}/`,
          component: require.resolve("./src/templates/pokemon.js"),
          context: {
            name: pokemon.node.name
          }
        });

        // Create a page for each ability of the current Pokémon.
        pokemon.node.abilities.forEach(ability => {
          createPage({
            path: `/pokemon/${pokemon.node.name}/ability/${ability.name}/`,
            component: require.resolve("./src/templates/ability.js"),
            context: {
              pokemonId: pokemon.node.id,
              abilityId: ability.id
            }
          });
        });
      });

      return resolve();
    });
  });
};
