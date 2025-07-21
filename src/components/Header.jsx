import React from "react";
import { Save } from "lucide-react";
import "./Header.css";

/**
 * Header component containing the save button and app title
 */
function Header({ onSave, message }) {
  return (
    <div className="header">
      <div className="header-title">
        <h1>Chatbot Flow Builder</h1>
      </div>
      <div
        className={
          Object.keys(message).length > 0
            ? message.isError
              ? "badge error-message"
              : "badge success-message"
            : ""
        }>
        {message?.message ?? ""}
      </div>
      <div className="header-actions">
        <button className="save-btn" onClick={onSave}>
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Header;
