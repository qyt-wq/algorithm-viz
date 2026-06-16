import { useState, useCallback } from 'react';
import { algorithmRegistry } from './algorithms/registry';
import { getTestCases } from './data/testCases';
import DataInput from './components/DataInput';
import VisualizationArea from './components/VisualizationArea';
import CodePanel from './components/CodePanel';
import PlaybackControls from './components/PlaybackControls';
import InfoPanel from './components/InfoPanel';

export default function App() {
  const [selectedAlgo, setSelectedAlgo] = useState(algorithmRegistry[0]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [graphData, setGraphData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const speedMap = { 1: 1200, 2: 600, 3: 200 };
  const [inputData, setInputData] = useState(null);

  const runAlgorithm = useCallback(
    (data) => {
      setInputData(data);
      setIsRunning(false);
      setCurrentStepIndex(-1);
      let result;
      if (selectedAlgo.id === 'dijkstra') {
        result = selectedAlgo.engine(data);
        setSteps(result.steps);
        setGraphData(result.graph);
      } else {
        result = selectedAlgo.engine(data);
        setSteps(result);
        setGraphData(null);
      }
      setCurrentStepIndex(0);
    },
    [selectedAlgo]
  );

  const currentStep = steps[currentStepIndex] || null;

  // 播放回调
  const onPlaybackTick = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        setIsRunning(false);
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setSteps([]);
    setGraphData(null);
    setInputData(null);
  }, []);

  const handleAlgoChange = useCallback((algo) => {
    setSelectedAlgo(algo);
    reset();
  }, [reset]);

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">🧮</span>
          <span className="app-title">算法过程可视化系统</span>
        </div>

        <div className="top-algo-selector">
          {algorithmRegistry.map((algo) => (
            <button
              key={algo.id}
              className={`algo-select-btn ${selectedAlgo.id === algo.id ? 'active' : ''}`}
              onClick={() => handleAlgoChange(algo)}
            >
              {algo.name}
              <span className="algo-difficulty">({algo.difficulty})</span>
            </button>
          ))}
        </div>
      </header>

      {/* 主体 */}
      <div className="app-body">
        {/* 左侧面板 */}
        <aside className="side-panel">
          <DataInput
            algorithm={selectedAlgo}
            onRun={runAlgorithm}
            disabled={isRunning}
            testCases={getTestCases(selectedAlgo.id)}
          />
          <InfoPanel algorithm={selectedAlgo} currentStep={currentStep} inputData={inputData} />
        </aside>

        {/* 中间 — 动画区域 */}
        <main className="main-area">
          {/* 控制栏 */}
          <PlaybackControls
            isRunning={isRunning}
            hasSteps={steps.length > 0}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            speed={speed}
            onSpeedChange={setSpeed}
            onPlay={() => setIsRunning(!isRunning)}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onReset={reset}
            onTick={onPlaybackTick}
            tickInterval={speedMap[speed]}
          />

          {/* 动画 */}
          <VisualizationArea
            algorithm={selectedAlgo}
            currentStep={currentStep}
            steps={steps}
            currentStepIndex={currentStepIndex}
            graphData={graphData}
          />

          {/* 步骤描述条 */}
          {currentStep && (
            <div className="step-info-bar">
              <span className={`step-info-badge ${currentStep.type === 'complete' ? 'complete' : ''}`}>
                {currentStep.type}
              </span>
              <span className="step-info-text">{currentStep.description}</span>
            </div>
          )}
        </main>

        {/* 右侧 — 代码面板（多语言 + 步骤追踪） */}
        <CodePanel
          algorithm={selectedAlgo}
          stepType={currentStep?.type}
          hasSteps={steps.length > 0}
        />
      </div>
    </div>
  );
}
