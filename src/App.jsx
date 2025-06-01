import { useRef, useState, useEffect } from "react";
import { gifts } from "./data/coins";

import GiftCard from "./components";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [maxCoin, setMaxCoin] = useState("");
  const [activeId, setActiveId] = useState(null);

  // URL dan id parametrini o'qish
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get("id");
    if (idFromUrl) {
      setActiveId(idFromUrl);
    }
  }, []);

  const filteredGifts = gifts.filter((gift) => {
    const matchesName = gift.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCoin = maxCoin === "" || gift.coin <= parseInt(maxCoin);
    return matchesName && matchesCoin;
  });

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gradient bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
        🎁 IT Time Academy Sovg'alar Do‘koni
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center items-center">
        <input
          type="text"
          placeholder="🔍 Sovg‘a nomi bo‘yicha qidirish..."
          className="border border-gray-300 px-4 py-3 rounded-lg shadow-md w-full sm:w-1/2 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="🎯 Coin bo‘yicha filter (masalan: 500)"
          className="border border-gray-300 px-4 py-3 rounded-lg shadow-md w-full sm:w-1/3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
          value={maxCoin}
          onChange={(e) => setMaxCoin(e.target.value)}
        />
      </div>

      {/* Cards */}
      {filteredGifts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {filteredGifts.map((gift, index) => (
            <GiftCard
              key={index}
              name={gift.name}
              coin={gift.coin}
              images={gift.images}
              id={gift.id}
              active={gift.id.toString() === activeId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20 text-lg font-medium">
          😔 Hech qanday mos sovg‘a topilmadi.
        </p>
      )}
    </div>
  );
};

export default App;
