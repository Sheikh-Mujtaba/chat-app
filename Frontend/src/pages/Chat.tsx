import { Socket } from "dgram";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

interface Message {
  content :string,
  isSent : boolean
}


const Chat: React.FC = () => {
  const [msg , setMsg] = useState<string>('');
  const [msgList,setMsgList]=useState<Message[]>([]);

  const socket = io('http://localhost:8081');

  useEffect(() => {
    socket.on('receive_message', (data: string) => {
      setMsgList((prevMsg) => [
        ...prevMsg,
        { content: data, isSent: false }
      ]);
    });
  
    return () => {
      socket.off('receive_message');  // Cleanup listener when component unmounts or when `socket` changes
    };
  }, [socket]);

  
  const sendMsg = () => {
    if (msg.trim()) {
      // Emit the message to the server
      socket.emit('send_message', msg);
      
      // Add the message to the local state to show it immediately
      setMsgList((prevMsg) => [
        ...prevMsg,
        { content: msg, isSent: true }
      ]);
      setMsg(''); // Clear the input field
    }
  };




  return (
    <div className="h-[100vh]">
      <div className="h-[100%] flex justify-center items-center">
        <div className="w-[80%] xl:w-[25%] h-[60%] gap-[2rem] bg-white-600 border rounded  bg-gray-300 flex flex-col justify-end  p-4 ">

          <div className="overflow-y-auto" >
            {msgList.map ((message ,index) => (
              <div className={`flex py-3 ${message.isSent ? ("justify-left") : ("justify-right")}`}>
                <div key={index}>
                  <div className={`px-3 py-2 rounded ${message.isSent ? ("bg-blue-500 text-white") : ("bg-green-500 text-white")}`}>{message.content}</div>

                </div>
              </div>
            ))}
          </div>


         
          
          <div className="flex  gap-[1rem]">
          <input type="text" className="border border-[#ffb703] w-full py-2 px-2 rounded"  onChange={e => setMsg (e.target.value)}/>

          <button className="bg-[#ffb703] text-white rounded px-4  py-2" onClick={sendMsg} >Send</button>

          </div>

        
          </div>
        </div>
      </div>
 
  );
};

export default Chat;


