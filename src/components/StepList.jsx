import { useRef, useEffect } from 'react';

export default function StepList({ steps, currentStepIndex, onGoToStep }) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
    }
  }, [currentStepIndex]);

  if (steps.length === 0) {
    return (
      <div className="panel step-list">
        <h3 className="panel-title">📋 执行步骤</h3>
        <p className="empty-hint">执行算法后将在此显示详细步骤</p>
      </div>
    );
  }

  // 只显示移动类型的步骤（过滤掉过于详细的中间步骤）
  const displaySteps = steps; // 保留所有步骤

  const getTypeLabel = (type) => {
    const map = {
      init: '初始',
      'pivot-select': '选基准',
      compare: '比较',
      swap: '交换',
      'move-pointer': '移动指针',
      'pivot-place': '基准归位',
      'pivot-sorted': '已归位',
      'partition-done': '分区完成',
      'auto-sorted': '自动归位',
      'select-node': '选节点',
      'relax-check': '松弛检查',
      'relax-update': '更新距离',
      'relax-skip': '跳过',
      'base-case': '递归基',
      move: '移动',
      'move-largest': '移最大盘',
      'recurse-info': '递归信息',
      complete: '完成',
    };
    return map[type] || type;
  };

  const getTypeClass = (type) => {
    if (type === 'complete') return 'step-type-complete';
    if (type?.includes('swap') || type === 'move') return 'step-type-action';
    if (type?.includes('compare') || type?.includes('check')) return 'step-type-compare';
    if (type === 'init') return 'step-type-init';
    return 'step-type-info';
  };

  return (
    <div className="panel step-list">
      <h3 className="panel-title">📋 执行步骤 ({steps.length})</h3>
      <div className="step-items">
        {displaySteps.map((s, idx) => (
          <div
            key={idx}
            ref={idx === currentStepIndex ? activeRef : null}
            className={`step-item ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'passed' : ''}`}
            onClick={() => onGoToStep(idx)}
          >
            <div className="step-item-header">
              <span className={`step-type-badge ${getTypeClass(s.type)}`}>
                {getTypeLabel(s.type)}
              </span>
              <span className="step-number">{idx + 1}</span>
            </div>
            <p className="step-item-desc">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
