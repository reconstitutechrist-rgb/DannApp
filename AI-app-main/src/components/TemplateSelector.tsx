"use client";

import React, { useState } from 'react';
import {
  getAllTemplates,
  getTemplatesByCategory,
  detectComplexity,
  type ArchitectureTemplate
} from '../utils/architectureTemplates';

interface TemplateSelectorProps {
  userRequest?: string;
  onSelectTemplate: (template: ArchitectureTemplate | null) => void;
  onClose: () => void;
}

export default function TemplateSelector({ userRequest, onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ArchitectureTemplate | null>(null);

  const allTemplates = getAllTemplates();
  const categories = [
    { id: 'all', name: 'All Templates', icon: '📦' },
    { id: 'saas', name: 'SaaS', icon: '💼' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'content', name: 'Content', icon: '📝' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'business', name: 'Business', icon: '🏢' }
  ];

  // Get suggested templates if user request provided
  const suggestions = userRequest ? detectComplexity(userRequest) : null;

  const displayedTemplates = selectedCategory === 'all'
    ? allTemplates
    : getTemplatesByCategory(selectedCategory);

  const handleSelectTemplate = (template: ArchitectureTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = () => {
    onSelectTemplate(selectedTemplate);
    onClose();
  };

  const handleSkip = () => {
    onSelectTemplate(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-6xl max-h-[90vh] overflow-hidden bg-slate-900 rounded-2xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                🏗️ Choose Architecture Template
              </h2>
              <p className="text-slate-400 text-sm">
                Select a template for proper multi-file structure, or skip to let AI decide
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* AI Suggestions */}
          {suggestions && suggestions.suggestedTemplates.length > 0 && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <h3 className="text-blue-200 font-semibold mb-1">
                    AI Suggestions for your request
                  </h3>
                  <p className="text-blue-200/70 text-sm mb-2">
                    Detected complexity: <span className="font-semibold">{suggestions.complexity}</span>
                    {' '}(Confidence: {suggestions.confidence})
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {suggestions.suggestedTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                      >
                        {template.name} ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                isSuggested={suggestions?.suggestedTemplates.some(t => t.id === template.id)}
                onClick={() => handleSelectTemplate(template)}
              />
            ))}
          </div>

          {displayedTemplates.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No templates in this category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-white/10 p-6 flex items-center justify-between">
          <div className="flex-1">
            {selectedTemplate ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedTemplate.name}</p>
                  <p className="text-slate-400 text-sm">{selectedTemplate.estimatedFiles} files • {selectedTemplate.complexity}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">
                💡 Select a template for structured multi-file generation
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all"
            >
              Skip & Let AI Decide
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedTemplate}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Use {selectedTemplate ? selectedTemplate.name : 'Template'} →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Template Card Component
function TemplateCard({
  template,
  isSelected,
  isSuggested,
  onClick
}: {
  template: ArchitectureTemplate;
  isSelected: boolean;
  isSuggested?: boolean;
  onClick: () => void;
}) {
  const complexityColors = {
    MEDIUM: 'bg-yellow-500/20 text-yellow-300',
    COMPLEX: 'bg-orange-500/20 text-orange-300',
    VERY_COMPLEX: 'bg-red-500/20 text-red-300'
  };

  const categoryIcons = {
    saas: '💼',
    ecommerce: '🛒',
    content: '📝',
    social: '👥',
    business: '🏢',
    general: '📦'
  };

  return (
    <button
      onClick={onClick}
      className={`relative p-5 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
      )}

      {/* Suggested badge */}
      {isSuggested && !isSelected && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded">
          ⭐ AI Pick
        </div>
      )}

      {/* Icon */}
      <div className="text-3xl mb-3">
        {categoryIcons[template.category]}
      </div>

      {/* Name */}
      <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
        {template.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded ${complexityColors[template.complexity]}`}>
          {template.complexity}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-white/10 text-slate-300">
          {template.estimatedFiles} files
        </span>
        {template.phases && (
          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
            {template.phases.length} phases
          </span>
        )}
      </div>

      {/* Features preview */}
      <div className="pt-3 border-t border-white/10">
        <p className="text-xs text-slate-500 mb-1">Key Features:</p>
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="text-xs text-slate-400"
            >
              {idx > 0 && '• '}{feature}
            </span>
          ))}
          {template.features.length > 3 && (
            <span className="text-xs text-slate-500">
              +{template.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
