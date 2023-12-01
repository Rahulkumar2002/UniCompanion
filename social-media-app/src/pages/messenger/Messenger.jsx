import './messenger.css';
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';

export default function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState({});
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [reciverPP , setReceiverPP] = useState("");
    const [receiverLang , setReceiverLang] = useState(0);
    const socket = useRef();
    const { user } = useContext(AuthContext);
    const [senderLang , setSenderLang] = useState(user.lang);
    const scrollRef = useRef();

    console.log("Message user :: ", user)

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET_URL);
        socket.current.on("getMessage", data => {
            console.log("ArrivalMessageData : " ,data )
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        });
    }, [])

    useEffect(() => {
        console.log("ArrivalMessage :::::: " , arrivalMessage)
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
         
        console.log("SetMessageArrivalMessage :: ::: " , messages)    
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            console.log("Users array : " , users)
            const live = [];
            let i = 0 ;
            while(i < users.length){
                if (user._id !== users[i].userId){
                    live.push(users);
                }
                i++ ; 
            }
            setOnlineUsers(
                // user.followings.filter((f) => users.some((u) => u.userId === f)) 
                live
            );

        });
    }, [user]);
    console.log("Online Users : " , onlineUsers)

    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversations/" + user._id);
                setConversations(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        getConversations()
    }, [user])

    useEffect(async () => {
        if (currentChat !== null) {
            const receiverId = currentChat.members.find(member => member !== user._id);
            const receiver = await getUser(receiverId) ; 
            setReceiverPP(receiver.profilePicture);
        }
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat])

    const getUser = async (id) => {
        try {
          const response = await axios("/users?userId=" + id);
          console.log("Users from messenger :: ", response.data);
          return response.data;
        } catch (error) {
          console.log("Error in getting user :: ", error);
          throw error; // Rethrow the error for handling higher up, if needed
        }
      };

    const getTranslationHindi = async (newMessage) => {
          try {
            const response =  await axios.post(`${process.env.REACT_APP_FLASK} + translateHindi`, {
                english_text : newMessage
              })
              console.log("Translated Text :: " , response.data.response);
              let translatedText = response.data.response // 
              return translatedText ;
          } catch (error) {
            console.log("Error in Translating the text :: ", error);
          }
    }

    const getTranslationEnglish = async (newMessage) => {
        try {
          const response =  await axios.post(`${process.env.REACT_APP_FLASK} + translateEnglish`, {
              hindi_text : newMessage
            })
            console.log("Translated Text :: " , response.data.response);
            let translatedText = response.data.response // 
            return translatedText ;
        } catch (error) {
          console.log("Error in Translating the text :: ", error);
        }
  }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const receiverId = currentChat.members.find(member => member !== user._id);
       
        const sender = await getUser(user._id);
        setSenderLang(sender.lang) ; 
        console.log("sender :: " ,  sender , " sendlang : " , senderLang);
        let textArray = [2] ; 
        if (sender.lang === 1) {
            textArray[1] = newMessage ; 
            textArray[0] = await getTranslationHindi(newMessage);
        } else {
            textArray[0] = newMessage ; 
            textArray[1] = await getTranslationEnglish(newMessage);
        }
        
        console.log("TextArray : " , textArray)

        const message = {
            sender: user._id,
            text: textArray, //
            conversationId: currentChat._id,
        };

        const receiver = await getUser(receiverId) ; 
        setReceiverLang(receiver.lang) ; 
        setReceiverPP(receiver.profilePicture);
        console.log("textArray[receiverLang] : " , textArray[receiverLang])
        socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId : receiverId,
                text: textArray[receiverLang] 
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])
    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu" >
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput" />
                        {conversations.map((c) => (
                            <div onClick={() => setCurrentChat(c)}>
                                <Conversation key={c._id} conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ?
                            (<>
                                <div className="chatBoxTop">

                                    {messages.map((m) => (
                                        <div ref={scrollRef}>
                                            <Message message={m} own={m.sender === user._id} SenderLang={senderLang} ReceiverPP={reciverPP} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea className="chatMessageInput" placeholder="write something ..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage}></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                                </div>
                            </>) : (<span className="noConversationText">Open a conversations to start a chat.</span>)
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline
                            onlineUsers={onlineUsers}
                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
