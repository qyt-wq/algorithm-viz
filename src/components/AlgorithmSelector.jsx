import { algorithmRegistry } from '../algorithms/registry';

export default function AlgorithmSelector({ selected, onSelect }) {
  return (
    <div className="panel algorithm-selector">
      <h3 className="panel-title">📚 算法选择</h3>
      <div className="algo-list">
        {algorithmRegistry.map((algo) => (
          <button
            key={algo.id}
            className={`algo-card ${selected.id === algo.id ? 'active' : ''}`}
            onClick={() => onSelect(algo)}
          >
            <div className="algo-card-header">
              <span className="algo-name">{algo.name}</span>
              <span className={`difficulty-badge difficulty-${algo.difficulty.includes('高') ? 'high' : algo.difficulty.includes('中') ? 'mid' : 'low'}`}>
                {algo.difficulty}
              </span>
            </div>
            <span className="algo-category">{algo.category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
