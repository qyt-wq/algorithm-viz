import { useState, useCallback, useEffect } from 'react';
import { algorithmRegistry } from './algorithms/registry';
import { getTestCases } from './data/testCases';
import DataInput from './components/DataInput';
import VisualizationArea from './components/VisualizationArea';
import CodePanel from './components/CodePanel';
import PlaybackControls from './components/PlaybackControls';
import InfoPanel from './components/InfoPanel';
import AuthPage from './components/AuthPage';
import './App.css';

export default function App() {
  // ---- 认证状态 ----
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // ---- 画布主题 ----
  const THEMES = [
    { key: 'dark', label: '暗色', icon: '🌙' },
    { key: 'light', label: '明亮', icon: '☀️' },
    { key: 'ocean', label: '深蓝', icon: '🌊' },
    { key: 'forest', label: '护眼', icon: '🌿' },
    { key: 'sunset', label: '暖橙', icon: '🌅' },
    { key: 'pixel', label: '像素', icon: '🕹️' },
  ];
  const [canvasTheme, setCanvasTheme] = useState(() => {
    return localStorage.getItem('canvas_theme') || 'dark';
  });
  const handleThemeChange = (theme) => {
    setCanvasTheme(theme);
    localStorage.setItem('canvas_theme', theme);
  };

  // ---- 算法状态 ----
  const [selectedAlgo, setSelectedAlgo] = useState(algorithmRegistry[0]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [graphData, setGraphData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2);
  const speedMap = { 1: 1200, 2: 600, 3: 200 };
  const [inputData, setInputData] = useState(null);

  // ---- 启动时验证 JWT 令牌 ----
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setAuthChecking(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.username);
        } else {
          // 令牌过期或无效，清理
          localStorage.removeItem('auth_token');
        }
      } catch {
        // 服务器未启动时不清除 token，下次可能启动
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // ---- 登录 / 登出 ----
  const handleLogin = useCallback((username) => {
    setCurrentUser(username);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setCurrentUser(null);
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setSteps([]);
    setGraphData(null);
    setInputData(null);
  }, []);

  // ---- 算法执行 ----
  const runAlgorithm = useCallback(
    (data) => {
      setInputData(data);
      setIsRunning(false);
      setCurrentStepIndex(-1);
      let result;
      if (selectedAlgo.id === 'dijkstra') {
        // 支持两种调用方式：
        // 1. 字符串 — 内置图 + 起始节点（如 "A"）
        // 2. 对象 — 自定义图 { startNode: "A", graph: { nodes, edges } }
        if (typeof data === 'object' && data.graph) {
          result = selectedAlgo.engine(data.startNode, data.graph);
        } else {
          result = selectedAlgo.engine(data);
        }
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

  const handleAlgoChange = useCallback(
    (algo) => {
      setSelectedAlgo(algo);
      reset();
    },
    [reset]
  );

  // ---- 加载中 ----
  if (authChecking) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>正在加载...</p>
      </div>
    );
  }

  // ---- 未登录 → 显示认证页面 ----
  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // ---- 已登录 → 主应用 ----
  return (
    <div className="app" data-theme={canvasTheme}>
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

        {/* 主题切换 + 用户信息 + 登出 */}
        <div className="app-user-area">
          <div className="theme-picker" title="切换画布背景">
            {THEMES.map((t) => (
              <button
                key={t.key}
                className={`theme-dot ${canvasTheme === t.key ? 'active' : ''}`}
                onClick={() => handleThemeChange(t.key)}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>
          <span className="user-greeting">👤 {currentUser}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            退出登录
          </button>
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

        {/* 右侧 — 代码面板 */}
        <CodePanel
          algorithm={selectedAlgo}
          stepType={currentStep?.type}
          hasSteps={steps.length > 0}
        />
      </div>
    </div>
  );
}
