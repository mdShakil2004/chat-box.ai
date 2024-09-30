import {createContext,useState} from "react"
import runChat from "../config/Gemini";

export const Context=createContext();

const ContextProvider=(props)=>{
     
    const [Input ,setInput]=useState("");
    const [recentPrompt,setRecentPrompt]=useState("");
    const [prevPrompt,setPrevPrompt]=useState([]);
    const [showResult,SetShowResult]=useState(false);
    const [loading,setloading]=useState(false);
    const [resultData ,setResultData]=useState("");

const delayPara=(index,nextWord)=>{
    setTimeout(()=>{
        setResultData(prev=>prev+nextWord);
    },75*index)

}   
  const newChat=()=>{
    setloading(false)
    SetShowResult(false)
  }

    const onSent=async (prompt)=>{
        setResultData("")
        setloading(true)
        SetShowResult(true)
        let response;
        if(prompt !==undefined)
        { 

            response=await  runChat(prompt)
            setRecentPrompt(prompt);


        }
        else{
            setPrevPrompt(prev => [...prev, Input])
            response = await runChat(Input)
        }



       
   let responseArray=response.split("**");
   let newResponse="";
   for(let i=0;i<responseArray.length;i++)
   { 
    if(i===0||i%2!==1)
    {
        newResponse +=responseArray[i];

    }
    else{
        newResponse +="<b>"+ responseArray[i]+"</b>";
    }

   }
   let newResponse2=newResponse.split("*").join("</br>")
   
   let newResponseArray=newResponse2.split(" ");
    for(let i=0;i<newResponseArray.length;i++)
    {
        const nextWord=newResponseArray[i];
        delayPara(i,nextWord+" ");
    }

        setResultData(newResponse2)
        setloading(false)
        setInput("")

    }
    
    const ContextValue={
        Input,
        setInput,
        onSent,
        recentPrompt,
        setRecentPrompt,
        prevPrompt,
        setPrevPrompt,
        showResult,
      
        loading,
    
        resultData,
        newChat
     
       

        



    }
    return (
        <Context.Provider value={ContextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider