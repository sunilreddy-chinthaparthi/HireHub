import React, { useState, useEffect } from "react";
import MessageComponent from '../components/MessageComponent'; 

const MessageThreadDropdown = ({ userId }) => {
  const [threads, setThreads] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [reciever, setReciever] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const toggleMessages = () => setIsMessageModalOpen(!isMessageModalOpen); 

  useEffect(() => {
    if (userId && isOpen) {
      fetchThreads();
    }
  }, [userId, isOpen]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/chats/${userId}`, {
        method: "GET",
      });
      const data = await response.json();
      console.log('data',data);
      setThreads(data.threads || []);
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSelectThread = (thread) =>{
    setChatId(thread._id);
    const receiver = thread.participants.find(item=> item.id!=userId)
    setReciever(receiver);
    setIsMessageModalOpen(true);
  }
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>{isMessageModalOpen && <MessageComponent isOpen={isMessageModalOpen} senderId={userId} chatroomId={chatId} reciever={reciever} onClose={toggleMessages} />}
    
    <div className="relative ">
      {isOpen && (
        <div className="absolute right-0 mt-4 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto animate-fadeIn">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : threads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No messages found</div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread._id}
                onClick={() => onSelectThread(thread)}
                className="p-4 hover:bg-gray-100 cursor-pointer border-b last:border-none"
              >
                <div className="font-semibold text-sm">
                  {thread.participants
                    .find((item) => item.id != userId)
                    .name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Last Message: {thread.lastMessage || "No messages yet"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default MessageThreadDropdown;
