import { useUser } from "@/context/useUser";
import { apiUrl, getInitials } from "@/lib/data";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8085");

type Message = {
  userId: number;
  message: string;
  timestamp: string;
};

export function ChatBox() {
  const { user, users, token } = useUser();
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

  useEffect(() => {
    const loadMessages = async () => {
      setMessages(await fetchMessages());
    };
    loadMessages();
  }, []);

  async function fetchMessages(): Promise<Message[]> {
    const res = await fetch(`${apiUrl}/api/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error(`Response status: ${res.status}`);
    return (await res.json()) as Message[];
  }

  const mutation = useMutation({
    mutationFn: async ({ message, timestamp }: { message: string; timestamp: string }) => {
      const newMessage = {
        userId: user?.userId,
        message: message,
        timestamp: timestamp,
      };
      const req = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      };
      const res = await fetch(`${apiUrl}/api/messages`, req);
      if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    },
    onSuccess: async () => {
      const msgs = await fetchMessages();
      setMessages(msgs);
    },
    onError: (err: Error) => {
      alert(`Failed to submit message: ${err.message}`);
    },
  });

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = { text: messageInput, timestamp: new Date().toISOString() };
      socket.emit("message", message); // Emit message for real-time updates
      mutation.mutate({ message: messageInput, timestamp: new Date().toISOString() }); // Persist message in the database
      setMessageInput("");
    }
  };

  return (
    <div className="flex justify-center items-center w-full">
      <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
        <div className="flex flex-col h-full">
          <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md">
            {messages.map((msg, index) => (
              <div key={index}>
                <div className="flex items-center flex-wrap">
                  <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden my-2 mr-2 bg-green-300 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(users?.find((user) => user.userId === msg.userId)?.name || "")}</span>
                  </div>
                  <div
                    className=" bg-blue-500 
                   text-white p-2 rounded-md"
                  >
                    {msg.message}
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{msg.timestamp}</span>
              </div>
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
