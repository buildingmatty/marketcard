// src/hooks/useFetchSets.js
//Mi carica dinamicamente la lista dei set direttamente dall'API
import { useState, useEffect } from 'react';

function useFetchSets() {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSets() {
      try {
        const response = await fetch('https://api.pokemontcg.io/v2/sets');
        if (!response.ok) throw new Error('Errore fetch sets');
        const data = await response.json();
        setSets(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSets();
  }, []);

  return { sets, loading, error };
}
export default useFetchSets;