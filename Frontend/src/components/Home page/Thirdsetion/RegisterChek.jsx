import { useContext, useState } from "react"
import { AppContext } from "../HomePage"

export default function RegisterChek(){

    const {setStatus} = useContext(AppContext)
    
        const [CardNumber , setCardNumber ] = useState(null)
        const [ChekAmount , setChekAmount ] = useState(null)
        const [ChekDate , setCheckDate] = useState(null)
        const [SerialNumber , setSerialNumber] = useState(null)
        const [ChekText , setChekText ] = useState(null)

        const onChangeCardNumberHandler = (e)=> {
            setCardNumber(e.target.value)
            console.log(CardNumber)
        }
        const onChangeChekAmountHandler = (e)=> {
            setChekAmount(e.target.value)
            console.log(ChekAmount)
        }
        const onChangeSerialNumberHandler = (e)=> {
            setSerialNumber(e.target.value)
            console.log(SerialNumber)
        }
        const onChangeChekDateHandler = (e)=> {
            setCheckDate(e.target.value)
            console.log(ChekDate)
        }
        const onChangeChekTextHandler = (e)=> {
            setChekText(e.target.value)
            console.log(ChekText)
        }

        const [RegisterInformation , setRegisterInformation ] = useState({
            RegisterChekAmount : null,
            RegisterCardNumber : null,
            RegisterChekDate : null,
            RegisterSerialNumber : null,
            RegisterChekText : null
        })

/*************************************************************************************************************************************
 * send Register chek information to data base*/

        const UpdateRegisterInformation={

            RegisterChekAmount : ChekAmount,
            RegisterCardNumber : CardNumber,
            RegisterChekDate : ChekDate,
            RegisterSerialNumber : SerialNumber,
            RegisterChekText : ChekText
        }

        const onSubmitHandler = (e) => {
            e.preventDefault()

            setRegisterInformation(UpdateRegisterInformation)
            console.log(UpdateRegisterInformation)

        }


        
/*************************************************************************************************************************************
 * Register chek body */


    return(
        <div className="caret-transparent h-[48%] w-[96%] rounded-lg overflow-auto mt-3 border-2 border-slate-500 bg-slate-700 p-4">

            <div className="flex">
            <h1 className=" text-center pl-6 w-[90%] text-white text-xl mb-2"> درگاه ثبت چک</h1>
            <button onClick={()=> {setStatus(0);setCardNumber(null)}}
            className="w-[10%] text-red-700 bg-rose-400 rounded-lg text-3xl ">
                    X
            </button>
            </div>
            
            <hr className="mb-3 mt-2"/>

            <form onSubmit={onSubmitHandler} >



            <div className="flex mb-2"> 
                <input
                type="number"
                id="number"
                className="w-[80%] caret-white text-black text-center bg-slate-500 p-2 rounded-lg border-0 border-white
                focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="xxxx / xxxx / xxxx / xxxx"
                required
                onChange={onChangeCardNumberHandler}
                />
                <label className=" w-[35%] block text-right text-white mb-2" htmlFor="textDoc">
                : شماره حساب
                </label>

            </div>


            <div className="flex mb-2"> 
                <input
                type="number"
                id="number"
                className="w-[80%] caret-white text-black text-center bg-slate-500 p-2 rounded-lg border-0 border-white
                focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="xxxx / xxxx / xxxx / xxxx"
                required
                onChange={onChangeSerialNumberHandler}
                />
                <label className=" w-[35%] block text-right text-white mb-2" htmlFor="textDoc">
                : شماره سریال
                </label>

            </div>



            <div className="mb-2 flex">
                <input
                type="number"
                id="number"
                className="w-[70%] caret-white text-black text-center bg-slate-500 p-2 rounded-lg border-0 border-white
                focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="   1xx xxx xxx"
                required
                onChange={onChangeChekAmountHandler}
                />
                <label className="w-[30%] block text-right text-white mb-2" htmlFor="date">
                :  مبلغ چک 
                </label>
            </div>



            <div className="mb-3 flex">
                <input
                type="date"
                id="date"
                className="w-[70%] caret-white text-center bg-slate-500 p-2 rounded-lg border-0 border-white
                focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="   1xx xxx xxx"
                required
                onChange={onChangeChekDateHandler}
                />
                <label className="w-[30%] block text-right text-white mb-2" htmlFor="date">
                :  تاریخ چک 
                </label>
            </div>



            <div className="mb-3 flex">
                <textarea onKeyDown={onChangeChekTextHandler} className="w-[70%] rounded-lg bg-slate-300" rows={1} name="ChekText" id="ChekTextId">

                </textarea>
                <label className="w-[30%] block text-right text-white mb-2" htmlFor="date">
                :  توضیحات چک 
                </label>
            </div>



            <div className="flex ">
                <button
                    type="submit"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    پرداخت
                </button>

                <div className=" flex w-[80%] "> 
                    <label className="w-[50%]  text-right text-white mb-2" htmlFor="textDoc">
                    {(CardNumber==6219861800252396) ? (" رضا صیدانلو") : ("")}
                    </label>
                    <label className="w-[50%] text-right text-white mb-2" htmlFor="textDoc">
                    : نام و نام خانوادگی
                </label>
                </div>
            </div>

            
            </form>


      </div>
    )
}