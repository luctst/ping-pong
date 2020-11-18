import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Ping Ping Ping Pong
        </Link>
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
