import { useContext } from "react";
import UserProfile from "./UserProfile";
import { AppContext } from "../HomePage";
import PaymentWindow from "./PaymentWindow";
import RegisterChek from "./RegisterChek";



export default function ThirdColumn(){

    const {Status} = useContext(AppContext)

    console.log(Status)

    return(
        <div className="h-[100%] w-[30%] bg-slate-800">
            <UserProfile />
            {Status==1 ? (<PaymentWindow />) : (true)}
            {Status==2 ? (<RegisterChek />) : (true)}
            
        </div>
    )
}