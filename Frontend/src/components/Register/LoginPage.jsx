import { useEffect, useState } from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import Captcha from "./Captcha";
import Toolbar from "./BankIcon";
import BankIcon from "./BankIcon";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [codeMeli, setCodeMeli] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new URLSearchParams();
    formData.append("username", codeMeli); // نام کاربری (کد ملی)
    formData.append("password", password); // رمز عبور
  
    try {
      // ارسال درخواست به API
      const response = await axios.post("http://localhost:8000/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // ارسال کوکی‌های HttpOnly
      });
  
      // بررسی موفقیت‌آمیز بودن ورود بر اساس status
      if (response.status === 200 || response.status === 204) {
        alert("Login Successful!");
        navigate("/Home"); // هدایت به صفحه اصلی
      }
    } catch (error) {
      // مدیریت خطا و نمایش پیام مناسب
      console.error("Login Failed:", error.response?.data?.detail || error.message);
      alert("Login Failed: " + (error.response?.data?.detail || error.message));
    }
  };
  

  useEffect(() => {
    // برای تست ارتباط با سرور
    console.log("LoginPage mounted.");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tl from-slate-900 to-slate-600 ">
      <BankIcon />
      <form
        onSubmit={handleSubmit}
        className="text-rose-200 text-right text-shadow w-full px-6 py-10 bg-gradient-to-tl from-slate-700 to-slate-500 shadow-lg shadow-slate-500 rounded-lg lg:w-1/3 lg:h-3/5"
      >
        <h2 className="-mt-3 mb-3 text-5xl font-bold text-center text-rose-200 text-shadow ">
          ورود به حساب{" "}
        </h2>
        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium">:کد ملی</label>
          <input
            type="text"
            onChange={(e) => setCodeMeli(e.target.value)}
            required
            className="w-full px-4 py-3 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium">:رمز عبور</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-gray-800 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <Captcha />
        <button
          type="submit"
          className="mt-2 w-full px-4 py-3 font-semibold text-slate-800 text-shadow bg-rose-200 rounded-lg hover:bg-rose-500 focus:outline-none focus:ring focus:ring-rose-800"
        >
          Submit
        </button>{" "}
        <p className="mt-4 text-sm font-bold text-center">
          <button className=" mr-2 px-3 py-1 rounded-lg bg-slate-500 text-rose-200 hover:underline ">
            <Link to={"/SignIn"}> ساخت حساب</Link>
          </button>{" "}
          حساب ندارید؟{" "}
        </p>
      </form>
    </div>
  );
}
