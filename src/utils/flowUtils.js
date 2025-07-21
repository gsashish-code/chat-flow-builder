/**
 * Utility functions for flow management and validation
 */

/**
 * Generate a unique node ID
 * @returns {string} Unique node identifier
 */
export const generateNodeId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate the flow structure according to the requirements
 * Rules:
 * - If there are more than one nodes, then more than one node should not have empty target handles
 *
 * @param {Array} nodes - Array of flow nodes
 * @param {Array} edges - Array of flow edges
 * @returns {Object} Validation result with isValid boolean and errorMessage string
 */
export const validateFlow = (nodes, edges) => {
  // If there's only one node or no nodes, validation passes
  if (nodes.length <= 1) {
    return { isValid: true, errorMessage: "" };
  }

  // Find nodes that have no incoming connections (empty target handles)
  const nodesWithEmptyTargets = nodes.filter((node) => {
    const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
    return !hasIncomingEdge;
  });

  // If there are more than one node with empty target handles, validation fails
  if (nodesWithEmptyTargets.length > 1) {
    return {
      isValid: false,
      errorMessage: `Cannot save flow: ${nodesWithEmptyTargets.length} nodes have no incoming connections. Only one starting node is allowed.`,
    };
  }

  return { isValid: true, errorMessage: "" };
};

/**
 * Check if a source handle already has a connection
 * @param {string} sourceNodeId - ID of the source node
 * @param {string} sourceHandle - ID of the source handle
 * @param {Array} edges - Array of existing edges
 * @returns {boolean} True if source handle already has a connection
 */
export const hasExistingConnection = (sourceNodeId, sourceHandle, edges) => {
  return edges.some(
    (edge) => edge.source === sourceNodeId && edge.sourceHandle === sourceHandle
  );
};

/**
 * Get all nodes that are not connected to any other node
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Array} Array of isolated nodes
 */
export const getIsolatedNodes = (nodes, edges) => {
  return nodes.filter((node) => {
    const hasConnection = edges.some(
      (edge) => edge.source === node.id || edge.target === node.id
    );
    return !hasConnection;
  });
};

/**
 * Count nodes by type
 * @param {Array} nodes - Array of nodes
 * @returns {Object} Object with node type counts
 */
export const getNodeTypeCounts = (nodes) => {
  return nodes.reduce((counts, node) => {
    counts[node.type] = (counts[node.type] || 0) + 1;
    return counts;
  }, {});
};

/**
 * Export flow data for saving/sharing
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Object} Exportable flow data
 */
export const exportFlowData = (nodes, edges) => {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
    metadata: {
      version: "1.0",
      createdAt: new Date().toISOString(),
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
  };
};
