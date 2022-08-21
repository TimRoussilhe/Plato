import fetch from 'node-fetch';
import { getAverageColor } from 'fast-average-color-node';

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getStaticPagesProps = async () => {
  // const res = await fetch('https://deelay.me/6000/https://pokeapi.co/api/v2/pokemon/?limit=6');
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=6');
  const posts = await res.json();
  console.time('FooTimer');

  getAverageColor(
    'https://images.unsplash.com/photo-1660337157997-f02497ef1a31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'
  ).then((color) => {
    console.timeEnd('FooTimer');
    console.log(color);

    const pages = posts.results.map((pokemon, i) => {
      return {
        id: pokemon.name,
        url: pokemon.name,
        template: 'about',
        data: pokemon,
      };
    });

    return pages;
  });
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
