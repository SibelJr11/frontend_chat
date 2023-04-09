import React from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "./features/messageSlice";

const Menu = ({ socket }) => {
      const dispatch = useDispatch();
      const platos = [
            {
                  id: 1,
                  name: "Hamburguesa",
                  image: "https://www.goodnes.com/sites/g/files/jgfbjl321/files/srh_recipes/aafaf8ff82d5b614e8f1522f4e355766.png",
            },
            {
                  id: 2,
                  name: "Pizza",
                  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/800px-Eq_it-na_pizza-margherita_sep2005_sml.jpg",
            },
            {
                  id: 3,
                  name: "Hot Dog",
                  image: "https://cdn2.cocinadelirante.com/sites/default/files/styles/gallerie/public/porque-comer-un-hot-dog-reduce-la-vida.jpg",
            },
      ];

      const handleSendImage = (message) => {
            socket.emit("message", {
                  body: message,
                  from: "Mesero",
                  timestamp: new Date().getTime(),
                  isText: false,
            });
            const newMessage = {
                  body: message,
                  from: "Yo",
                  timestamp: new Date().getTime(),
                  isText: false,
            };
            dispatch(addMessage(newMessage));
      };
      return (
            <div className="absolute top-12 right-0 bg-white rounded shadow-md p-4 w-64 overflow-y-auto">
                  <ul className="h-80 overflow-y-auto">
                        <h2 className="text-center text-black font-bold">
                              Platos
                        </h2>
                        {platos.map((plato) => (
                              <li
                                    key={plato.id}
                                    className="mt-5 hover:cursor-pointer"
                                    onClick={() => handleSendImage(plato.image)}
                              >
                                    <img
                                          src={plato.image}
                                          alt={`Menu ${plato.id}`}
                                    />
                                    <p className="text-gray-700">
                                          {plato.name}
                                    </p>
                              </li>
                        ))}
                  </ul>
            </div>
      );
};

export default Menu;
