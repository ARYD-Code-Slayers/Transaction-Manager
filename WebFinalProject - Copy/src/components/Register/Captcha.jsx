import React, { useState, useEffect } from "react";

const Captcha = ({ onVerify, resetCaptcha }) => {
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");

  // تابع تولید CAPTCHA
  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptcha(result);
    setUserInput("");
    setError("");
  };

  // بررسی CAPTCHA
  const handleVerify = () => {
    if (userInput === captcha) {
      setError("");
      onVerify(true); // اعلام موفقیت
    } else {
      setError("CAPTCHA وارد شده صحیح نیست!");
      onVerify(false); // اعلام عدم موفقیت
    }
  };

  // تولید CAPTCHA در اولین رندر
  useEffect(() => {
    generateCaptcha();
  }, []);

  // بازنشانی CAPTCHA زمانی که والد درخواست کند
  useEffect(() => {
    if (resetCaptcha) {
      generateCaptcha();
    }
  }, [resetCaptcha]);

  return (
    <div className="captcha-container">
      <div className="flex items-center justify-between my-5">
        <span className=" py-2 text-lg font-bold text-gray-800 bg-gray-200 px-4 rounded-md mr-1">
          {captcha}
        </span>
        <input
          type="text"
          placeholder="کد CAPTCHA را وارد کنید"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full px-4 py-3 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Captcha;
