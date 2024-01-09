import { useEffect, useState } from "react";

function PokemonList() {
  const [pokedata, setPokeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState([]);

  const api_URL = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await fetch(`${api_URL}?limit=500`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setPokeData(data.results);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching data. Please try again.");
        setLoading(false);
      }
    };

    fetchList();
  }, []);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const detailsPromises = pokedata.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch Pokemon details: ${response.status}`
            );
          }

          const pokemonDetails = await response.json();
          return {
            id: pokemonDetails.id,
            name: pokemon.name,
            type: pokemonDetails.types[0].type.name,
          };
        });

        const details = await Promise.all(detailsPromises);
        setPokemonDetails(details);
      } catch (error) {
        console.error(error);
        setError("Error fetching Pokemon details. Please try again.");
      }
    };

    if (pokedata.length > 0) {
      fetchPokemonDetails();
    }
  }, [pokedata]);

  return (
    <div className="bg-[#2afc98]  flex flex-col  justify-center pl-16 pr-16 pt-10 overflow-hidden pb-10">
      <input
        type="text"
        placeholder="Search Pokemon"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 mb-4 rounded-md shadow-md w-[50%] ml-[25vw] focus:outline-none focus:ring focus:border-orange-300"
      />

      {loading ? (
        <p className="text-[#0d0c1d] absolute top-[25%] left-[45%] font-semibold">
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-500 absolute top-[28%] left-[45%]">{error}</p>
      ) : (
        <div className=" mt-5 grid grid-cols-3 gap-4">
          {pokemonDetails
            .filter((pokemon) =>
              pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((pokemon) => (
              <div
                key={pokemon.id}
                className="bg-[#16C172] p-4 rounded-md shadow-md flex flex-col items-center border-2 border-green-500"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                  alt={pokemon.name}
                  className="mb-2 w-[10rem]"
                />

                <span className="text-center bg-green-600 w-full first-letter:uppercase  font-mono text-yellow-100">
                  {pokemon.name}
                </span>
                <span className="text-center bg-orange-400 mt-2 w-full first-letter:uppercase  font-mono text-yellow-100">
                  Type: {pokemon.type}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default PokemonList;
