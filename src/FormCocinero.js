import { useEffect, useState } from "react";
import { RiSendPlaneLine } from "react-icons/ri";
import io from "socket.io-client";
import { gifs } from "./gifs";
import { obtenerHora } from "./obtenerHora";

//const socket = io("http://localhost:9000");
const socket = io("https://backend-chat-giyg.onrender.com");

const FormCocinero = () => {
      const [message, setMessage] = useState("");
      const [messages, setMessages] = useState([]);

      useEffect(() => {
            socket.on("message", (message) => {
                  if (message.from !== "Yo") {
                        const words = message.body.split(" ");
                        const gifsUrls = words.flatMap((word) => {
                              const gif = gifs[word];
                              return gif ? [gif] : [];
                        });

                        message.gif = gifsUrls;
                        console.log(message.gif);
                  }

                  setMessages([...messages, message]);
            });
            return () => {
                  socket.off("message", (message) => console.log(message));
            };
      }, [messages]);

      const handleSubmit = (e) => {
            e.preventDefault();
            socket.emit("message", {
                  body: message,
                  from: "Cocinero",
                  timestamp: new Date().getTime(),
                  isText: true,
            });
            const newMessage = {
                  body: message,
                  from: "Yo",
                  timestamp: new Date().getTime(),
                  isText: true,
            };
            setMessages([...messages, newMessage]);
            setMessage("");
      };

      const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp); // ordenar los mensajes por tiempo

      return (
            <div className="h-screen bg-zinc-800 text-white flex items-center justify-center ">
                  <form
                        onSubmit={handleSubmit}
                        className="bg-zinc-900 p-10  w-1/2"
                  >
                        <h1 className="text-2xl font-bold my-2 text-center">
                              Chat Cocinero
                        </h1>

                        <ul className="h-80 overflow-y-auto">
                              {sortedMessages.map((message) => (
                                    <li
                                          key={message.timestamp}
                                          className={`p-2 my-2 table text-sm rounded-2xl ${
                                                message.from === "Yo"
                                                      ? "bg-blue-500 ml-auto"
                                                      : "bg-blue-800"
                                          }`}
                                    >
                                          {message.isText ? (
                                                <>
                                                      <p>
                                                            <b>
                                                                  {message.from}
                                                                  :
                                                            </b>{" "}
                                                            {message.body}
                                                      </p>
                                                      {message.gif &&
                                                      message.gif !== "" &&
                                                      typeof message.gif[0] ===
                                                            "string" &&
                                                      message.gif[0].endsWith(
                                                            ".m4v"
                                                      ) ? (
                                                            <video
                                                                  src={
                                                                        message.gif
                                                                  }
                                                                  className="my-2 w-64"
                                                                  autoPlay
                                                                  loop
                                                            />
                                                      ) : message.gif &&
                                                        message.gif !== "" &&
                                                        typeof message
                                                              .gif[0] ===
                                                              "string" ? (
                                                            <img
                                                                  src={
                                                                        message.gif
                                                                  }
                                                                  alt=""
                                                                  className="my-2 w-64"
                                                            />
                                                      ) : null}
                                                </>
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

                                          <p className="text-xs text-end font-light">
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
                        </div>
                  </form>
            </div>
      );
};

export default FormCocinero;
