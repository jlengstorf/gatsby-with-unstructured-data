import React from "react";
import { Link, graphql } from "gatsby";

export default ({
  data: {
    allPokeapiPokemon: { edges: allPokemon }
  }
}) => (
  <div style={{ width: 960, margin: "4rem auto" }}>
    <h1>Choose a Pokémon!</h1>
    <ul style={{ padding: 0 }}>
      {allPokemon.map(pokemon => (
        <li
          key={pokemon.node.id}
          style={{
            textAlign: "center",
            listStyle: "none",
            display: "inline-block"
          }}
        >
          <Link to={`/pokemon/${pokemon.node.name}`}>
            <img
              src={pokemon.node.sprites.front_default}
              alt={pokemon.node.name}
            />
            <p>{pokemon.node.name}</p>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const pageQuery = graphql`
  query {
    allPokeapiPokemon {
      edges {
        node {
          id
          name
          sprites {
            front_default
          }
        }
      }
    }
  }
`;
