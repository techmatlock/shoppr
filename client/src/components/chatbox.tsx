import { useUser } from "@/context/useUser";
import { getInitials } from "@/lib/data";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8085");

type Message = {
  text: string;
  timestamp: string;
};

export function ChatBox() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prevMessage) => [...prevMessage, message]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = { text: messageInput, timestamp: new Date().toISOString() };
      socket.emit("message", message);
      setMessageInput("");
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md">
            {messages.map((msg, index) => (
              <>
                <div key={index} className="flex items-center">
                  <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden my-2 mr-2 bg-green-300 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{user && getInitials(user?.name)}</span>
                  </div>
                  <div
                    className=" bg-blue-500 
                   text-white p-2 rounded-md"
                  >
                    {msg.text}
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
              </>
            ))}
          </div>
          <div className="p-2 border-t border-gray-300">
            <div className="flex">
              <input type="text" className="w-full px-2 py-1 border rounded-l-md outline-none" placeholder="Type your message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
