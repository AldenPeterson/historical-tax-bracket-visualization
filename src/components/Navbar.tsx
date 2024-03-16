import React from "react";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
import '../index.css'


import { Menubar } from "primereact/menubar";

const Navbar: React.FC = () => {
  const navBarItems = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "#/",
    },
    {
      label: "FAQ",
      icon: "pi pi-fw pi-question",
      url: "#/faq",
    },
  ];

  return (
    <div className="navbar">
      <Menubar model={navBarItems} />
    </div>
  );
};

export default Navbar;
