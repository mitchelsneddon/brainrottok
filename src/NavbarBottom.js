import React from "react";
import {
  FaRandom,
  FaFutbol,
  FaMusic,
  FaFlask,
  FaLandmark,
} from "react-icons/fa";

const categories = [
  { name: "Sport", icon: <FaFutbol /> },
  { name: "Music", icon: <FaMusic /> },
  { name: "Explore", icon: <FaRandom /> },
  { name: "Science", icon: <FaFlask /> },
  { name: "History", icon: <FaLandmark /> },
];

const NavbarBottom = ({ setCategory }) => {
  return (
    <nav className="navbar navbar-dark bg-dark fixed-bottom pt-3 pb-2">
      <div className="container-fluid d-flex justify-content-space-between flex-wrap mx-2">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="category-section text-center"
            onClick={() => setCategory(cat.name)}
          >
            {cat.icon}
            <span className="category-text">{cat.name}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavbarBottom;
