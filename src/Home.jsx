import React, { useState, useEffect } from "react";
import OcrReader from "./componets/OcrReader";
import useFetchSets from "./hook/useFetchSets";
import getCardDataFromText from "./utils/getCardDataFromText";
import useCardNames from "./hook/useCardNames";
//import setOptions from "./data/SetOptions";
import './Home.css';

const Home = () => {
  const [cardName, setCardName] = useState('');
  const [triggeredByOcr, setTriggeredByOcr] = useState(false); // 👈 nuovo stato
  const [setId, setSetId] = useState('base1');
  const [searchSet, setSearchSet] = useState('');
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
  const [rarityLabel, setRarityLabel] = useState(null);
  const [isHolo, setIsHolo] = useState(false);
  const [isReverseHolo, setIsReverseHolo] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sets, loading: loadingSets, error } = useFetchSets();
  const [ocrText, setOcrText] = useState('');
  const [cardData, setCardData] = useState(null);
  const {cardNames, loading: loadingNames, error: errorNames} = useCardNames();

  // Avvia la ricerca solo se il testo viene da OCR
  useEffect(() => {
    if (triggeredByOcr && cardName.trim()) {
      console.log("🔍 Trigger OCR attivo, eseguo fetch...");
      fetchPriceData();
      setTriggeredByOcr(false);
    }
  }, [cardName, triggeredByOcr]);



  const fetchPriceData = async () => {
    if (!cardName.trim()) {
      setPrice('Inserisci nome carta.');
      return;
    }

    setLoading(true);
    setPrice(null);
    setImage(null);
    setRarityLabel(null);

    try {
      let query = `name:"${cardName.trim()}"`;
      if (setId !== 'all') query += ` set.id:${setId}`;

      const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Errore API: ${response.statusText}`);

      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const cardData = data.data[0];
        const pricesTcg = cardData.tcgplayer?.prices;
        let priceUsd = pricesTcg?.holofoil?.market || pricesTcg?.normal?.market || null;

        const pricesCardMarket = cardData.cardmarket?.prices;
        let priceEur = pricesCardMarket?.trendPrice || pricesCardMarket?.averageSellPrice || null;

        const prezzoUsdStr = priceUsd ? `${priceUsd.toFixed(2)} USD` : 'Prezzo USD non disponibile';
        const prezzoEurStr = priceEur ? `${priceEur.toFixed(2)} EUR` : 'Prezzo EUR non disponibile';

        setPrice(`Prezzo stimato: ${prezzoUsdStr} / ${prezzoEurStr}`);
        setImage(cardData.images.large);
        setRarityLabel(cardData.rarity);
      } else {
        setPrice('Nessun risultato trovato.');
        setImage(null);
        setRarityLabel(null);
      }
    } catch (error) {
      setPrice('Errore nella ricerca.');
      setImage(null);
      setRarityLabel(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*const filteredSetOptions = Object.entries(setOptions).filter(([id, name]) =>
    name.toLowerCase().includes(searchSet.toLowerCase())
  );*/ //Se utilizzassi setOptions

  const filteredSetOptions = sets
  .filter((set) => set.name.toLowerCase().includes(searchSet.toLowerCase()))
  .map((set) => ({ id: set.id, name: set.name }));


  return (
    <div className="home">
      <h1>Cerca Carta</h1>

      <OcrReader
        sets={sets}
        cardNames={cardNames} // 👈 passalo
        onCardDataExtracted={(cardData) => {
          setCardName(cardData.cardName || '');
          setSetId(cardData.setId || 'all');
          setTriggeredByOcr(true);
        }}
      />

      <div className="input-row">
        <div className="input-group">
          <label>Nome Carta:</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => {
              setCardName(e.target.value);
              setTriggeredByOcr(false); // 👈 evita trigger automatico se digitato
            }}
            disabled={loading}
            placeholder="Es: Pikachu"
          />
        </div>

        <div className="input-group">
          <label>Filtra Set:</label>
          <input
            type="text"
            placeholder="Cerca set..."
            value={searchSet}
            onChange={(e) => setSearchSet(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <label>Set:</label>
          <select
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            disabled={loading || loadingSets}
          >
            {filteredSetOptions.length > 0 ? (
              filteredSetOptions.map(({ id, name }) => (
                <option key={id} value={id}>{name}</option>
              ))
            ) : (
              <option disabled>Nessun set trovato</option>
            )}
          </select>
        </div>

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={isHolo}
              onChange={() => { setIsHolo(!isHolo); setIsReverseHolo(false); }}
              disabled={loading}
            />
            Holo
          </label>
          <label>
            <input
              type="checkbox"
              checked={isReverseHolo}
              onChange={() => { setIsReverseHolo(!isReverseHolo); setIsHolo(false); }}
              disabled={loading}
            />
            Reverse Holo
          </label>
        </div>

        <div className="button-row">
          <button onClick={fetchPriceData} disabled={loading}>
            {loading ? 'Caricamento...' : 'Cerca'}
          </button>
        </div>
      </div>

      <div className="result">
        <h2>Prezzo:</h2>
        <p>{price || 'Nessun risultato'}</p>

        {rarityLabel && (
          <p className="rarity">Rarità: <strong>{rarityLabel}</strong></p>
        )}

        {image && (
          <div className="image-container">
            <h2>Immagine:</h2>
            <img src={image} alt={cardName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
