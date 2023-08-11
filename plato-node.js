import fetch from 'node-fetch';

export const getStaticPagesProps = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=6');
  const posts = await res.json();

  const pages = posts.results.map((pokemon, i) => {
    return {
      id: pokemon.name,
      url: pokemon.name,
      template: 'about',
      data: pokemon,
    };
  });

  return pages;
};

export const createGlobalData = () => {
  return new Promise((resolve, reject) => {
    resolve({
      globals: {
        array: [1, 2, 3, 4, 5],
      },
    });
  });
};
