import React from "react";
import { MessageSquare, Plus } from "lucide-react";
import "./NodePanel.css";

/**
 * Available node types for the flow builder
 * This array makes it easy to add new node types in the future
 */
const availableNodes = [
  {
    id: "textNode",
    type: "textNode",
    label: "Message",
    icon: MessageSquare,
    description: "Send a text message",
  },
  // Future node types can be added here:
  // {
  //   id: 'imageNode',
  //   type: 'imageNode',
  //   label: 'Image',
  //   icon: Image,
  //   description: 'Send an image',
  // },
];

/**
 * NodesPanel component displays available node types that can be dragged onto the canvas
 */
function NodesPanel() {
  /**
   * Handle drag start - set the node type in the dataTransfer
   */
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="nodes-panel">
      <div className="panel-header">
        <h3>Nodes Panel</h3>
        <p>Drag and drop nodes to add them to the flow</p>
      </div>

      <div className="nodes-list">
        {availableNodes.map((node) => {
          const IconComponent = node.icon;

          return (
            <div
              key={node.id}
              className="node-item"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}>
              <div className="node-item-icon">
                <IconComponent size={20} />
              </div>
              <div className="node-item-content">
                <h4>{node.label}</h4>
                <p>{node.description}</p>
              </div>
              <div className="node-item-action">
                <Plus size={16} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel-footer">
        <p className="help-text">
          More node types will be added in future updates
        </p>
      </div>
    </div>
  );
}

export default NodesPanel;
