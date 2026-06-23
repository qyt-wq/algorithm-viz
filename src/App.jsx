import { useState, useCallback, useEffect, useRef } from 'react';
import { algorithmRegistry } from './algorithms/registry';
import { getTestCases } from './data/testCases';
import DataInput from './components/DataInput';
import VisualizationArea from './components/VisualizationArea';
import CodePanel from './components/CodePanel';
import PlaybackControls from './components/PlaybackControls';
import InfoPanel from './components/InfoPanel';
import StepList from './components/StepList';
import StatsPanel from './components/StatsPanel';
import SessionTimer from './components/SessionTimer';
import AuthPage from './components/AuthPage';
import { useSwipeGesture } from './utils/useSwipeGesture';
import './App.css';

export default function App() {
  // ---- 认证状态 ----
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // ---- 移动端菜单状态 ----
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [codePanelOpen, setCodePanelOpen] = useState(false);

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

  // ---- 对比模式状态 ----
  const [compareMode, setCompareMode] = useState(false);
  const [compareAlgo, setCompareAlgo] = useState(null);
  const [rightSteps, setRightSteps] = useState([]);
  const [rightStepIndex, setRightStepIndex] = useState(-1);
  const [rightGraphData, setRightGraphData] = useState(null);
  const [rightIsRunning, setRightIsRunning] = useState(false);

  // ---- 学习统计刷新键 ----
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  // ---- 可对比算法列表（同 inputType）----
  const comparableAlgos = algorithmRegistry.filter(
    (a) => a.inputType === selectedAlgo.inputType && a.id !== selectedAlgo.id
  );

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
          localStorage.removeItem('auth_token');
        }
      } catch {
        // 服务器未启动时不清除 token
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
    setRightIsRunning(false);
    setCurrentStepIndex(-1);
    setRightStepIndex(-1);
    setSteps([]);
    setRightSteps([]);
    setGraphData(null);
    setRightGraphData(null);
    setInputData(null);
    setCompareMode(false);
    setCompareAlgo(null);
  }, []);

  // ---- 算法执行 ----
  const runAlgorithm = useCallback(
    (data) => {
      setInputData(data);
      setIsRunning(false);
      setCurrentStepIndex(-1);
      setRightStepIndex(-1);

      try {
        let result;

        // 主算法
        if (selectedAlgo.id === 'dijkstra') {
          if (typeof data === 'object' && data.graph) {
            result = selectedAlgo.engine(data.startNode, data.graph);
          } else {
            result = selectedAlgo.engine(data);
          }
          setSteps(result.steps);
          setGraphData(result.graph);
        } else {
          result = selectedAlgo.engine(data);
          setSteps(Array.isArray(result) ? result : []);
          setGraphData(null);
        }
        setCurrentStepIndex(0);

        // 记录学习数据（后台静默发送）
        const stepsCount = Array.isArray(result) ? result.length : (result.steps?.length || 0);
        const token = localStorage.getItem('auth_token');
        if (token) {
          fetch('/api/stats/learning', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              algorithmId: selectedAlgo.id,
              algorithmName: selectedAlgo.name,
              stepsCount,
            }),
          }).catch(() => {}); // 静默失败
          setStatsRefreshKey((k) => k + 1);
        }

        // 对比算法
        if (compareMode && compareAlgo) {
          try {
            let rResult;
            if (compareAlgo.id === 'dijkstra') {
              if (typeof data === 'object' && data.graph) {
                rResult = compareAlgo.engine(data.startNode, data.graph);
              } else {
                rResult = compareAlgo.engine(data);
              }
              setRightSteps(rResult.steps);
              setRightGraphData(rResult.graph);
            } else {
              rResult = compareAlgo.engine(data);
              setRightSteps(Array.isArray(rResult) ? rResult : []);
              setRightGraphData(null);
            }
            setRightStepIndex(0);
          } catch {
            setRightSteps([]);
            setRightGraphData(null);
          }
        } else {
          setRightSteps([]);
          setRightGraphData(null);
        }
      } catch (err) {
        console.error('算法执行失败:', err);
        setSteps([]);
        setGraphData(null);
        setRightSteps([]);
        setRightGraphData(null);
        setCurrentStepIndex(-1);
      }
    },
    [selectedAlgo, compareMode, compareAlgo]
  );

  const currentStep = steps[currentStepIndex] || null;
  const rightCurrentStep = rightSteps[rightStepIndex] || null;

  // ---- 同步播放 ----
  const onPlaybackTick = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        setIsRunning(false);
        return prev;
      }
      return prev + 1;
    });
    if (compareMode && rightSteps.length > 0) {
      setRightStepIndex((prev) => {
        if (prev >= rightSteps.length - 1) return prev;
        return prev + 1;
      });
    }
  }, [steps.length, rightSteps.length, compareMode]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    if (compareMode && rightSteps.length > 0) {
      setRightStepIndex((prev) => Math.min(prev + 1, rightSteps.length - 1));
    }
  }, [steps.length, rightSteps.length, compareMode]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
    if (compareMode && rightSteps.length > 0) {
      setRightStepIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [compareMode, rightSteps.length]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRightIsRunning(false);
    setCurrentStepIndex(-1);
    setRightStepIndex(-1);
    setSteps([]);
    setRightSteps([]);
    setGraphData(null);
    setRightGraphData(null);
    setInputData(null);
  }, []);

  const goToStep = useCallback(
    (idx) => {
      setIsRunning(false);
      setCurrentStepIndex(idx);
      if (compareMode && rightSteps.length > 0) {
        setRightStepIndex(Math.min(idx, rightSteps.length - 1));
      }
    },
    [compareMode, rightSteps.length]
  );

  const handleSeek = useCallback(
    (stepIndex) => {
      setIsRunning(false);
      setCurrentStepIndex(stepIndex);
      if (compareMode && rightSteps.length > 0) {
        setRightStepIndex(Math.min(stepIndex, rightSteps.length - 1));
      }
    },
    [compareMode, rightSteps.length]
  );

  // 重新播放：从第一步开始自动播放
  const handleReplay = useCallback(() => {
    setCurrentStepIndex(0);
    setIsRunning(true);
    if (compareMode && rightSteps.length > 0) {
      setRightStepIndex(0);
      setRightIsRunning(true);
    }
  }, [compareMode, rightSteps.length]);

  // ---- 右侧独立导航回调（对比模式）----
  const rightPlaybackTick = useCallback(() => {
    setRightStepIndex((prev) => {
      if (prev >= rightSteps.length - 1) {
        setRightIsRunning(false);
        return prev;
      }
      return prev + 1;
    });
  }, [rightSteps.length]);

  const rightStepForward = useCallback(() => {
    setRightStepIndex((prev) => Math.min(prev + 1, rightSteps.length - 1));
  }, [rightSteps.length]);

  const rightStepBackward = useCallback(() => {
    setRightStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const rightGoToStep = useCallback((idx) => {
    setRightIsRunning(false);
    setRightStepIndex(idx);
  }, []);

  const rightHandleSeek = useCallback((stepIndex) => {
    setRightIsRunning(false);
    setRightStepIndex(stepIndex);
  }, []);

  const rightReset = useCallback(() => {
    setRightIsRunning(false);
    setRightStepIndex(-1);
  }, []);

  const handleAlgoChange = useCallback(
    (algo) => {
      setSelectedAlgo(algo);
      setCompareMode(false);
      setCompareAlgo(null);
      reset();
    },
    [reset]
  );

  // ---- 对比模式切换 ----
  const handleCompareToggle = useCallback(
    (algo) => {
      if (algo) {
        setCompareMode(true);
        setCompareAlgo(algo);
        reset();
      } else {
        setCompareMode(false);
        setCompareAlgo(null);
        setRightSteps([]);
        setRightGraphData(null);
      }
    },
    [reset]
  );

  // ---- 滑动手势 ----
  const vizRef = useRef(null);
  useSwipeGesture(vizRef, stepForward, stepBackward);

  // ---- 键盘快捷键 ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || e.target.isContentEditable) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (steps.length > 0) setIsRunning((prev) => !prev);
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepBackward();
          break;
        case 'r':
        case 'R':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            reset();
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length, stepForward, stepBackward, reset]);

  // ---- 对比模式下选择触发重置 ----
  useEffect(() => {
    if (compareMode && !compareAlgo && comparableAlgos.length > 0) {
      setCompareAlgo(comparableAlgos[0]);
    }
  }, [compareMode, compareAlgo, comparableAlgos]);

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
        <button
          className="hamburger-btn"
          onClick={() => { setSidebarOpen(!sidebarOpen); setCodePanelOpen(false); }}
          aria-label="切换菜单"
        >
          <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`} />
        </button>

        <div className="app-brand">
          <span className="app-logo">🧮</span>
          <span className="app-title">算法过程可视化系统</span>
        </div>

        {/* 桌面端算法选择器 */}
        <div className="top-algo-selector desktop-only">
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

        <div className="app-user-area">
          {/* 桌面端主题切换 */}
          <div className="theme-picker desktop-only" title="切换画布背景">
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
          <SessionTimer />
          <span className="user-greeting">👤 <span className="user-greeting-name">{currentUser}</span></span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>退出登录</button>
        </div>
      </header>

      {/* 主体 */}
      <div className="app-body">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        {/* 左侧面板 */}
        <aside className={`side-panel ${sidebarOpen ? 'side-panel-open' : ''}`}>
          {/* 移动端：算法选择面板 */}
          <div className="panel mobile-only">
            <h3 className="panel-title">📚 算法选择</h3>
            <div className="mobile-algo-list">
              {algorithmRegistry.map((algo) => (
                <button
                  key={algo.id}
                  className={`algo-select-btn ${selectedAlgo.id === algo.id ? 'active' : ''}`}
                  onClick={() => { handleAlgoChange(algo); }}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          {/* 移动端：背景切换面板 */}
          <div className="panel mobile-only">
            <h3 className="panel-title">🎨 背景切换</h3>
            <div className="mobile-theme-list">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  className={`mobile-theme-btn ${canvasTheme === t.key ? 'active' : ''}`}
                  onClick={() => handleThemeChange(t.key)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <DataInput
            algorithm={selectedAlgo}
            onRun={(data) => { runAlgorithm(data); setSidebarOpen(false); }}
            disabled={isRunning}
            testCases={getTestCases(selectedAlgo.id)}
          />

          {/* 对比模式切换 */}
          <div className="panel compare-toggle-panel">
            <label className="compare-toggle-label">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => handleCompareToggle(e.target.checked ? comparableAlgos[0] : null)}
                disabled={comparableAlgos.length === 0 || isRunning}
              />
              <span>对比模式</span>
            </label>
            {compareMode && comparableAlgos.length > 0 && (
              <select
                className="compare-algo-select"
                value={compareAlgo?.id || ''}
                onChange={(e) => {
                  const algo = algorithmRegistry.find((a) => a.id === e.target.value);
                  if (algo) handleCompareToggle(algo);
                }}
                disabled={isRunning}
              >
                {comparableAlgos.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}
            {compareMode && comparableAlgos.length === 0 && (
              <p className="compare-no-match">当前无同类型算法可对比</p>
            )}
          </div>

          <InfoPanel algorithm={selectedAlgo} currentStep={currentStep} inputData={inputData} />

          <StatsPanel refreshKey={statsRefreshKey} />

          {/* 步骤列表 — 桌面端可见 */}
          {steps.length > 0 && (
            <div className="desktop-only">
              <StepList steps={steps} currentStepIndex={currentStepIndex} onGoToStep={goToStep} />
            </div>
          )}
        </aside>

        {/* 中间 — 动画区域 */}
        <main className="main-area" ref={vizRef}>
          {/* 非对比模式：显示全局播放控制 */}
          {!(compareMode && rightSteps.length > 0) && (
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
              onSeek={handleSeek}
              onReplay={handleReplay}
              onTick={onPlaybackTick}
              tickInterval={speedMap[speed]}
            />
          )}

          {/* 对比模式 — 并排可视化，各有独立控制 */}
          {compareMode && rightSteps.length > 0 ? (
            <div className="compare-area">
              <div className="compare-panel compare-left">
                <div className="compare-panel-label">{selectedAlgo.name}</div>
                <PlaybackControls
                  compact
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
                  onSeek={handleSeek}
                  onTick={onPlaybackTick}
                  tickInterval={speedMap[speed]}
                />
                <VisualizationArea
                  algorithm={selectedAlgo}
                  currentStep={currentStep}
                  steps={steps}
                  currentStepIndex={currentStepIndex}
                  graphData={graphData}
                />
                {currentStep && (
                  <div className="step-info-bar step-info-compact" key={currentStepIndex}>
                    <span className={`step-info-badge ${currentStep.type === 'complete' ? 'complete' : ''}`}>
                      {currentStep.type}
                    </span>
                    <span className="step-info-text">{currentStep.description}</span>
                  </div>
                )}
              </div>
              <div className="compare-divider" />
              <div className="compare-panel compare-right">
                <div className="compare-panel-label">{compareAlgo?.name}</div>
                <PlaybackControls
                  compact
                  isRunning={rightIsRunning}
                  hasSteps={rightSteps.length > 0}
                  currentStep={rightStepIndex}
                  totalSteps={rightSteps.length}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  onPlay={() => setRightIsRunning(!rightIsRunning)}
                  onStepForward={rightStepForward}
                  onStepBackward={rightStepBackward}
                  onReset={rightReset}
                  onSeek={rightHandleSeek}
                  onTick={rightPlaybackTick}
                  tickInterval={speedMap[speed]}
                />
                <VisualizationArea
                  algorithm={compareAlgo}
                  currentStep={rightCurrentStep}
                  steps={rightSteps}
                  currentStepIndex={rightStepIndex}
                  graphData={rightGraphData}
                />
                {rightCurrentStep && (
                  <div className="step-info-bar step-info-compact" key={rightStepIndex}>
                    <span className={`step-info-badge ${rightCurrentStep.type === 'complete' ? 'complete' : ''}`}>
                      {rightCurrentStep.type}
                    </span>
                    <span className="step-info-text">{rightCurrentStep.description}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <VisualizationArea
                algorithm={selectedAlgo}
                currentStep={currentStep}
                steps={steps}
                currentStepIndex={currentStepIndex}
                graphData={graphData}
              />
              {/* 步骤描述条 */}
              {currentStep && (
                <div className="step-info-bar" key={currentStepIndex}>
                  <span className={`step-info-badge ${currentStep.type === 'complete' ? 'complete' : ''}`}>
                    {currentStep.type}
                  </span>
                  <span className="step-info-text">{currentStep.description}</span>
                </div>
              )}
            </>
          )}

          {/* 移动端 — 查看代码按钮（代码面板打开后使用面板内的返回按钮关闭） */}
          {steps.length > 0 && !codePanelOpen && (
            <button
              className="mobile-code-toggle"
              onClick={() => { setCodePanelOpen(true); setSidebarOpen(false); }}
            >
              📝 查看代码
            </button>
          )}
        </main>

        {/* 右侧 — 代码面板 */}
        <div className={`code-panel-wrapper ${codePanelOpen ? 'code-panel-open' : ''}`}>
          {codePanelOpen && <div className="code-panel-overlay" onClick={() => setCodePanelOpen(false)} />}
          <CodePanel
            algorithm={selectedAlgo}
            stepType={currentStep?.type}
            hasSteps={steps.length > 0}
            onMobileClose={() => setCodePanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
