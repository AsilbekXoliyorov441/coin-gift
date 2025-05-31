import { useRef, useState } from "react";
import { gifts } from "./data/coins";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [maxCoin, setMaxCoin] = useState("");

  const filteredGifts = gifts.filter((gift) => {
    const matchesName = gift.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCoin = maxCoin === "" || gift.coin <= parseInt(maxCoin);
    return matchesName && matchesCoin;
  });

  return (
    <div className="min-h-screen bg-white container mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-6">
        🎁 IT Time Academy Sovg'alar Do‘koni
      </h1>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <input
          type="text"
          placeholder="🔍 Sovg‘a nomi bo‘yicha qidirish..."
          className="border px-4 py-2 rounded-lg shadow w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="🎯 Coin bo‘yicha filter (masalan: 500)"
          className="border px-4 py-2 rounded-lg shadow w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={maxCoin}
          onChange={(e) => setMaxCoin(e.target.value)}
        />
      </div>

      {/* Cards */}
      {filteredGifts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
          {filteredGifts.map((gift, index) => (
            <GiftCard
              key={index}
              name={gift.name}
              coin={gift.coin}
              images={gift.images}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          😔 Hech qanday mos sovg‘a topilmadi.
        </p>
      )}
    </div>
  );
};

export default App;

const GiftCard = ({ name, coin, images }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-2xl p-4 flex flex-col justify-between transition hover:scale-105 duration-300">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          {name}
        </h2>
        <span className="flex items-center text-[18px] sm:text-[20px] text-yellow-400 font-bold">
          <img className="w-6 sm:w-[30px]" src="/coin.png" alt="coin" /> {coin}
        </span>
      </div>

      <div className="relative bg-gray-100 w-full rounded-lg mt-2 flex items-center justify-center overflow-hidden h-60 sm:h-72">
        {images && images.length > 0 ? (
          <>
            <button
              ref={prevRef}
              className="cursor-pointer absolute left-1 top-1/2 -translate-y-1/2 bg-white text-gray-600 hover:text-blue-500 p-1 rounded-full shadow text-xs z-10"
            >
              ◀
            </button>
            <button
              ref={nextRef}
              className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 bg-white text-gray-600 hover:text-blue-500 p-1 rounded-full shadow text-xs z-10"
            >
              ▶
            </button>

            <Swiper
              loop
              modules={[Navigation]}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`${name}-${idx}`}
                    className="w-full h-60 sm:h-72 object-contain object-center"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <span className="text-gray-400 text-sm">Image/Icon</span>
        )}
      </div>

      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-md text-sm sm:text-base">
        Sotib olish
      </button>
    </div>
  );
};
