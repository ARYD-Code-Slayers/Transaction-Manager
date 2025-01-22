import { useState } from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import Captcha from "./Captcha";
import BankIcon from "./BankIcon";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignInPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [national_id, setNationalId] = useState("");
  const [birthday_date, setBirthdayDate] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [resetCaptcha, setResetCaptcha] = useState(false);

  const navigate = useNavigate(); // استفاده از useNavigate

  // تبدیل تاریخ به فرمت Python
  const convertToPythonDate = (inputDate) => {
    if (!inputDate) {
      console.error("Invalid date input");
      return null;
    }
    const [year, month, day] = inputDate.split("-");
    return `${year}-${month}-${day}`;
  };

  // ارسال داده‌ها به بک‌اند
  const sendUserData = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8000/user", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("User created successfully:", response.data);
      alert("User created successfully!");
      navigate("/Home"); // هدایت به صفحه Home
    } catch (error) {
      console.error("Error creating user:", error.response?.data?.detail || error.message);
      alert("Error creating user: " + (error.response?.data?.detail || error.message));
    }
  };

  // مدیریت ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();

    // تولید CAPTCHA جدید
    setResetCaptcha(true);
    setTimeout(() => setResetCaptcha(false), 0);

    // داده‌های فرم
    const formData = {
      firstname,
      lastname,
      national_id,
      birthday_date,
      phone_number,
      password,
    };

    console.log("Form Data Submitted:", formData);

    // ارسال داده‌ها به بک‌اند
    sendUserData(formData);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tl from-slate-900 to-slate-600">
      <BankIcon />
      <form
        onSubmit={handleSubmit}
        className="text-rose-200 text-right text-shadow w-full px-6 py-10 bg-gradient-to-tl from-slate-700 to-slate-500 shadow-lg shadow-slate-500 rounded-lg lg:w-1/3 lg:h-[94vh]"
      >
        <h2 className="-mt-4 mb-3 text-5xl font-bold text-center text-rose-200 text-shadow">
          ساخت حساب
        </h2>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:نام</label>
          <input
            type="text"
            onChange={(e) => setFirstname(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:نام خانوادگی</label>
          <input
            type="text"
            onChange={(e) => setLastname(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:کد ملی</label>
          <input
            type="text"
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:تاریخ تولد</label>
          <input
            type="date"
            onChange={(e) => setBirthdayDate(convertToPythonDate(e.target.value))}
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:شماره تلفن</label>
          <input
            type="text"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        {/* <div className="mb-1">
          <PhoneNumberInput
            value={phone_number}
            onChange={(value) => setPhoneNumber(value)}
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div> */}
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:رمز عبور</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <Captcha resetCaptcha={resetCaptcha} />
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-slate-800 text-shadow bg-rose-200 rounded-lg hover:bg-rose-500 focus:outline-none focus:ring focus:ring-rose-800"
        >
          Submit
        </button>
        <p className="mt-4 text-sm font-bold text-center">
          <button className="mr-2 px-3 py-1 rounded-lg bg-slate-500 text-rose-200 hover:underline">
            <Link to={"/LogIn"}> ورود به حساب </Link>
          </button>{" "}
          حساب دارید؟
        </p>
      </form>
    </div>
  );
}
