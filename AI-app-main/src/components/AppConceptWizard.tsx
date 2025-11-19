"use client";

import { useState, useEffect, useRef } from 'react';
import type { AppConcept, Feature, UIPreferences, TechnicalRequirements } from '../types/appConcept';
import {
  validateAppName,
  validateDescription,
  validatePurpose,
  validateTargetUsers,
  validateFeatureName,
  validateFeatureDescription,
  validateColor,
  type ValidationError
} from '../utils/wizardValidation';
import {
  ValidationMessage,
  ValidatedField,
  CharacterCounter,
} from './ValidationMessage';
import { FeatureLibrary, type FeatureTemplate } from './FeatureLibrary';
import { createAutoSaver, WIZARD_DRAFT_KEYS, formatDraftAge } from '../utils/wizardAutoSave';
import { useToast } from './Toast';

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

  // Validation state
  const [errors, setErrors] = useState<Record<string, ValidationError | null>>({});
  const [featureErrors, setFeatureErrors] = useState<Record<string, ValidationError | null>>({});

  // Feature library
  const [showLibrary, setShowLibrary] = useState(false);
  const [justAddedFeature, setJustAddedFeature] = useState<string | null>(null);

  // Auto-save
  const autoSaver = useRef(createAutoSaver<any>(WIZARD_DRAFT_KEYS.APP_CONCEPT));
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);

  const { showToast } = useToast();

  // Check for draft on mount
  useEffect(() => {
    const metadata = autoSaver.current.getMetadata();
    if (metadata?.exists) {
      setShowDraftPrompt(true);
    }

    // Start auto-saving
    autoSaver.current.start(
      () => ({
        name,
        description,
        purpose,
        targetUsers,
        features,
        uiPreferences,
        technical,
        currentStep,
      }),
      () => {
        setLastSaved(new Date().toISOString());
      }
    );

    return () => {
      autoSaver.current.stop();
    };
  }, []);

  // Auto-save when state changes
  useEffect(() => {
    if (!showDraftPrompt) {
      autoSaver.current.save({
        name,
        description,
        purpose,
        targetUsers,
        features,
        uiPreferences,
        technical,
        currentStep,
      });
    }
  }, [name, description, purpose, targetUsers, features, uiPreferences, technical, currentStep, showDraftPrompt]);

  // Load draft
  const loadDraft = () => {
    const draft = autoSaver.current.load();
    if (draft) {
      setName(draft.name || '');
      setDescription(draft.description || '');
      setPurpose(draft.purpose || '');
      setTargetUsers(draft.targetUsers || '');
      setFeatures(draft.features || []);
      setUIPreferences(draft.uiPreferences || { style: 'modern', colorScheme: 'auto', layout: 'single-page' });
      setTechnical(draft.technical || { needsAuth: false, needsDatabase: false, needsAPI: false, needsFileUpload: false, needsRealtime: false });
      setCurrentStep(draft.currentStep || 1);
      showToast({ type: 'success', message: 'Draft loaded successfully!' });
    }
    setShowDraftPrompt(false);
  };

  const discardDraft = () => {
    autoSaver.current.delete();
    setShowDraftPrompt(false);
  };

  // Validation handlers
  const handleNameChange = (value: string) => {
    setName(value);
    setErrors(prev => ({ ...prev, name: validateAppName(value) }));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setErrors(prev => ({ ...prev, description: validateDescription(value) }));
  };

  const handlePurposeChange = (value: string) => {
    setPurpose(value);
    setErrors(prev => ({ ...prev, purpose: validatePurpose(value) }));
  };

  const handleTargetUsersChange = (value: string) => {
    setTargetUsers(value);
    setErrors(prev => ({ ...prev, targetUsers: validateTargetUsers(value) }));
  };

  const handleFeatureNameChange = (value: string) => {
    setFeatureName(value);
    setFeatureErrors(prev => ({ ...prev, name: validateFeatureName(value, features) }));
  };

  const handleFeatureDescChange = (value: string) => {
    setFeatureDesc(value);
    setFeatureErrors(prev => ({ ...prev, description: validateFeatureDescription(value) }));
  };

  const handleColorChange = (value: string) => {
    setUIPreferences({ ...uiPreferences, primaryColor: value });
    setErrors(prev => ({ ...prev, primaryColor: validateColor(value) }));
  };

  const addFeature = () => {
    const nameError = validateFeatureName(featureName, features);
    const descError = validateFeatureDescription(featureDesc);

    if (nameError) {
      setFeatureErrors({ name: nameError, description: descError });
      return;
    }

    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: featureName.trim(),
      description: featureDesc.trim(),
      priority: featurePriority,
    };

    setFeatures([...features, newFeature]);
    setFeatureName('');
    setFeatureDesc('');
    setFeaturePriority('high');
    setFeatureErrors({});

    // Show success feedback
    setJustAddedFeature(newFeature.id);
    setTimeout(() => setJustAddedFeature(null), 2000);
  };

  // Add feature from library
  const handleLibrarySelect = (template: FeatureTemplate) => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: template.name,
      description: template.description,
      priority: template.priority,
    };

    setFeatures([...features, newFeature]);
    setJustAddedFeature(newFeature.id);
    setTimeout(() => setJustAddedFeature(null), 2000);

    showToast({
      type: 'success',
      message: 'Feature added!',
      description: template.name,
    });
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

    // Clear draft on successful completion
    autoSaver.current.delete();
    onComplete(concept);
  };

  const handleCancel = () => {
    if (name || description || purpose || features.length > 0) {
      if (confirm('You have unsaved changes. Your progress has been auto-saved. Cancel anyway?')) {
        onCancel();
      }
    } else {
      autoSaver.current.delete();
      onCancel();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          name.trim() &&
          description.trim() &&
          purpose.trim() &&
          !errors.name &&
          !errors.description &&
          !errors.purpose
        );
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
    <>
      {/* Draft Resume Prompt */}
      {showDraftPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101] flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Resume Your Work?</h3>
            <p className="text-slate-400 mb-4">
              You have an unsaved draft from{' '}
              {formatDraftAge(autoSaver.current.getMetadata()?.timestamp || '')}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={discardDraft}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all"
              >
                Start Fresh
              </button>
              <button
                onClick={loadDraft}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
              >
                Resume Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Library Modal */}
      <FeatureLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelect={handleLibrarySelect}
        selectedFeatures={features}
      />

      {/* Main Wizard */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full my-8">
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <span>App Concept Wizard</span>
              </h2>
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <span className="text-xs text-slate-500">
                    Saved {formatDraftAge(lastSaved)}
                  </span>
                )}
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
                >
                  ✕
                </button>
              </div>
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

                <ValidatedField
                  label="App Name"
                  required
                  error={errors.name}
                  characterCount={{ current: name.length, max: 50 }}
                  hint="Choose a memorable name for your app"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., TaskMaster Pro"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name?.type === 'error' ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </ValidatedField>

                <ValidatedField
                  label="Description"
                  required
                  error={errors.description}
                  characterCount={{ current: description.length, max: 500 }}
                  hint="A brief description of what your app does"
                >
                  <textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="A brief description of what your app does..."
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description?.type === 'error' ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </ValidatedField>

                <ValidatedField
                  label="Purpose"
                  required
                  error={errors.purpose}
                  characterCount={{ current: purpose.length, max: 300 }}
                  hint="What problem does this app solve? What value does it provide?"
                >
                  <textarea
                    value={purpose}
                    onChange={(e) => handlePurposeChange(e.target.value)}
                    placeholder="What problem does this app solve? What value does it provide?"
                    rows={3}
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.purpose?.type === 'error' ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </ValidatedField>

                <ValidatedField
                  label="Target Users"
                  error={errors.targetUsers}
                  characterCount={{ current: targetUsers.length, max: 200 }}
                  hint="Who will use this app? (optional)"
                >
                  <input
                    type="text"
                    value={targetUsers}
                    onChange={(e) => handleTargetUsersChange(e.target.value)}
                    placeholder="e.g., Freelancers, students, small business owners"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.targetUsers?.type === 'error' ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </ValidatedField>
              </div>
            )}

            {/* Step 2: Features */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Core Features</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      What are the main features your app needs? Add at least one.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLibrary(true)}
                    className="px-4 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 transition-all text-sm font-medium flex items-center gap-2"
                  >
                    <span>📚</span>
                    <span>Browse 56 Features</span>
                  </button>
                </div>

                {/* Add Feature Form */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                  <ValidatedField
                    label="Feature Name"
                    error={featureErrors.name}
                    characterCount={{ current: featureName.length, max: 50 }}
                  >
                    <input
                      type="text"
                      value={featureName}
                      onChange={(e) => handleFeatureNameChange(e.target.value)}
                      placeholder="e.g., Task Management"
                      className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        featureErrors.name?.type === 'error' ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </ValidatedField>

                  <ValidatedField
                    label="Description"
                    error={featureErrors.description}
                    characterCount={{ current: featureDesc.length, max: 200 }}
                  >
                    <textarea
                      value={featureDesc}
                      onChange={(e) => handleFeatureDescChange(e.target.value)}
                      placeholder="Describe what this feature does..."
                      rows={2}
                      className={`w-full px-4 py-2 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        featureErrors.description?.type === 'error' ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </ValidatedField>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={featurePriority}
                      onChange={(e) => setFeaturePriority(e.target.value as any)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className={`bg-white/5 border rounded-lg p-4 flex items-start justify-between transition-all ${
                          justAddedFeature === feature.id
                            ? 'border-green-500 ring-2 ring-green-500/50'
                            : 'border-white/10'
                        }`}
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

                <ValidatedField
                  label="Primary Color"
                  error={errors.primaryColor}
                  hint="e.g., blue, #3B82F6, rgb(59, 130, 246)"
                >
                  <input
                    type="text"
                    value={uiPreferences.primaryColor || ''}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="e.g., blue, #3B82F6, rgb(59, 130, 246)"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.primaryColor?.type === 'error' ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                </ValidatedField>
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onClick={handleCancel}
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
    </>
  );
}
