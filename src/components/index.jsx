import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ReCAPTCHA from "react-google-recaptcha";

import "swiper/css";
import "swiper/css/navigation";

const GiftCard = ({ name, coin, images, id }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    quantity: 1,
    description: "",
  });

  // reCAPTCHA uchun
  const [captchaValue, setCaptchaValue] = useState(null);

  // IP va user-agent saqlash
  const [clientIP, setClientIP] = useState("Noma'lum");
  const userAgent = navigator.userAgent;

  // IP manzilni olish
  useEffect(() => {
    fetch("https://api.ipify.org/?format=json")
      .then((res) => res.json())
      .then((data) => setClientIP(data.ip))
      .catch(() => setClientIP("Noma'lum"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const FIVE_MINUTES = 5 * 60 * 1000; // 5 daqiqa millisekundda

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaValue) {
      alert("Iltimos, CAPTCHA ni tasdiqlang!");
      return;
    }

    const lastSent = localStorage.getItem("lastMessageTime");
    const now = Date.now();

    if (lastSent && now - lastSent < FIVE_MINUTES) {
      const waitTime = Math.ceil((FIVE_MINUTES - (now - lastSent)) / 1000); // sekundda
      alert(
        `Siz allaqachon xabar yuborgansiz. Iltimos, ${waitTime} soniyadan keyin qayta urinib ko'ring.`
      );
      return;
    }

    const token = "7871290399:AAEdnRJa1KkFpPDJCAnbofaYaHfBKWIY8sw"; // Bot tokeningiz
    const chatId = "6713537237"; // Chat ID

    const giftUrl = `https://your-site.com/gifts?id=${id}`;

    const currentTime = new Date().toLocaleString();

    const message =
      `🎁 Sovg'a: ${name}\n` +
      `💰 Coin: ${coin}\n` +
      `🆔 ID: ${id}\n` +
      `🌐 Link: ${giftUrl}\n\n` +
      `👤 To'liq ism: ${formData.fullName}\n` +
      `📞 Telefon: ${formData.phone}\n` +
      `📦 Nechta: ${formData.quantity}\n` +
      `📝 Izoh: ${formData.description || "Yo'q"}\n\n` +
      `🌍 IP manzili: ${clientIP}\n` +
      `🖥 User-Agent: ${userAgent}\n` +
      `🕒 Vaqt: ${currentTime}\n\n` +
      `@Xoliyorov_AsiIbek`;

    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      alert("Xabaringiz Telegramga yuborildi!");
      localStorage.setItem("lastMessageTime", now); // Yuborilgan vaqtni saqlaymiz
      setIsModalOpen(false);
      setFormData({
        fullName: "",
        phone: "",
        quantity: 1,
        description: "",
      });
      setCaptchaValue(null);
    } catch (error) {
      alert("Xabar yuborishda xatolik yuz berdi.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-2xl p-4 flex flex-col justify-between transition hover:scale-105 duration-300">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            {name}
          </h2>
          <span className="flex items-center text-[18px] sm:text-[20px] text-yellow-400 font-bold">
            <img className="w-6 sm:w-[30px]" src="/coin.png" alt="coin" />{" "}
            {coin}
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-md text-sm sm:text-base"
        >
          Sotib olish
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 px-4 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Buyurtma berish
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="fullName"
                >
                  To'liq ism
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="phone"
                >
                  Telefon raqami
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  pattern="[0-9+]{7,15}"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998901234567"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="quantity"
                >
                  Nechta sovg'a olmoqchisiz?
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="description"
                >
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey="6Lc-zlErAAAAAJHWYKAOuwYXXQvM6oJokvHgxJek"
                  onChange={handleCaptchaChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg shadow-md text-base font-semibold"
              >
                Jo'natish
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftCard;
