import { useState } from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import Captcha from "./Captcha";
import BankIcon from "./BankIcon";
import { Link, useNavigate } from "react-router-dom"; // استفاده از useNavigate
import HomePage from "../Home page/HomePage";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [codeMeli, setCodeMeli] = useState("");
  const [date, setDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [resetCaptcha, setResetCaptcha] = useState(false);
  
  const navigate = useNavigate(); // استفاده از useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // تولید CAPTCHA جدید
    setResetCaptcha(true);
    setTimeout(() => setResetCaptcha(false), 0); // بازنشانی resetCaptcha

    const formData = {
      name,
      lastName,
      codeMeli,
      date,
      phoneNumber,
      password,
    };
    console.log("Form Data Submitted:", formData);
    alert("Form submitted!");

    // هدایت به صفحه Home پس از ارسال فرم
    navigate('/Home');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tl from-slate-900 to-slate-600 ">
      <BankIcon />
      <form
        onSubmit={handleSubmit}
        className="text-rose-200 text-right text-shadow w-full px-6 py-10 bg-gradient-to-tl from-slate-700 to-slate-500 shadow-lg shadow-slate-500 rounded-lg lg:w-1/3 lg:h-[94vh]"
      >
        <h2 className="-mt-4 mb-3 text-5xl font-bold text-center text-rose-200 text-shadow ">
          ساخت حساب
        </h2>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:نام</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">
            :نام خانوادگی
          </label>
          <input
            type="text"
            onChange={(e) => setlastName(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:کد ملی</label>
          <input
            type="text"
            onChange={(e) => setCodeMeli(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <label className="block mb-2 text-sm font-medium">:تاریخ تولد</label>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-1">
          <PhoneNumberInput
            value={phoneNumber}
            onChange={(value) => setPhoneNumber(value)}
            className="w-full px-4 py-2 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
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
        </button>{" "}
        <p className="mt-4 text-sm font-bold text-center">
          <button className=" mr-2 px-3 py-1 rounded-lg bg-slate-500 text-rose-200 hover:underline ">
            <Link to={'/LogIn'}> ورود به حساب </Link>
          </button>{" "}
          حساب دارید؟{" "}
        </p>
      </form>
    </div>
  );
}
