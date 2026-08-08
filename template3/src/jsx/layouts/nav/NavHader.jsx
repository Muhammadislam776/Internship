import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import { navtoggle } from "../../../store/actions/AuthActions";
import logo from "../../../assets/images/weic-logo.jpg";

const NavHader = () => {
  const { openMenuToggle, background } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const sideMenu = useSelector((state) => state.sideMenu);

  const handleToogle = () => {
    dispatch(navtoggle());
  };

  return (
    <div className="nav-header">
      <Link to="/dashboard" className="brand-logo d-flex align-items-center">
        <img
          src={logo}
          alt="WEIC Dash Logo"
          className="logo-abbr"
          style={{
            height: "42px",
            width: "42px",
            objectFit: "contain",
            borderRadius: "6px",
          }}
        />
        <span
          className="brand-title"
          style={{
            color: background?.value === "dark" ? "#ffffff" : "#0d6efd",
            marginLeft: "10px",
            fontSize: "20px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            display: "inline-block",
          }}
        >
          WEIC Dash
        </span>
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          openMenuToggle();
          handleToogle();
        }}
      >
        <div className={`hamburger ${sideMenu ? "is-active" : ""}`}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
