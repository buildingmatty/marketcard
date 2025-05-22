// src/components/OcrReader.jsx
import React, { useState } from "react";
import Tesseract from "tesseract.js";
import getCardDataFromText from "../utils/getCardDataFromText";

const OcrReader = ({ sets, onCardDataExtracted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cardData = getCardDataFromText(text, sets, cardNames); // 👈 passa anche cardNames

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await Tesseract.recognize(file, "eng+ita+jpn", {
        logger: (m) => console.log(m),
      });

      const text = data.text;
      console.log("OCR text:", text);

      const cardData = getCardDataFromText(text, sets);
      console.log("Card data extracted:", cardData);

      if (typeof onCardDataExtracted === 'function') {
        onCardDataExtracted(cardData);
      } else {
        console.warn("⚠️ `onCardDataExtracted` non è stata fornita o non è una funzione.");
      }
    } catch (err) {
      setError("Errore durante l'OCR");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {loading && <p>Elaborazione immagine in corso...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default OcrReader;
