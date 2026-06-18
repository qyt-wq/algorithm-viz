/**
 * Dijkstra 最短路径算法引擎
 * 返回完整的步骤序列，每步包含节点距离状态、访问状态、描述等
 * 支持使用内置图或自定义图结构
 */

// 内置图结构（用于可视化）
export const DEFAULT_GRAPH = {
  nodes: [
    { id: 'A', x: 200, y: 60 },
    { id: 'B', x: 100, y: 180 },
    { id: 'C', x: 300, y: 180 },
    { id: 'D', x: 80, y: 320 },
    { id: 'E', x: 200, y: 300 },
    { id: 'F', x: 320, y: 320 },
    { id: 'G', x: 200, y: 420 },
  ],
  edges: [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'C', weight: 1 },
    { from: 'B', to: 'D', weight: 5 },
    { from: 'C', to: 'E', weight: 10 },
    { from: 'B', to: 'E', weight: 3 },
    { from: 'D', to: 'E', weight: 4 },
    { from: 'D', to: 'G', weight: 6 },
    { from: 'E', to: 'F', weight: 2 },
    { from: 'E', to: 'G', weight: 8 },
    { from: 'F', to: 'G', weight: 1 },
  ],
};

/**
 * 自动布局 — 将节点均匀分布在圆形上
 * @param {string[]} nodeIds - 节点ID列表
 * @returns {{ id: string, x: number, y: number }[]}
 */
export function autoLayout(nodeIds) {
  const sorted = [...nodeIds].sort();
  const count = sorted.length;
  const cx = 200, cy = 250;
  const radius = count <= 4 ? 100 : count <= 7 ? 140 : Math.min(180, 50 + count * 15);
  const startAngle = -Math.PI / 2; // 从顶部开始

  return sorted.map((id, i) => {
    const angle = startAngle + (2 * Math.PI * i) / count;
    return {
      id,
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle)),
    };
  });
}

/**
 * @param {string} startNodeId - 起始节点ID（如 'A'）
 * @param {object} [graphData] - 可选的自定义图数据 { nodes, edges }，不传则使用内置图
 * @returns {{ steps: Step[], graph: object }} 步骤序列和使用的图结构
 */
export function dijkstraEngine(startNodeId, graphData) {
  const graph = graphData || DEFAULT_GRAPH;
  const steps = [];
  const nodes = graph.nodes.map((n) => n.id);

  // 初始化距离和前驱
  const distances = {};
  const predecessors = {};
  const visited = new Set();

  for (const node of nodes) {
    distances[node] = node === startNodeId ? 0 : Infinity;
    predecessors[node] = null;
  }

  // 初始状态
  steps.push({
    type: 'init',
    distances: { ...distances },
    predecessors: { ...predecessors },
    visited: new Set(),
    current: null,
    description: `初始化：起点 ${startNodeId} 距离 = 0，其余节点距离 = ∞`,
    highlightedEdges: [],
    relaxedEdges: [],
  });

  const unvisited = new Set(nodes);

  while (unvisited.size > 0) {
    // 找未访问节点中距离最小的
    let minNode = null;
    let minDist = Infinity;
    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        minNode = node;
      }
    }

    if (minNode === null || minDist === Infinity) break;

    unvisited.delete(minNode);
    visited.add(minNode);

    steps.push({
      type: 'select-node',
      distances: { ...distances },
      predecessors: { ...predecessors },
      visited: new Set(visited),
      current: minNode,
      description: `选择距离最小的未访问节点 ${minNode}（距离=${minDist === Infinity ? '∞' : minDist}），标记为已访问`,
      highlightedEdges: [],
      relaxedEdges: [],
    });

    // 松弛邻居
    const neighbors = graph.edges.filter(
      (e) => e.from === minNode || e.to === minNode
    );

    for (const edge of neighbors) {
      const neighbor = edge.from === minNode ? edge.to : edge.from;
      if (visited.has(neighbor)) continue;

      const newDist = distances[minNode] + edge.weight;

      steps.push({
        type: 'relax-check',
        distances: { ...distances },
        predecessors: { ...predecessors },
        visited: new Set(visited),
        current: minNode,
        description: `检查边 ${minNode}→${neighbor}（权重=${edge.weight}）: ${distances[minNode]} + ${edge.weight} = ${newDist}，当前 ${neighbor} 距离 = ${distances[neighbor] === Infinity ? '∞' : distances[neighbor]}`,
        highlightedEdges: [{ from: minNode, to: neighbor }],
        relaxedEdges: [],
      });

      if (newDist < distances[neighbor]) {
        const oldDist = distances[neighbor];
        distances[neighbor] = newDist;
        predecessors[neighbor] = minNode;

        steps.push({
          type: 'relax-update',
          distances: { ...distances },
          predecessors: { ...predecessors },
          visited: new Set(visited),
          current: minNode,
          description: `更新 ${neighbor}: ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}，前驱设为 ${minNode}`,
          highlightedEdges: [{ from: minNode, to: neighbor }],
          relaxedEdges: [{ from: minNode, to: neighbor }],
        });
      } else {
        steps.push({
          type: 'relax-skip',
          distances: { ...distances },
          predecessors: { ...predecessors },
          visited: new Set(visited),
          current: minNode,
          description: `${newDist} ≥ ${distances[neighbor]}，不更新 ${neighbor}`,
          highlightedEdges: [{ from: minNode, to: neighbor }],
          relaxedEdges: [],
        });
      }
    }
  }

  // 构建最短路径边集合
  const pathEdges = [];
  for (const [node, pred] of Object.entries(predecessors)) {
    if (pred) {
      pathEdges.push({ from: pred, to: node });
    }
  }

  // 完成状态
  steps.push({
    type: 'complete',
    distances: { ...distances },
    predecessors: { ...predecessors },
    visited: new Set(visited),
    current: null,
    description: `算法完成！已找到从 ${startNodeId} 到所有可达节点的最短路径`,
    highlightedEdges: [],
    relaxedEdges: pathEdges,
  });

  return { steps, graph };
}
