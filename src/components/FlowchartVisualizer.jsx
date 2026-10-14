import React, { useMemo } from 'react';
import { GitFork, X, Download, HelpCircle } from 'lucide-react';

/**
 * Parse python code into sequential flowchart nodes
 */
function parseCodeToFlowchartNodes(code) {
  if (!code || typeof code !== 'string') return [];

  const lines = code.split('\n');
  const nodes = [
    {
      id: 'start',
      type: 'terminal',
      label: 'ప్రారంభం (Start)',
      subtext: 'Python Program',
    },
  ];

  let idCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    // 1. Conditionals (Decision Diamond)
    if (/^if\s+(.*):/.test(trimmed)) {
      const cond = trimmed.match(/^if\s+(.*):/)[1];
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'decision',
        label: `ఒకవేళ (${cond})?`,
        subtext: 'షరతు తనిఖీ (Condition Decision)',
        yesLabel: 'నిజం (True)',
        noLabel: 'తప్పు (False)',
      });
      continue;
    }

    // 2. Loops (Loop Node)
    if (/^for\s+(.*):/.test(trimmed)) {
      const loopText = trimmed.match(/^for\s+(.*):/)[1];
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'loop',
        label: `ప్రతి (${loopText}) కోసం`,
        subtext: 'లూప్ పునరావృతం (Loop Iteration)',
      });
      continue;
    }

    if (/^while\s+(.*):/.test(trimmed)) {
      const cond = trimmed.match(/^while\s+(.*):/)[1];
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'loop',
        label: `(${cond}) ఉన్నంతవరకు లూప్`,
        subtext: 'షరతు లూప్ (While Loop)',
      });
      continue;
    }

    // 3. I/O Print or Input (Parallelogram)
    if (/^print\s*\(/.test(trimmed)) {
      const arg = trimmed.match(/^print\s*\((.*)\)/)?.[1] || '';
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'io',
        label: `చూపించు: ${arg.slice(0, 25)}${arg.length > 25 ? '...' : ''}`,
        subtext: 'అవుట్‌పుట్ (Display Output)',
      });
      continue;
    }

    if (/input\s*\(/.test(trimmed)) {
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'io',
        label: `ఇన్‌పుట్ స్వీకరించు: ${trimmed.slice(0, 25)}`,
        subtext: 'యూజర్ ఇన్‌పుట్ (Read Input)',
      });
      continue;
    }

    // 4. Assignments / Calculations (Rectangle Process)
    if (/=/.test(trimmed)) {
      nodes.push({
        id: `node_${idCounter++}`,
        type: 'process',
        label: trimmed.slice(0, 30),
        subtext: 'ప్రక్రియ / లెక్కించడం (Assignment)',
      });
      continue;
    }

    // Default process
    nodes.push({
      id: `node_${idCounter++}`,
      type: 'process',
      label: trimmed.slice(0, 30),
      subtext: 'స్టేట్‌మెంట్ (Statement)',
    });
  }

  nodes.push({
    id: 'end',
    type: 'terminal',
    label: 'ముగింపు (End / Stop)',
    subtext: 'Program Terminated',
  });

  return nodes;
}

export function FlowchartVisualizer({ code, onClose }) {
  const nodes = useMemo(() => parseCodeToFlowchartNodes(code), [code]);

  return (
    <div className="w-full rounded-panel border border-[#30363D] bg-[#0D1117] overflow-hidden shadow-xl mb-4 animate-in fade-in duration-200">
      {/* Title bar */}
      <div className="px-4 py-2.5 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GitFork className="w-4 h-4 text-[#58A6FF]" />
          <span className="font-semibold text-xs text-[#E6EDF3]">
            కోడ్ ఫ్లోచార్ట్ (Code to Flowchart Visualizer — Feature F13)
          </span>
          <span className="text-[10px] text-[#8B949E] bg-[#21262D] px-2 py-0.5 rounded">
            తెలుగు గుర్తులు (Exam Ready)
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
            title="Close Flowchart"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Diagram Canvas */}
      <div className="p-6 overflow-x-auto min-h-[300px] flex flex-col items-center select-none bg-[#0D1117]/95">
        <div className="flex flex-col items-center space-y-4 max-w-md w-full">
          {nodes.map((node, index) => {
            const isLast = index === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Shape */}
                <div className="w-full flex justify-center">
                  {node.type === 'terminal' && (
                    <div className="px-6 py-2.5 rounded-full bg-[#238636]/20 border-2 border-[#3FB950] text-[#3FB950] font-semibold text-xs text-center shadow-md w-52">
                      <div>{node.label}</div>
                      <div className="text-[10px] text-[#8B949E] font-normal">{node.subtext}</div>
                    </div>
                  )}

                  {node.type === 'decision' && (
                    <div className="relative p-4 rounded-xl bg-[#D29922]/15 border-2 border-[#D29922] text-[#F0883E] font-medium text-xs text-center shadow-md w-64 transform rotate-0">
                      <div className="font-bold text-[#E6EDF3] mb-0.5">{node.label}</div>
                      <div className="text-[10px] text-[#D29922]">{node.subtext}</div>
                      {/* Decision branches badges */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#D29922]/30 text-[10px] font-mono">
                        <span className="text-[#3FB950] bg-[#238636]/20 px-1.5 py-0.2 rounded">
                          ✓ {node.yesLabel}
                        </span>
                        <span className="text-[#F85149] bg-[#DA3633]/20 px-1.5 py-0.2 rounded">
                          ✗ {node.noLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {node.type === 'loop' && (
                    <div className="p-3.5 rounded-lg bg-[#A371F7]/15 border-2 border-[#A371F7] text-[#D2A8FF] font-medium text-xs text-center shadow-md w-60">
                      <div className="font-bold text-[#E6EDF3] mb-0.5">{node.label}</div>
                      <div className="text-[10px] text-[#A371F7]">{node.subtext}</div>
                    </div>
                  )}

                  {node.type === 'io' && (
                    <div className="p-3 rounded-md bg-[#1F6FEB]/15 border-2 border-[#58A6FF] text-[#79C0FF] font-mono text-xs text-center shadow-md w-64 transform -skew-x-6">
                      <div className="transform skew-x-6 font-semibold text-[#E6EDF3]">
                        {node.label}
                      </div>
                      <div className="transform skew-x-6 text-[10px] text-[#8B949E]">
                        {node.subtext}
                      </div>
                    </div>
                  )}

                  {node.type === 'process' && (
                    <div className="p-3 rounded-md bg-[#161B22] border-2 border-[#30363D] text-[#E6EDF3] font-mono text-xs text-center shadow-sm w-60">
                      <div className="font-semibold text-[#58A6FF] truncate">{node.label}</div>
                      <div className="text-[10px] text-[#8B949E]">{node.subtext}</div>
                    </div>
                  )}
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-[#30363D]" />
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#58A6FF]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-[#161B22] border-t border-[#30363D] flex items-center justify-between text-xs text-[#8B949E]">
        <span>కాలేజీ పరీక్షల ఫ్లోచార్ట్ సమాధానాల కొరకు సింబల్స్ మరియు తెలుగు లేబుల్స్.</span>
        <span className="font-mono text-[#58A6FF]">{nodes.length} దశలు (Steps)</span>
      </div>
    </div>
  );
}

export default FlowchartVisualizer;
