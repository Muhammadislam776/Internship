import React, { useState } from "react";

/// React router dom
import { Link } from "react-router-dom";

/// images
import logo from "../../../images/logo.png";
import logoText from "../../../images/logo-text.png";

export function  NavMenuToggle(){
	setTimeout(()=>{	
		let mainwrapper = document.querySelector("#main-wrapper");
		if(mainwrapper.classList.contains('menu-toggle')){
			mainwrapper.classList.remove("menu-toggle");
		}else{
			mainwrapper.classList.add("menu-toggle");
		}
	},200);
}

const NavHader = () => {
   const [toggle, setToggle] = useState(false);

   return (
      <div className="nav-header" style={{
         background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
         boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
         borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
         transition: "all 0.3s ease"
      }}>
         <Link to={"/dashboard"} className="brand-logo d-flex align-items-center text-decoration-none" style={{ paddingLeft: "25px" }}>
            {/* Logo Badge Container */}
            <div className="logo-badge d-flex align-items-center justify-content-center me-3"
                 style={{
                    background: "#FFFFFF",
                    borderRadius: "10px",
                    padding: "5px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    width: "42px",
                    height: "42px",
                    flexShrink: 0
                 }}>
               <img className="logo-abbr" src={logo} alt="WEIC Dash Logo" style={{ height: "30px", width: "30px", objectFit: "contain" }} />
            </div>

            {/* Brand Title: WEIC DASH */}
            <div className="brand-title d-flex align-items-center">
               <span style={{
                  fontSize: "21px",
                  fontWeight: "800",
                  letterSpacing: "1.2px",
                  color: "#FFFFFF",
                  fontFamily: "'Poppins', sans-serif"
               }}>WEIC</span>
               <span style={{
                  fontSize: "21px",
                  fontWeight: "700",
                  letterSpacing: "1.2px",
                  background: "linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginLeft: "5px",
                  fontFamily: "'Poppins', sans-serif"
               }}>DASH</span>
            </div>
         </Link>

         <div className="nav-control" onClick={() => 
               {
                  setToggle(!toggle)
                  NavMenuToggle();
               }}
            >
            <div className={`hamburger ${toggle ? "is-active" : ""}`}>
               <span className="line" style={{ background: "#FFFFFF" }}></span>
               <span className="line" style={{ background: "#FFFFFF" }}></span>
               <span className="line" style={{ background: "#FFFFFF" }}></span>
            </div>
         </div>
      </div>
   );
};

export default NavHader;
