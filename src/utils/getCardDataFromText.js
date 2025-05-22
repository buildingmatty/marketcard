// utils/getCardFromText.js

export default function getCardDataFromText(text, sets = [], allCardNames = []) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const lowerText = text.toLowerCase();

  let cardName = "";
  let collectorNumber = "";
  let setId = "base1"; // fallback

  // ✅ MATCH CON NOMI API
  const foundName = allCardNames.find((name) => lowerText.includes(name));
  if (foundName) {
    cardName = capitalize(foundName);
  } else {
    // 🟡 FALLBACK vecchio metodo se non trova nulla
    const candidate = lines.find((line) => {
      return (
        /^[A-Z][a-z]+/.test(line) &&
        !line.toLowerCase().includes("basic") &&
        !line.toLowerCase().includes("pokemon")
      );
    });

    if (candidate) {
      const match = candidate.match(/[A-Z][a-zA-Z0-9\-']+/);
      if (match) cardName = match[0];
    }
  }

  // 🎯 COLLECTOR NUMBER (#25)
  const collectorMatch = text.match(/#\s?(\d{1,4})/);
  if (collectorMatch) {
    collectorNumber = collectorMatch[1];
  }

  // 🔍 SET ID MATCH
  const foundSet = sets.find((set) =>
    lowerText.includes(set.name.toLowerCase())
  );
  if (foundSet) {
    setId = foundSet.id;
  }

  return {
    cardName,
    collectorNumber,
    setId,
  };
}

// Funzione di utilità
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
