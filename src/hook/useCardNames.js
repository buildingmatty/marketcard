import { useEffect, useState } from "react";

const useCardNames = () => {
  const [cardNames, setCardNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardNames = async () => {
      try {
        let allNames = new Set();
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await fetch(`https://api.pokemontcg.io/v2/cards?pageSize=250&page=${page}`);
          const data = await response.json();

          data.data.forEach(card => {
            if (card.name) allNames.add(card.name.toLowerCase());
          });

          hasMore = data.data.length > 0;
          page++;
        }

        setCardNames([...allNames]);
      } catch (err) {
        setError("Errore nel caricamento dei nomi delle carte");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardNames();
  }, []);

  return { cardNames, loading, error };
};

export default useCardNames;
