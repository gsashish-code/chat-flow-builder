import React from "react";
import { Handle, Position } from "reactflow";
import { MessageSquare } from "lucide-react";
import "./TextNode.css";

/**
 * TextNode component - represents a text message node in the flow
 * Features:
 * - One target handle (left) - can receive multiple connections
 * - One source handle (right) - can only have one outgoing connection
 * - Displays message text with truncation for long messages
 */
function TextNode({ data, selected }) {
  // Truncate long text for display
  const displayText =
    data.text && data.text.length > 60
      ? data.text.substring(0, 60) + "..."
      : data.text || "Click to edit message";

  return (
    <div className={`text-node ${selected ? "selected" : ""}`}>
      {/* Target handle - can receive multiple incoming connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="node-handle target-handle"
      />

      <div className="node-content">
        <div className="node-header">
          <div className="node-icon">
            <MessageSquare size={14} />
          </div>
          <div className="node-title">Send Message</div>
        </div>

        <div className="node-body">
          <div className="message-text">{displayText}</div>
        </div>
      </div>

      {/* Source handle - can only have one outgoing connection */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="node-handle source-handle"
      />
    </div>
  );
}

export default TextNode;
