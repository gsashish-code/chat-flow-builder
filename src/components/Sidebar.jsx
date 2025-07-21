import React from "react";
import "./Sidebar.css";
import NodesPanel from "./panels/NodePanel";
import SettingsPanel from "./panels/SettingsPanel";

/**
 * Sidebar component that switches between Nodes Panel and Settings Panel
 * based on the current mode and selected node
 */
function Sidebar({ mode, selectedNode, onUpdateNode }) {
  return (
    <div className="sidebar">
      {mode === "nodes" ? (
        <NodesPanel />
      ) : (
        <SettingsPanel
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
        />
      )}
    </div>
  );
}

export default Sidebar;
