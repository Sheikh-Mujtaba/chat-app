import { Socket } from "dgram";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  content : string ,
  isSent :boolean
}


const Chat: React.FC = () => {
  const [messageList,setMessageList]=useState<Message[]>([]);
  const [msg,setMsg]=useState<string>('');

  // const socket = io ('http://localhost:8081');
  const socket = io ('https://chat-app-backend-w1et.onrender.com');


  
  useEffect(() => {
    socket.on ('receive_message' , (data : string ) => {
      setMessageList ((prevMsg) => [...prevMsg ,
        {content :data , isSent :false }
      ]) ;
    });

    return () =>{
      socket.off('receive_message');
    }
  } ,[socket]);

  const sendMessage = () =>{
    if (msg.trim ()) {
      socket.emit('send_message' , msg) ;

      setMessageList ((prevMsg) => [...prevMsg , 
        {content :msg , isSent :true}
      ])
      setMsg('');
    }
  }

  


  return (
    <div className="h-[100vh]">
      <div className="h-[100%] flex justify-center items-center">
        <div className="w-[80%] xl:w-[25%] h-[60%] gap-[2rem] bg-white-600 border rounded  bg-gray-300 flex flex-col justify-end  p-4 overflow-y-auto">

          {messageList.map ((message,index) => (
            <div className={`flex  ${message.isSent ? ("justify-end") : ("justify-start")}`}>
              <div key={index} className={ ` py-2 px-3 rounded ${message.isSent ? ("bg-blue-500 text-white") : ("bg-green-500 text-white")}`} >
                {message.content}
              </div>
            </div>
          ))}
          
          <div className="flex  gap-[1rem]">
          <input type="text" className="border border-[#ffb703] w-full py-2 px-2 rounded" value={msg} onChange={e => setMsg(e.target.value)}/>
          <button className="bg-[#ffb703] text-white rounded px-4  py-2" onClick={sendMessage}>Send</button>
          </div>

        
          </div>
        </div>
      </div>
 
  );
};

export default Chat;


