'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Edit3,
  Plus,
  Trash2,
  GripVertical,
  Save,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import { useToast } from './Toast';
import { useFocusTrap, announce } from '../hooks/useFocusTrap';

// Types
export interface Phase {
  number: number;
  name: string;
  description: string;
  objectives?: string[];
  files: string[];
  isCustom?: boolean;
  notes?: string;
  completed?: boolean;
  estimatedHours?: number;
}

interface PhaseEditorProps {
  isOpen: boolean;
  onClose: () => void;
  phases: Phase[];
  onSave: (phases: Phase[]) => void;
  readOnly?: boolean;
}

interface EditingPhase extends Phase {
  id: string; // Temporary ID for tracking during editing
}

export const PhaseEditor: React.FC<PhaseEditorProps> = ({
  isOpen,
  onClose,
  phases,
  onSave,
  readOnly = false,
}) => {
  const [editingPhases, setEditingPhases] = useState<EditingPhase[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { showToast } = useToast();

  // Focus trap for accessibility
  const modalRef = useFocusTrap({
    enabled: isOpen,
    restoreFocus: true,
  });

  // Initialize editing phases when modal opens
  useEffect(() => {
    if (isOpen) {
      const phasesWithIds = phases.map((phase, index) => ({
        ...phase,
        id: `phase-${index}-${Date.now()}`,
      }));
      setEditingPhases(phasesWithIds);
      setSelectedPhaseId(phasesWithIds[0]?.id || null);
      setHasChanges(false);
    }
  }, [isOpen, phases]);

  // Find selected phase
  const selectedPhase = editingPhases.find((p) => p.id === selectedPhaseId);
  const selectedIndex = editingPhases.findIndex((p) => p.id === selectedPhaseId);

  // Handle phase update
  const updatePhase = (id: string, updates: Partial<EditingPhase>) => {
    setEditingPhases((prev) =>
      prev.map((phase) => (phase.id === id ? { ...phase, ...updates } : phase))
    );
    setHasChanges(true);
  };

  // Add new custom phase
  const addCustomPhase = () => {
    const newPhase: EditingPhase = {
      id: `phase-custom-${Date.now()}`,
      number: editingPhases.length + 1,
      name: 'New Custom Phase',
      description: 'Describe what this phase accomplishes',
      objectives: ['Add objectives here'],
      files: [],
      isCustom: true,
      notes: '',
      estimatedHours: 8,
    };

    setEditingPhases((prev) => [...prev, newPhase]);
    setSelectedPhaseId(newPhase.id);
    setHasChanges(true);

    showToast({
      type: 'success',
      message: 'Custom phase added',
      description: 'Edit the details in the form',
    });
  };

  // Delete phase
  const deletePhase = (id: string) => {
    const phase = editingPhases.find((p) => p.id === id);
    if (!phase) return;

    if (!phase.isCustom) {
      showToast({
        type: 'error',
        message: 'Cannot delete template phase',
        description: 'Only custom phases can be deleted',
      });
      return;
    }

    if (confirm(`Delete "${phase.name}"? This cannot be undone.`)) {
      setEditingPhases((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        // Renumber phases
        return filtered.map((phase, index) => ({
          ...phase,
          number: index + 1,
        }));
      });

      // Select previous phase or first phase
      const currentIndex = editingPhases.findIndex((p) => p.id === id);
      const newSelected =
        editingPhases[currentIndex - 1]?.id || editingPhases[currentIndex + 1]?.id || null;
      setSelectedPhaseId(newSelected);
      setHasChanges(true);

      showToast({
        type: 'success',
        message: 'Phase deleted',
      });
    }
  };

  // Move phase up/down
  const movePhase = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editingPhases.length - 1)
    ) {
      return;
    }

    const newPhases = [...editingPhases];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap phases
    [newPhases[index], newPhases[targetIndex]] = [newPhases[targetIndex], newPhases[index]];

    // Renumber
    const renumbered = newPhases.map((phase, idx) => ({
      ...phase,
      number: idx + 1,
    }));

    setEditingPhases(renumbered);
    setHasChanges(true);

    showToast({
      type: 'success',
      message: 'Phase reordered',
    });
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPhases = [...editingPhases];
    const draggedPhase = newPhases[draggedIndex];

    newPhases.splice(draggedIndex, 1);
    newPhases.splice(index, 0, draggedPhase);

    // Renumber
    const renumbered = newPhases.map((phase, idx) => ({
      ...phase,
      number: idx + 1,
    }));

    setEditingPhases(renumbered);
    setDraggedIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Save changes
  const handleSave = () => {
    // Convert back to Phase[] (remove temporary IDs)
    const savedPhases: Phase[] = editingPhases.map(({ id, ...phase }) => phase);
    onSave(savedPhases);
    setHasChanges(false);

    showToast({
      type: 'success',
      message: 'Phases saved successfully',
      description: `${savedPhases.length} phases updated`,
    });

    onClose();
  };

  // Handle close with unsaved changes
  const handleClose = () => {
    if (hasChanges) {
      if (
        confirm(
          'You have unsaved changes. Are you sure you want to close without saving?'
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Add/remove objective
  const addObjective = () => {
    if (!selectedPhase) return;
    updatePhase(selectedPhase.id, {
      objectives: [...(selectedPhase.objectives || []), 'New objective'],
    });
  };

  const updateObjective = (index: number, value: string) => {
    if (!selectedPhase) return;
    const newObjectives = [...(selectedPhase.objectives || [])];
    newObjectives[index] = value;
    updatePhase(selectedPhase.id, { objectives: newObjectives });
  };

  const removeObjective = (index: number) => {
    if (!selectedPhase) return;
    const newObjectives = [...(selectedPhase.objectives || [])];
    newObjectives.splice(index, 1);
    updatePhase(selectedPhase.id, { objectives: newObjectives });
  };

  // Add/remove file
  const addFile = () => {
    if (!selectedPhase) return;
    const fileName = prompt('Enter file path (e.g., src/components/MyComponent.tsx):');
    if (fileName && fileName.trim()) {
      updatePhase(selectedPhase.id, {
        files: [...selectedPhase.files, fileName.trim()],
      });
    }
  };

  const removeFile = (index: number) => {
    if (!selectedPhase) return;
    const newFiles = [...selectedPhase.files];
    newFiles.splice(index, 1);
    updatePhase(selectedPhase.id, { files: newFiles });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phase-editor-title"
    >
      <div
        ref={modalRef}
        className="bg-slate-900 rounded-2xl border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-600/20">
              <Edit3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 id="phase-editor-title" className="text-2xl font-bold text-white">Phase Editor</h2>
              <p className="text-sm text-slate-400">
                Customize your implementation roadmap
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-all text-slate-400"
            aria-label="Close phase editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Phase List Sidebar */}
          <div className="w-80 border-r border-white/10 flex flex-col bg-slate-950/50">
            {/* Add Phase Button */}
            <div className="p-4 border-b border-white/10">
              <button
                onClick={addCustomPhase}
                disabled={readOnly}
                className="w-full px-4 py-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Custom Phase
              </button>
            </div>

            {/* Phase List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
              {editingPhases.map((phase, index) => (
                <div
                  key={phase.id}
                  draggable={!readOnly}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`mb-2 p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedPhaseId === phase.id
                      ? 'bg-purple-600/20 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  } ${draggedIndex === index ? 'opacity-50' : ''}`}
                  onClick={() => setSelectedPhaseId(phase.id)}
                >
                  <div className="flex items-start gap-2">
                    {!readOnly && (
                      <GripVertical className="w-4 h-4 text-slate-500 mt-1 cursor-grab active:cursor-grabbing flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-purple-400">
                          Phase {phase.number}
                        </span>
                        {phase.isCustom && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                            Custom
                          </span>
                        )}
                        {phase.completed && (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-white truncate">
                        {phase.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {phase.description}
                      </p>
                      {phase.estimatedHours && (
                        <p className="text-xs text-slate-500 mt-1">
                          ~{phase.estimatedHours}h estimated
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reorder Buttons */}
                  {!readOnly && (
                    <div className="flex items-center gap-1 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          movePhase(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Move phase up"
                      >
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          movePhase(index, 'down');
                        }}
                        disabled={index === editingPhases.length - 1}
                        className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        aria-label="Move phase down"
                      >
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </button>
                      {phase.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhase(phase.id);
                          }}
                          className="p-1 rounded hover:bg-red-600/20 transition-all ml-auto"
                          aria-label="Delete phase"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {editingPhases.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No phases yet</p>
                  <p className="text-xs mt-1">Add a custom phase to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Phase Details */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedPhase ? (
              <div className="p-6 space-y-6">
                {/* Phase Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                      Phase Name
                    </label>
                    <input
                      type="text"
                      value={selectedPhase.name}
                      onChange={(e) =>
                        updatePhase(selectedPhase.id, { name: e.target.value })
                      }
                      disabled={readOnly}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g., Initial Setup & Configuration"
                    />
                  </div>
                  <div className="ml-4 w-32">
                    <label className="block text-xs font-semibold text-slate-400 mb-2">
                      Est. Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={selectedPhase.estimatedHours || 8}
                      onChange={(e) =>
                        updatePhase(selectedPhase.id, {
                          estimatedHours: parseInt(e.target.value) || 8,
                        })
                      }
                      disabled={readOnly}
                      className="w-full px-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={selectedPhase.description}
                    onChange={(e) =>
                      updatePhase(selectedPhase.id, { description: e.target.value })
                    }
                    disabled={readOnly}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Describe what this phase accomplishes..."
                  />
                </div>

                {/* Objectives */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-400">
                      Objectives ({selectedPhase.objectives?.length || 0})
                    </label>
                    <button
                      onClick={addObjective}
                      disabled={readOnly}
                      className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedPhase.objectives?.map((objective, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateObjective(index, e.target.value)}
                          disabled={readOnly}
                          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {!readOnly && (
                          <button
                            onClick={() => removeObjective(index)}
                            className="p-2 rounded hover:bg-red-600/20 transition-all"
                            aria-label="Remove objective"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!selectedPhase.objectives || selectedPhase.objectives.length === 0) && (
                      <p className="text-sm text-slate-500 italic py-3">
                        No objectives defined. Add one to get started.
                      </p>
                    )}
                  </div>
                </div>

                {/* Files */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-semibold text-slate-400">
                      Files ({selectedPhase.files?.length || 0})
                    </label>
                    <button
                      onClick={addFile}
                      disabled={readOnly}
                      className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedPhase.files?.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg border border-white/10"
                      >
                        <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <code className="flex-1 text-sm text-slate-300 font-mono truncate">
                          {file}
                        </code>
                        {!readOnly && (
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 rounded hover:bg-red-600/20 transition-all"
                            aria-label="Remove file"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        )}
                      </div>
                    ))}
                    {(!selectedPhase.files || selectedPhase.files.length === 0) && (
                      <p className="text-sm text-slate-500 italic py-3">
                        No files specified. Add files that will be created in this phase.
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <label className="text-xs font-semibold text-slate-400">
                      Notes & Comments
                    </label>
                  </div>
                  <textarea
                    value={selectedPhase.notes || ''}
                    onChange={(e) =>
                      updatePhase(selectedPhase.id, { notes: e.target.value })
                    }
                    disabled={readOnly}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Add notes, reminders, or implementation details for this phase..."
                  />
                </div>

                {/* Completion Status */}
                <div className="pt-4 border-t border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPhase.completed || false}
                      onChange={(e) =>
                        updatePhase(selectedPhase.id, { completed: e.target.checked })
                      }
                      disabled={readOnly}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-green-600 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-slate-300">
                      Mark this phase as completed
                    </span>
                  </label>
                </div>

                {/* Warning for template phases */}
                {!selectedPhase.isCustom && (
                  <div className="flex items-start gap-3 p-4 bg-amber-600/10 border border-amber-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-200">
                      <p className="font-medium mb-1">Template Phase</p>
                      <p className="text-amber-300/80">
                        This phase is part of the architecture template. You can edit it, but
                        it cannot be deleted. To create a fully custom phase, use the "Add
                        Custom Phase" button.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <div className="text-center">
                  <Edit3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No phase selected</p>
                  <p className="text-sm mt-1">Select a phase from the list to edit</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-slate-950/50">
          <div className="flex items-center gap-3">
            {hasChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Unsaved changes</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={readOnly || !hasChanges}
              className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseEditor;
