import { useRef, useEffect, useState, useMemo } from 'react';
import { CODE_LANGUAGES, getCodeState } from '../algorithms/registry';

export default function CodePanel({ algorithm, stepType, hasSteps }) {
  const listRef = useRef(null);
  const [activeLang, setActiveLang] = useState('pseudocode');

  // 根据当前语言和步骤类型计算代码行与高亮
  const { codeLines, highlightIndex } = useMemo(
    () => getCodeState(algorithm, stepType, activeLang),
    [algorithm, stepType, activeLang]
  );

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIndex];
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    }
  }, [highlightIndex]);

  if (!hasSteps) {
    return (
      <aside className="code-panel">
        <div className="code-panel-header">📝 代码参考</div>
        <div className="code-panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#505570', fontSize: '12px' }}>执行算法后显示</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="code-panel">
      <div className="code-panel-header">
        <span>📝 {algorithm.name}</span>
      </div>

      {/* 语言切换标签 */}
      <div className="code-lang-tabs">
        {CODE_LANGUAGES.map((lang) => (
          <button
            key={lang.key}
            className={`code-lang-tab ${activeLang === lang.key ? 'active' : ''}`}
            onClick={() => setActiveLang(lang.key)}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="code-panel-body" ref={listRef}>
        {codeLines.length > 0 ? (
          codeLines.map((line, idx) => (
            <div
              key={idx}
              className={`code-line ${idx === highlightIndex ? 'highlight' : ''}`}
            >
              <span className="code-line-num">{idx + 1}</span>
              <span>{line}</span>
            </div>
          ))
        ) : (
          <div style={{ padding: '16px', color: '#505570', fontSize: 12, textAlign: 'center' }}>
            暂无{CODE_LANGUAGES.find((l) => l.key === activeLang)?.label}代码
          </div>
        )}
      </div>
    </aside>
  );
}
