import { useContext } from "react"
import { AppContext } from "../HomePage"
import BankIcon from "./BankIcon"

export default function ToolBar(){

    const {setStatus} = useContext(AppContext)
    const {setAdminOption} = useContext(AppContext)
    const {AdminOption} = useContext(AppContext)
    const {isAdmin} = useContext(AppContext)

    return(
        <div className="w-[98%] h-[5%] border-2 flex items-center gap-x-2 pl-2 border-slate-500 rounded-md bg-slate-700">

            <button onClick={()=>setStatus(1)} className=" w-[20%] h-[80%] bg-teal-300 border-2  pb-1 flex justify-center items-center border-teal-700   rounded-xl">
                درگاه پرداخت 
            </button>

            <button onClick={()=>setStatus(2)} className="w-[20%] h-[80%] bg-teal-300 border-2  pb-1 flex justify-center items-center border-teal-700 rounded-xl">
                درگاه ثبت چک  
            </button>

            {isAdmin ? (
                <button onClick={()=>setAdminOption(!AdminOption)} className="w-[20%] h-[80%] bg-teal-300 border-2  pb-1 flex justify-center items-center border-teal-700 rounded-xl">
                قابلیت ادمین
                </button>
            ) : (true)}



            <BankIcon />

        </div>
    )
}