import React, { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import "./SettingPanel.css";

/**
 * SettingsPanel component for editing selected node properties
 */
function SettingsPanel({ selectedNode, onUpdateNode }) {
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");

  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setText(selectedNode.data.text || "");
      setLabel(selectedNode.data.label || "");
    }
  }, [selectedNode]);

  /**
   * Handle text change and update the node immediately
   */
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        text: newText,
        label: newText || "New Text Message", // Update label to show preview
      });
    }
  };

  /**
   * Handle going back to nodes panel
   */
  const handleBack = () => {
    // This will be handled by the parent component through node deselection
    window.dispatchEvent(new Event("pane-click"));
  };

  if (!selectedNode) {
    return (
      <div className="settings-panel">
        <div className="panel-header">
          <h3>No node selected</h3>
          <p>Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="panel-header">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={16} />
          Back
        </button>
        <h3>Message Node</h3>
        <p>Edit the text message content</p>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="node-text">Text Message</label>
          <textarea
            id="node-text"
            className="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your message here..."
            rows={4}
          />
          <p className="help-text">
            This text will be sent as a message in the chat flow
          </p>
        </div>

        <div className="node-preview">
          <div className="preview-label">Preview:</div>
          <div className="preview-node">
            <div className="preview-icon">
              <MessageSquare size={16} />
            </div>
            <div className="preview-text">
              {text || "Enter your message here..."}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <div className="node-info">
          <strong>Node ID:</strong> {selectedNode.id}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
