import Payments from "./Pay/Payments";
import Deposits from "./Depos/Deposits";
import ThirdColumn from "./Thirdsetion/ThirdColumn";
import ToolBar from "./ToolbarSetion/ToolBar";
import { createContext, useEffect, useState } from "react";
import Transactions from "./AdminPages/Transactions";
import UsersList from "./AdminPages/UsersList";
import axios from "axios";

export const AppContext = createContext(null);

const fetchUserData = async (setData, setError, setLoading) => {
    try {
        setLoading(true); // شروع لودینگ
        const response = await axios.get("http://localhost:8000/user/details", {
            withCredentials: true, // ارسال کوکی‌های HttpOnly
        });

        setData(response.data); // ذخیره داده‌ها
        console.log(response.data); // نمایش داده‌ها در کنسول
    } catch (err) {
        setError(err); // مدیریت خطا
        console.error(err.response?.data?.detail || err.message);
    } finally {
        setLoading(false); // پایان لودینگ
    }
};


export default function HomePage() {
    const [Status, setStatus] = useState(0);
    const [AdminOption, setAdminOption] = useState(false);
    const [isAdmin, setisAdmin] = useState(true);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserData(setData, setError, setLoading);
    }, []);

    
    
    return (
        <AppContext.Provider
            value={{ Status, setStatus, AdminOption, setAdminOption, isAdmin }}
        >
            <div className="flex items-center h-screen gap-x-3 justify-center bg-slate-800">
                {AdminOption ? (
                    <div className="caret-transparent w-[55%] h-[95%] flex justify-center gap-1 bg-slate-800 flex-wrap overflow-auto">
                        <ToolBar />
                        <Transactions />
                        <UsersList />
                    </div>
                ) : (
                    <div className="caret-transparent w-[55%] h-[95%] flex justify-center gap-1 bg-slate-800 flex-wrap overflow-auto">
                        <ToolBar />
                        <Deposits />
                        <Payments />
                    </div>
                )}
                <ThirdColumn />
            </div>
        </AppContext.Provider>
    );
}
