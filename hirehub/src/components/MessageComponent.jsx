import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import socket from "../socket";

const MessageModal = ({ isOpen, onClose, senderId, reciever, chatroomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(chatroomId);

  useEffect(() => {
    if(!chatId){
      fetchChatId();
    }else{
      fetchMessages();
    }
    socket.on("receiveMessage", (message) => {
      console.log('receiveMessage',message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => socket.off("receiveMessage");
  }, []);
  const fetchChatId = async()=>{
    console.log('senderId',senderId,'receiverId',reciever._id);
    const response = await fetch(`http://localhost:4000/api/getchatId?senderId=${encodeURIComponent(senderId)}&receiverId=${encodeURIComponent(reciever._id)}`, {
      method: 'GET',
  });
  const data = await response.json();
  console.log(data);
  if(data.chat){
    setChatId(data.chat._id);
  }
  if(data.messages){
    setMessages(data.messages);
  }
  }
  const fetchMessages = async()=>{
    console.log('fetchMessages');
    const response = await fetch(`http://localhost:4000/api/fetchMessages?chatId=${encodeURIComponent(chatId)}`, {
      method: 'GET',
  });
  const data = await response.json();
  console.log(data);
  if(data.messages){
    setMessages(data.messages);
  }
  } 
 
  const sendMessage = () => {
    
    if (newMessage.trim()) {
      const messageData = {
        chatId: chatId,
        senderId: senderId,
        receiverId: reciever._id || reciever.id,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      console.log('messageData',messageData)
      socket.emit("sendMessage", messageData);

      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage("");
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{reciever.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 bg-gray-50" style={{ height: "300px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.senderId === senderId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.senderId === senderId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } max-w-xs shadow-md`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 text-gray-400 text-right">
                  {msg.createdAt || "Now"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.94 12.94a1.5 1.5 0 001.768.326l10.486-6.63a.75.75 0 010 1.3l-10.486 6.63a1.5 1.5 0 01-2.236-1.33V6.96a1.5 1.5 0 01.468-1.07 1.5 1.5 0 011.768-.326l10.486 6.63a.75.75 0 010 1.3L4.708 16.944a1.5 1.5 0 01-1.768-.326 1.5 1.5 0 01-.468-1.07V8.98a1.5 1.5 0 01.468-1.07z" />
            </svg>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MessageModal;
