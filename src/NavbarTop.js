import React from "react";
import brainrotlogo from "./assets/brainrotlogo.PNG";

const NavbarTop = () => {
  return (
    <nav className="navbar navbar-dark bg-transparent fixed-top py-2">
      <span className="navbar-brand mx-auto">
        <img
          src={brainrotlogo}
          width="75"
          height="75"
          className="d-inline-block align-top"
          alt=""
        />
      </span>
    </nav>
  );
};

export default NavbarTop;
