import React, { useState } from 'react';
import { Network, ChevronRight, ChevronDown, ZoomIn, ZoomOut, RotateCcw, ListTree, Layout } from 'lucide-react';
import { MindMapNode } from '../types';

interface MindMapCanvasProps {
  rootNode: MindMapNode;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({ rootNode }) => {
  const [viewMode, setViewMode] = useState<'visual' | 'outline'>('visual');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleCollapse = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setCollapsedIds(new Set());

  // Render tree node recursively for Visual View
  const renderVisualNode = (node: MindMapNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isCollapsed = collapsedIds.has(node.id);

    return (
      <div key={node.id} className="flex flex-col items-start space-y-3">
        {/* Node Box */}
        <div
          onClick={() => hasChildren && toggleCollapse(node.id)}
          className={`group flex items-start gap-2 p-3 rounded-xl border transition-all cursor-pointer select-none shadow-xs ${
            depth === 0
              ? 'bg-[#12141D] text-white border-stone-800'
              : depth === 1
              ? 'bg-indigo-50/80 text-indigo-950 border-indigo-200 hover:border-indigo-300'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          {hasChildren && (
            <button
              type="button"
              className="mt-0.5 p-0.5 rounded text-stone-400 group-hover:text-stone-700"
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <div>
            <span
              className={`font-semibold text-xs block leading-tight ${
                depth === 0 ? 'text-white text-sm' : ''
              }`}
            >
              {node.label}
            </span>
            {node.description && (
              <span
                className={`text-[11px] block mt-0.5 leading-snug ${
                  depth === 0 ? 'text-stone-300' : 'text-stone-500'
                }`}
              >
                {node.description}
              </span>
            )}
          </div>
        </div>

        {/* Children Branches */}
        {hasChildren && !isCollapsed && (
          <div className="pl-6 border-l-2 border-indigo-200/80 ml-4 space-y-3 pt-1">
            {node.children!.map((child) => renderVisualNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Render tree node recursively for Accessible Text Outline
  const renderOutlineNode = (node: MindMapNode, depth = 0) => {
    return (
      <li key={node.id} className="space-y-1">
        <div className="text-xs">
          <strong className="text-stone-900">{node.label}</strong>
          {node.description && (
            <span className="text-stone-500 text-[11px] ml-1.5">— {node.description}</span>
          )}
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="pl-5 list-disc space-y-1 border-l border-stone-200 ml-2 mt-1">
            {node.children.map((child) => renderOutlineNode(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  if (!rootNode) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-xs text-stone-500">
        No mind map hierarchy available for this lecture.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('visual')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'visual' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Visual Concept Map</span>
          </button>
          <button
            onClick={() => setViewMode('outline')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'outline' ? 'bg-[#12141D] text-white' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Accessible Outline View</span>
          </button>
        </div>

        {viewMode === 'visual' && (
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              className="p-1.5 rounded border border-stone-200 hover:bg-stone-50 text-stone-600"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1 text-stone-500">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 rounded border border-stone-200 hover:bg-stone-50 text-stone-600"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={expandAll}
              className="px-2 py-1 text-[11px] rounded border border-stone-200 hover:bg-stone-50 text-stone-600 ml-1"
            >
              Expand All
            </button>
          </div>
        )}
      </div>

      {/* Map Stage Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200 min-h-[400px] overflow-x-auto shadow-xs">
        {viewMode === 'visual' ? (
          <div
            className="transition-transform origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {renderVisualNode(rootNode)}
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            <h4 className="text-sm font-bold text-stone-900">
              Hierarchical Syllabus Outline (Screen Reader Accessible)
            </h4>
            <ul className="space-y-2 list-none">
              {renderOutlineNode(rootNode)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
