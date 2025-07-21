import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import Header from "./Header";
import Sidebar from "./Sidebar";
import TextNode from "./nodes/TextNode";
import { generateNodeId, validateFlow } from "../utils/flowUtils";
import "./FormBuilder.css";

// Define node types for React Flow
const nodeTypes = {
  textNode: TextNode,
};

/**
 * Main FlowBuilder component that orchestrates the entire flow building interface
 */
function FlowBuilder() {
  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [messages, setMessages] = useState({});
  // UI state management
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarMode, setSidebarMode] = useState("nodes"); // 'nodes' or 'settings'

  // Ref for the React Flow wrapper to handle drag and drop
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  /**
   * Handle connection between nodes with validation
   * - Only allow one outgoing edge per source handle
   */
  const onConnect = useCallback(
    (params) => {
      // Check if source already has an outgoing connection
      const sourceHasConnection = edges.some(
        (edge) =>
          edge.source === params.source &&
          edge.sourceHandle === params.sourceHandle
      );

      if (sourceHasConnection) {
        setMessages({
          message: "Each node can only have one outgoing connection",
          isError: true,
        });
        return;
      } else {
        setMessages({});
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  /**
   * Handle node selection
   * - Switch to settings panel when a node is selected
   * - Switch back to nodes panel when clicking on empty space
   */
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSidebarMode("settings");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSidebarMode("nodes");
  }, []);

  /**
   * Handle dropping a new node onto the canvas
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: generateNodeId(),
        type,
        position,
        data: {
          label: "New Text Message",
          text: "Enter your message here...",
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /**
   * Update node data when text is changed in settings panel
   */
  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  /**
   * Save flow with validation
   * - Check if more than one node exists and any node has empty target handles
   */
  const saveFlow = useCallback(() => {
    const validation = validateFlow(nodes, edges);

    if (!validation.isValid) {
      setMessages({
        message: validation.errorMessage,
        isError: true,
      });
      return;
    }

    // Here you would typically save to a backend
    console.log("Saving flow:", { nodes, edges });
    setMessages({
      message: "Flow saved successfully!",
      isError: false,
    });
  }, [nodes, edges]);

  return (
    <div className="flow-builder">
      <Header onSave={saveFlow} message={messages} />

      <div className="flow-builder-content">
        <div className="flow-canvas" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={(instance) => (reactFlowInstance.current = instance)}
            nodeTypes={nodeTypes}
            fitView
            className="react-flow-canvas">
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <Sidebar
          mode={sidebarMode}
          selectedNode={selectedNode}
          onUpdateNode={updateNodeData}
        />
      </div>
    </div>
  );
}

// Wrap with ReactFlowProvider for context
export default function FlowBuilderWrapper() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}
