import { useContext } from "react"
import { AppContext } from "../HomePage"

export default function UserProfile(){

    const {isAdmin} = useContext(AppContext)

    return(
        <div className=" w-[96%] h-[45%] mt-4 rounded-xl border-2 bg-slate-700 " >
            <h1 className="text-center pt-2 items-center text-white text-xl">پنل اطلاعات</h1>
            <hr className="mb-5 mt-3 w-[92%] ml-4"/>
            <div className="flex mb-4">
                <h1 className="w-[85%] text-xl text-white text-right"> رضا</h1>
                <h1 className="w-[15%] text-xl text-slate-400 pr-3  text-right">: نام</h1>
            </div>
            <div className="flex mb-4">
                <h1 className="w-[70%] text-xl text-white text-right"> صیدانلو</h1>
                <h1 className="w-[30%] text-xl text-slate-400 pr-3  text-right">:نام خانوادگی</h1>
            </div>
            <div className="flex mb-4">
                <h1 className="w-[80%]  text-white text-xl text-right"> 5790111661</h1>
                <h1 className="w-[20%] text-xl  text-slate-400 pr-3  text-right">: کد ملی</h1>
            </div>
            <div className="flex mb-4">
                <h1 className="w-[70%] text-xl text-white text-right"> 6219861900252396</h1>
                <h1 className="w-[30%] text-xl text-slate-400 pr-3  text-right">:  شماره حساب</h1>
            </div>
            <div className="flex mb-4">
                <h1 className="w-[70%] text-xl text-white text-right"> 1251512515</h1>
                <h1 className="w-[30%] text-xl text-slate-400 pr-3  text-right">:   مانده حساب</h1>
            </div>
            <div className="flex mb-4">
                

                    {isAdmin ? (<h1 className="w-[80%] text-xl text-white text-right"> ادمین </h1> ) :
                               (<h1 className="w-[80%] text-xl text-white text-right"> کاربر </h1>)}

                <h1 className="w-[20%] text-xl text-slate-400 pr-3  text-right">:  عنوان</h1>
            </div>

        </div>
    )
}