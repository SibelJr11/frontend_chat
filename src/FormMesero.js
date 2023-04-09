import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { addMessage } from "./features/messageSlice";
import Menu from "./Menu";
import { obtenerHora } from "./obtenerHora";
import { RiMic2Fill, RiOrderPlayFill, RiSendPlaneLine } from "react-icons/ri";

//const socket = io("http://localhost:9000");
const socket = io("https://backend-chat-giyg.onrender.com");

const FormMesero = () => {
      const messages = useSelector((state) => state.messages);
      const dispatch = useDispatch();
      const [message, setMessage] = useState("");
      const [isListening, setIsListening] = useState(false);
      const [showMenu, setShowMenu] = useState(false);

      useEffect(() => {
            socket.on("message", (message) => dispatch(addMessage(message)));
            return () => {
                  socket.off("message");
            };
      }, []);

      const handleVoiceRecognition = (e) => {
            e.preventDefault();
            let SpeechRecognition =
                  window.SpeechRecognition || window.webkitSpeechRecognition;
            let recognition = new SpeechRecognition();
            recognition.lang = "es-ES";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                  setIsListening(true);
                  console.log("Estás hablando");
            };

            recognition.onend = () => {
                  setIsListening(false);
                  console.log("Terminaste de hablar");
            };

            recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  setMessage(transcript);
            };

            recognition.start();
      };

      const handleSubmit = (e) => {
            e.preventDefault();
            socket.emit("message", {
                  body: message,
                  from: "Mesero",
                  timestamp: new Date().getTime(),
                  isText: true,
            });

            dispatch(
                  addMessage({
                        body: message,
                        from: "Yo",
                        timestamp: new Date().getTime(),
                        isText: true,
                  })
            );
            setMessage("");
      };

      // Ordenar mensajes por marca de tiempo
      const sortedMessages = [...messages].sort(
            (a, b) => a.timestamp - b.timestamp
      ); // ordenar los mensajes por tiempo

      return (
            <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
                  <form
                        onSubmit={handleSubmit}
                        className="bg-zinc-900 p-10 w-1/2"
                  >
                        <h1 className="text-2xl font-bold my-2 text-center">
                              Chat Mesero
                        </h1>
                        <ul className="h-80 overflow-y-auto">
                              {messages.map((message) => (
                                    <li
                                          key={message.timestamp}
                                          className={`p-2 my-2 table text-sm rounded-2xl mw-50  ${
                                                message.from === "Yo"
                                                      ? "bg-blue-500 ml-auto"
                                                      : "bg-blue-800"
                                          }`}
                                    >
                                          {message.isText ? (
                                                <p>
                                                      <b>{message.from}:</b>{" "}
                                                      {message.body}
                                                </p>
                                          ) : (
                                                <>
                                                      <p>
                                                            <b>
                                                                  {message.from}
                                                                  :
                                                            </b>
                                                      </p>
                                                      <img
                                                            src={message.body}
                                                            alt=""
                                                            className="my-2 w-52 "
                                                      />
                                                </>
                                          )}
                                          <p className="text-xs  text-end font-light">
                                                {obtenerHora(message.timestamp)}
                                          </p>
                                    </li>
                              ))}
                        </ul>
                        <div className="flex gap-3 items-center justify-between relative">
                              <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="border-2 border-zinc-500 p-2 text-black w-full h-10"
                              />

                              <button className="bg-blue-700 py-4 px-4 rounded-full  hover:bg-blue-800 transition-colors duration-300 ease-in-out">
                                    <RiSendPlaneLine size={20} />
                              </button>

                              <button
                                    type="button"
                                    className="bg-blue-700 py-4 px-4 rounded-full hover:bg-blue-800 transition-colors duration-300 ease-in-out"
                                    onClick={() => setShowMenu(!showMenu)}
                              >
                                    <RiOrderPlayFill size={20} />
                              </button>

                              <button
                                    type="button"
                                    className="bg-blue-700 py-4 px-4 rounded-full  hover:bg-blue-800 transition-colors duration-300 ease-in-out"
                                    onClick={(e) => handleVoiceRecognition(e)}
                              >
                                    <RiMic2Fill size={20} />
                              </button>
                        </div>
                        {isListening && (
                              <div className="fixed top-0 left-0 h-full w-full bg-gray-500 opacity-75 flex items-center justify-center">
                                    <h2 className="text-white font-bold text-3xl">
                                          Estás hablando...
                                    </h2>
                              </div>
                        )}
                  </form>
                  {showMenu && <Menu socket={socket} />}
            </div>
      );
};

export default FormMesero;
