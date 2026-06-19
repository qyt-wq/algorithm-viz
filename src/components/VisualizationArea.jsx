import QuickSortViz from './QuickSortViz';
import BubbleSortViz from './BubbleSortViz';
import MergeSortViz from './MergeSortViz';
import DijkstraViz from './DijkstraViz';
import HanoiViz from './HanoiViz';
import HuffmanViz from './HuffmanViz';

export default function VisualizationArea({ algorithm, currentStep, steps, currentStepIndex, graphData }) {
  if (!currentStep || steps.length === 0) {
    return (
      <div className="viz-canvas">
        <div className="viz-placeholder">
          <div className="ph-icon">🧮</div>
          <h2>算法过程可视化</h2>
          <p>选择算法 → 输入数据 → 执行，开始交互式学习</p>
          <div className="ph-features">
            <div className="ph-feat">📊 动态动画</div>
            <div className="ph-feat">📝 伪代码同步</div>
            <div className="ph-feat">📋 步骤追踪</div>
            <div className="ph-feat">📈 复杂度解析</div>
          </div>
        </div>
      </div>
    );
  }

  const renderViz = () => {
    switch (algorithm.id) {
      case 'quicksort':
        return <QuickSortViz step={currentStep} steps={steps} currentIndex={currentStepIndex} />;
      case 'bubblesort':
        return <BubbleSortViz step={currentStep} />;
      case 'mergesort':
        return <MergeSortViz step={currentStep} />;
      case 'dijkstra':
        return <DijkstraViz step={currentStep} graphData={graphData} steps={steps} currentIndex={currentStepIndex} />;
      case 'huffman':
        return <HuffmanViz step={currentStep} steps={steps} currentIndex={currentStepIndex} />;
      case 'hanoi': {
        const nd = steps[0]?.pegs ? Object.values(steps[0].pegs).reduce((s, p) => s + p.length, 0) : 0;
        return <HanoiViz step={currentStep} numDisks={nd} />;
      }
      default:
        return <div style={{ color: '#7880a0' }}>未知算法</div>;
    }
  };

  return (
    <div className="viz-canvas">
      {renderViz()}
    </div>
  );
}
