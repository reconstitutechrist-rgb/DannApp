"use client";

import { useState } from 'react';
import type { AppConcept, Feature, UIPreferences, TechnicalRequirements } from '../types/appConcept';

interface AppConceptWizardProps {
  onComplete: (concept: AppConcept) => void;
  onCancel: () => void;
}

export default function AppConceptWizard({ onComplete, onCancel }: AppConceptWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [targetUsers, setTargetUsers] = useState('');

  const [features, setFeatures] = useState<Feature[]>([]);
  const [featureName, setFeatureName] = useState('');
  const [featureDesc, setFeatureDesc] = useState('');
  const [featurePriority, setFeaturePriority] = useState<'high' | 'medium' | 'low'>('high');

  const [uiPreferences, setUIPreferences] = useState<UIPreferences>({
    style: 'modern',
    colorScheme: 'auto',
    layout: 'single-page',
  });

  const [technical, setTechnical] = useState<TechnicalRequirements>({
    needsAuth: false,
    needsDatabase: false,
    needsAPI: false,
    needsFileUpload: false,
    needsRealtime: false,
  });

  const addFeature = () => {
    if (!featureName.trim()) return;

    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: featureName,
      description: featureDesc,
      priority: featurePriority,
    };

    setFeatures([...features, newFeature]);
    setFeatureName('');
    setFeatureDesc('');
    setFeaturePriority('high');
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleComplete = () => {
    const concept: AppConcept = {
      name,
      description,
      purpose,
      targetUsers,
      coreFeatures: features,
      uiPreferences,
      technical,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onComplete(concept);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim() && description.trim() && purpose.trim();
      case 2:
        return features.length > 0;
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full my-8">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span>App Concept Wizard</span>
            </h2>
            <button
              onClick={onCancel}
              className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
            >
              ✕
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    i + 1 <= currentStep
                      ? 'bg-blue-500'
                      : 'bg-white/10'
                  }`}
                />
                <div className="text-xs text-slate-400 mt-1 text-center">
                  {['Basic', 'Features', 'Design', 'Technical', 'Review'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 min-h-[400px]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Let's start with the basics about your app
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., TaskMaster Pro"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A brief description of what your app does..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Purpose *
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What problem does this app solve? What value does it provide?"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Users (optional)
                </label>
                <input
                  type="text"
                  value={targetUsers}
                  onChange={(e) => setTargetUsers(e.target.value)}
                  placeholder="e.g., Freelancers, students, small business owners"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 2: Features */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Core Features</h3>
                <p className="text-slate-400 text-sm mb-6">
                  What are the main features your app needs? Add at least one.
                </p>
              </div>

              {/* Add Feature Form */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={featureName}
                    onChange={(e) => setFeatureName(e.target.value)}
                    placeholder="e.g., Task Management"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={featureDesc}
                    onChange={(e) => setFeatureDesc(e.target.value)}
                    placeholder="Describe what this feature does..."
                    rows={2}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={featurePriority}
                    onChange={(e) => setFeaturePriority(e.target.value as any)}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">High - Must have</option>
                    <option value="medium">Medium - Should have</option>
                    <option value="low">Low - Nice to have</option>
                  </select>
                </div>

                <button
                  onClick={addFeature}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                >
                  + Add Feature
                </button>
              </div>

              {/* Features List */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300">Added Features ({features.length})</h4>
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-white">{feature.name}</h5>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              feature.priority === 'high'
                                ? 'bg-red-500/20 text-red-300'
                                : feature.priority === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-green-500/20 text-green-300'
                            }`}
                          >
                            {feature.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{feature.description}</p>
                      </div>
                      <button
                        onClick={() => removeFeature(feature.id)}
                        className="ml-4 p-2 hover:bg-white/10 rounded text-red-400 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: UI/UX Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Design Preferences</h3>
                <p className="text-slate-400 text-sm mb-6">
                  How should your app look and feel?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Design Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'modern', label: 'Modern', icon: '✨' },
                    { value: 'minimalist', label: 'Minimalist', icon: '🎯' },
                    { value: 'playful', label: 'Playful', icon: '🎨' },
                    { value: 'professional', label: 'Professional', icon: '💼' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setUIPreferences({ ...uiPreferences, style: style.value as any })}
                      className={`p-4 rounded-lg border transition-all ${
                        uiPreferences.style === style.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-1">{style.icon}</div>
                      <div className="font-medium">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Color Scheme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: '☀️' },
                    { value: 'dark', label: 'Dark', icon: '🌙' },
                    { value: 'auto', label: 'Auto', icon: '🔄' },
                  ].map((scheme) => (
                    <button
                      key={scheme.value}
                      onClick={() => setUIPreferences({ ...uiPreferences, colorScheme: scheme.value as any })}
                      className={`p-3 rounded-lg border transition-all ${
                        uiPreferences.colorScheme === scheme.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xl mb-1">{scheme.icon}</div>
                      <div className="text-sm font-medium">{scheme.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Layout Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'single-page', label: 'Single Page', desc: 'All content on one scrolling page' },
                    { value: 'multi-page', label: 'Multi Page', desc: 'Separate pages with navigation' },
                    { value: 'dashboard', label: 'Dashboard', desc: 'Sidebar navigation with panels' },
                    { value: 'custom', label: 'Custom', desc: 'Let AI decide the best layout' },
                  ].map((layout) => (
                    <button
                      key={layout.value}
                      onClick={() => setUIPreferences({ ...uiPreferences, layout: layout.value as any })}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        uiPreferences.layout === layout.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-medium mb-1">{layout.label}</div>
                      <div className="text-xs opacity-70">{layout.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Primary Color (optional)
                </label>
                <input
                  type="text"
                  value={uiPreferences.primaryColor || ''}
                  onChange={(e) => setUIPreferences({ ...uiPreferences, primaryColor: e.target.value })}
                  placeholder="e.g., blue, #3B82F6, rgb(59, 130, 246)"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Technical Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Technical Requirements</h3>
                <p className="text-slate-400 text-sm mb-6">
                  What technical features does your app need?
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'needsAuth', label: 'Authentication', desc: 'User login/logout functionality', icon: '🔐' },
                  { key: 'needsDatabase', label: 'Data Storage', desc: 'Store and persist data', icon: '💾' },
                  { key: 'needsAPI', label: 'API Integration', desc: 'Connect to external APIs', icon: '🔌' },
                  { key: 'needsFileUpload', label: 'File Upload', desc: 'Allow users to upload files', icon: '📤' },
                  { key: 'needsRealtime', label: 'Real-time Updates', desc: 'Live data synchronization', icon: '⚡' },
                ].map((req) => (
                  <label
                    key={req.key}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={technical[req.key as keyof TechnicalRequirements] as boolean}
                      onChange={(e) => setTechnical({ ...technical, [req.key]: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <div className="text-2xl">{req.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{req.label}</div>
                      <div className="text-sm text-slate-400">{req.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {technical.needsAuth && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Authentication Type
                  </label>
                  <select
                    value={technical.authType || 'simple'}
                    onChange={(e) => setTechnical({ ...technical, authType: e.target.value as any })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="simple">Simple (Password only)</option>
                    <option value="email">Email & Password</option>
                    <option value="oauth">OAuth (Google, GitHub, etc.)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Review Your App Concept</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Everything look good? We'll generate a step-by-step implementation plan.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">📱 {name}</h4>
                  <p className="text-slate-300 mb-4">{description}</p>
                  <div className="text-sm text-slate-400">
                    <div><strong>Purpose:</strong> {purpose}</div>
                    {targetUsers && <div><strong>Target Users:</strong> {targetUsers}</div>}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">✨ Features ({features.length})</h4>
                  <div className="space-y-2">
                    {features.map((f, i) => (
                      <div key={f.id} className="text-sm">
                        <span className="text-slate-400">{i + 1}.</span>{' '}
                        <span className="text-white font-medium">{f.name}</span>
                        <span className="text-slate-500"> - {f.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">🎨 Design</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Style:</span>{' '}
                      <span className="text-white capitalize">{uiPreferences.style}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Theme:</span>{' '}
                      <span className="text-white capitalize">{uiPreferences.colorScheme}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Layout:</span>{' '}
                      <span className="text-white capitalize">{uiPreferences.layout.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-3">⚙️ Technical</h4>
                  <div className="flex flex-wrap gap-2">
                    {technical.needsAuth && <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">🔐 Auth</span>}
                    {technical.needsDatabase && <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">💾 Database</span>}
                    {technical.needsAPI && <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">🔌 API</span>}
                    {technical.needsFileUpload && <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">📤 Files</span>}
                    {technical.needsRealtime && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">⚡ Realtime</span>}
                    {!Object.values(technical).some(v => v === true) && (
                      <span className="text-slate-400 text-sm">No special requirements</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-white/10 flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
            >
              Cancel
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all flex items-center gap-2"
              >
                <span>🚀</span>
                <span>Generate Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
