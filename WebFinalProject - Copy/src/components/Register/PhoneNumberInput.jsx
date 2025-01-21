import React, { useState } from "react";

const PhoneNumberInput = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(""); // تعریف استیت برای مدیریت خطا

  const handleChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);

    // الگوی شماره تلفن ایران: باید با 09 شروع شود و 11 رقم باشد
    const phoneRegex = /^09\d{9}$/;
    if (value && !phoneRegex.test(value)) {
      setError(".شماره تلفن معتبر نیست");
    } else {
      setError("");
    }
  };

  return (
    <div>
      <div className="flex flex-row ">
        <div className="w-[145px] h-[22px] text-red-500 text-sm">
          {error && <p>{error}</p>}
        </div>{" "}
        <div>
          <label className="fixed ml-[218px] mb-2 text-sm text-right font-medium">
            :شماره تلفن
          </label>
        </div>
      </div>

      <input
        type="text"
        value={phoneNumber}
        onChange={handleChange}
        className=" w-full px-4 py-3 mt-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 "
      />
    </div>
  );
};

export default PhoneNumberInput;
