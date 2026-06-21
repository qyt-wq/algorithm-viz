/**
 * 哈夫曼编码树引擎
 * 贪心算法：每次选择两个最小频率节点合并，构建最优二叉树
 */
export function huffmanEngine(frequencyMap) {
  const steps = [];

  // 创建初始叶子节点
  let nodes = Object.entries(frequencyMap).map(([char, freq]) => ({
    id: `leaf-${char}`,
    char,
    freq,
    left: null,
    right: null,
  }));

  steps.push({
    type: 'init',
    nodes: nodes.map((n) => ({ ...n, left: n.left ? { ...n.left } : null, right: n.right ? { ...n.right } : null })),
    description: `初始森林：${nodes.map((n) => `'${n.char}'(${n.freq})`).join(', ')}`,
  });

  let mergeCount = 0;

  while (nodes.length > 1) {
    // 按频率升序排序
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift();
    const right = nodes.shift();

    steps.push({
      type: 'select-min',
      nodes: [...nodes, left, right].map((n) => ({ ...n, left: n.left ? { ...n.left } : null, right: n.right ? { ...n.right } : null })),
      selectedLeft: left,
      selectedRight: right,
      description: `选择两个最小频率节点: '${left.char || '*'}'(${left.freq}) 和 '${right.char || '*'}'(${right.freq})`,
    });

    mergeCount++;
    const merged = {
      id: `internal-${mergeCount}`,
      char: null,
      freq: left.freq + right.freq,
      left,
      right,
    };

    steps.push({
      type: 'merge',
      nodes: [...nodes, merged].map((n) => ({ ...n, left: n.left ? { ...n.left } : null, right: n.right ? { ...n.right } : null })),
      mergedNode: merged,
      leftChild: left,
      rightChild: right,
      description: `合并: '${left.char || '*'}'(${left.freq}) + '${right.char || '*'}'(${right.freq}) = ${merged.freq}`,
    });

    nodes.push(merged);

    steps.push({
      type: 'update-forest',
      nodes: nodes.map((n) => ({ ...n, left: n.left ? { ...n.left } : null, right: n.right ? { ...n.right } : null })),
      description: `当前森林: ${nodes.map((n) => `'${n.char || '*'}'(${n.freq})`).join(', ')}（${nodes.length}棵树）`,
    });
  }

  const root = nodes[0];
  const codes = {};
  generateCodes(root, '', codes);

  // 扁平化整棵树，确保所有节点都在步骤数据中
  const allNodes = [];
  const flattenTree = (node) => {
    if (!node) return;
    allNodes.push({ ...node, left: null, right: null }); // 拷贝节点但断开引用避免循环
    flattenTree(node.left);
    flattenTree(node.right);
  };
  flattenTree(root);

  steps.push({
    type: 'complete',
    nodes: allNodes,
    root,
    codes,
    description: `哈夫曼树构建完成！根节点总频率 = ${root.freq}`,
  });

  return steps;
}

/** 从哈夫曼树根节点生成编码表 */
function generateCodes(node, prefix, codes) {
  if (node.char) {
    codes[node.char] = prefix || '0';
    return;
  }
  if (node.left) generateCodes(node.left, prefix + '0', codes);
  if (node.right) generateCodes(node.right, prefix + '1', codes);
}
