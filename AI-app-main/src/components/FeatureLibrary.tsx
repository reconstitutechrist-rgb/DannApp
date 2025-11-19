'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  Shield,
  Database,
  CreditCard,
  Users,
  Bell,
  FileText,
  Settings,
  BarChart,
  MessageSquare,
  Calendar,
  Upload,
  Download,
  Share2,
  Filter,
  X,
} from 'lucide-react';

export interface FeatureTemplate {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'data' | 'payments' | 'social' | 'content' | 'analytics' | 'communication' | 'productivity' | 'ui';
  priority: 'high' | 'medium' | 'low';
  icon: any;
  dependencies?: string[];
}

const FEATURE_LIBRARY: FeatureTemplate[] = [
  // Authentication & Authorization (8 features)
  {
    id: 'user-login',
    name: 'User Login',
    description: 'Email and password authentication',
    category: 'auth',
    priority: 'high',
    icon: Shield,
  },
  {
    id: 'user-registration',
    name: 'User Registration',
    description: 'New user sign-up with email verification',
    category: 'auth',
    priority: 'high',
    icon: Shield,
  },
  {
    id: 'social-login',
    name: 'Social Login',
    description: 'Login with Google, GitHub, or Facebook',
    category: 'auth',
    priority: 'medium',
    icon: Shield,
    dependencies: ['user-login'],
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    description: 'Forgot password and reset functionality',
    category: 'auth',
    priority: 'medium',
    icon: Shield,
    dependencies: ['user-login'],
  },
  {
    id: 'two-factor-auth',
    name: 'Two-Factor Authentication',
    description: 'Extra security with 2FA via SMS or app',
    category: 'auth',
    priority: 'medium',
    icon: Shield,
    dependencies: ['user-login'],
  },
  {
    id: 'role-based-access',
    name: 'Role-Based Access Control',
    description: 'Admin, user, and guest roles with permissions',
    category: 'auth',
    priority: 'high',
    icon: Shield,
    dependencies: ['user-login'],
  },
  {
    id: 'session-management',
    name: 'Session Management',
    description: 'Active sessions, logout all devices',
    category: 'auth',
    priority: 'low',
    icon: Shield,
    dependencies: ['user-login'],
  },
  {
    id: 'api-key-management',
    name: 'API Key Management',
    description: 'Generate and manage API keys for developers',
    category: 'auth',
    priority: 'low',
    icon: Shield,
  },

  // Data Management (10 features)
  {
    id: 'crud-operations',
    name: 'CRUD Operations',
    description: 'Create, Read, Update, Delete for main data',
    category: 'data',
    priority: 'high',
    icon: Database,
  },
  {
    id: 'search-filter',
    name: 'Search & Filter',
    description: 'Search bar and advanced filtering',
    category: 'data',
    priority: 'high',
    icon: Search,
  },
  {
    id: 'data-export',
    name: 'Data Export',
    description: 'Export data as CSV, Excel, or JSON',
    category: 'data',
    priority: 'medium',
    icon: Download,
  },
  {
    id: 'data-import',
    name: 'Data Import',
    description: 'Bulk import from CSV or Excel',
    category: 'data',
    priority: 'medium',
    icon: Upload,
  },
  {
    id: 'sorting',
    name: 'Data Sorting',
    description: 'Sort by column, multiple sort criteria',
    category: 'data',
    priority: 'high',
    icon: Filter,
  },
  {
    id: 'pagination',
    name: 'Pagination',
    description: 'Paginated lists and tables',
    category: 'data',
    priority: 'high',
    icon: FileText,
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Form validation and data integrity checks',
    category: 'data',
    priority: 'high',
    icon: Check,
  },
  {
    id: 'version-history',
    name: 'Version History',
    description: 'Track changes and restore previous versions',
    category: 'data',
    priority: 'low',
    icon: Database,
  },
  {
    id: 'bulk-actions',
    name: 'Bulk Actions',
    description: 'Select multiple items and perform actions',
    category: 'data',
    priority: 'medium',
    icon: Check,
  },
  {
    id: 'data-backup',
    name: 'Automated Backups',
    description: 'Scheduled backups and restore functionality',
    category: 'data',
    priority: 'low',
    icon: Database,
  },

  // Payments & Billing (6 features)
  {
    id: 'payment-processing',
    name: 'Payment Processing',
    description: 'Accept credit cards via Stripe',
    category: 'payments',
    priority: 'high',
    icon: CreditCard,
  },
  {
    id: 'subscription-management',
    name: 'Subscription Management',
    description: 'Recurring billing and plan management',
    category: 'payments',
    priority: 'high',
    icon: CreditCard,
    dependencies: ['payment-processing'],
  },
  {
    id: 'invoice-generation',
    name: 'Invoice Generation',
    description: 'Automated invoice creation and sending',
    category: 'payments',
    priority: 'medium',
    icon: FileText,
  },
  {
    id: 'payment-history',
    name: 'Payment History',
    description: 'Transaction log and receipts',
    category: 'payments',
    priority: 'medium',
    icon: CreditCard,
  },
  {
    id: 'refunds',
    name: 'Refund Processing',
    description: 'Issue refunds and manage disputes',
    category: 'payments',
    priority: 'low',
    icon: CreditCard,
  },
  {
    id: 'multi-currency',
    name: 'Multi-Currency Support',
    description: 'Accept payments in multiple currencies',
    category: 'payments',
    priority: 'low',
    icon: CreditCard,
  },

  // Social & Collaboration (8 features)
  {
    id: 'user-profiles',
    name: 'User Profiles',
    description: 'Public profiles with avatar and bio',
    category: 'social',
    priority: 'high',
    icon: Users,
  },
  {
    id: 'follow-system',
    name: 'Follow/Friend System',
    description: 'Users can follow or friend each other',
    category: 'social',
    priority: 'medium',
    icon: Users,
    dependencies: ['user-profiles'],
  },
  {
    id: 'comments',
    name: 'Comments & Replies',
    description: 'Threaded commenting system',
    category: 'social',
    priority: 'medium',
    icon: MessageSquare,
  },
  {
    id: 'likes-reactions',
    name: 'Likes & Reactions',
    description: 'React to content with likes and emojis',
    category: 'social',
    priority: 'medium',
    icon: MessageSquare,
  },
  {
    id: 'sharing',
    name: 'Social Sharing',
    description: 'Share to Twitter, Facebook, LinkedIn',
    category: 'social',
    priority: 'low',
    icon: Share2,
  },
  {
    id: 'mentions',
    name: '@Mentions & Tagging',
    description: 'Mention users in posts and comments',
    category: 'social',
    priority: 'low',
    icon: Users,
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    description: 'Recent activity and updates from network',
    category: 'social',
    priority: 'medium',
    icon: Bell,
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Shared workspaces and team features',
    category: 'social',
    priority: 'high',
    icon: Users,
  },

  // Content Management (6 features)
  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor',
    description: 'WYSIWYG editor with formatting',
    category: 'content',
    priority: 'high',
    icon: FileText,
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Upload images, documents, and media',
    category: 'content',
    priority: 'high',
    icon: Upload,
  },
  {
    id: 'media-library',
    name: 'Media Library',
    description: 'Organize and manage uploaded files',
    category: 'content',
    priority: 'medium',
    icon: FileText,
    dependencies: ['file-upload'],
  },
  {
    id: 'draft-system',
    name: 'Draft & Auto-Save',
    description: 'Save drafts automatically while editing',
    category: 'content',
    priority: 'medium',
    icon: FileText,
  },
  {
    id: 'content-scheduling',
    name: 'Content Scheduling',
    description: 'Schedule posts for future publication',
    category: 'content',
    priority: 'low',
    icon: Calendar,
  },
  {
    id: 'content-categories',
    name: 'Categories & Tags',
    description: 'Organize content with categories and tags',
    category: 'content',
    priority: 'medium',
    icon: FileText,
  },

  // Analytics & Reporting (5 features)
  {
    id: 'dashboard-analytics',
    name: 'Analytics Dashboard',
    description: 'Key metrics and charts',
    category: 'analytics',
    priority: 'high',
    icon: BarChart,
  },
  {
    id: 'user-analytics',
    name: 'User Analytics',
    description: 'Track user behavior and engagement',
    category: 'analytics',
    priority: 'medium',
    icon: BarChart,
  },
  {
    id: 'custom-reports',
    name: 'Custom Reports',
    description: 'Generate custom reports and exports',
    category: 'analytics',
    priority: 'low',
    icon: BarChart,
  },
  {
    id: 'activity-logs',
    name: 'Activity Logs',
    description: 'Audit trail of all user actions',
    category: 'analytics',
    priority: 'low',
    icon: FileText,
  },
  {
    id: 'performance-monitoring',
    name: 'Performance Monitoring',
    description: 'Track app performance and errors',
    category: 'analytics',
    priority: 'low',
    icon: BarChart,
  },

  // Communication (6 features)
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Real-time browser notifications',
    category: 'communication',
    priority: 'high',
    icon: Bell,
  },
  {
    id: 'email-notifications',
    name: 'Email Notifications',
    description: 'Send automated email updates',
    category: 'communication',
    priority: 'high',
    icon: Bell,
  },
  {
    id: 'in-app-messaging',
    name: 'In-App Messaging',
    description: 'Direct messages between users',
    category: 'communication',
    priority: 'medium',
    icon: MessageSquare,
  },
  {
    id: 'chat-support',
    name: 'Live Chat Support',
    description: 'Customer support chat widget',
    category: 'communication',
    priority: 'medium',
    icon: MessageSquare,
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Broadcast messages to all users',
    category: 'communication',
    priority: 'low',
    icon: Bell,
  },
  {
    id: 'sms-notifications',
    name: 'SMS Notifications',
    description: 'Send SMS alerts via Twilio',
    category: 'communication',
    priority: 'low',
    icon: Bell,
  },

  // Productivity & Settings (7 features)
  {
    id: 'user-settings',
    name: 'User Settings',
    description: 'Customizable user preferences',
    category: 'productivity',
    priority: 'high',
    icon: Settings,
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Toggle between light and dark themes',
    category: 'ui',
    priority: 'medium',
    icon: Settings,
  },
  {
    id: 'keyboard-shortcuts',
    name: 'Keyboard Shortcuts',
    description: 'Power user shortcuts for common actions',
    category: 'productivity',
    priority: 'low',
    icon: Settings,
  },
  {
    id: 'bookmarks-favorites',
    name: 'Bookmarks & Favorites',
    description: 'Save and organize favorite items',
    category: 'productivity',
    priority: 'medium',
    icon: Settings,
  },
  {
    id: 'calendar-integration',
    name: 'Calendar Integration',
    description: 'Sync with Google Calendar, Outlook',
    category: 'productivity',
    priority: 'low',
    icon: Calendar,
  },
  {
    id: 'offline-mode',
    name: 'Offline Mode',
    description: 'Progressive Web App with offline support',
    category: 'productivity',
    priority: 'low',
    icon: Download,
  },
  {
    id: 'multi-language',
    name: 'Multi-Language Support',
    description: 'Internationalization (i18n) for multiple languages',
    category: 'ui',
    priority: 'low',
    icon: Settings,
  },
];

interface FeatureLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (feature: FeatureTemplate) => void;
  selectedFeatures: Array<{ name: string }>;
}

export const FeatureLibrary: React.FC<FeatureLibraryProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedFeatures,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Features', count: FEATURE_LIBRARY.length },
    { id: 'auth', label: 'Authentication', count: FEATURE_LIBRARY.filter((f) => f.category === 'auth').length },
    { id: 'data', label: 'Data Management', count: FEATURE_LIBRARY.filter((f) => f.category === 'data').length },
    { id: 'payments', label: 'Payments', count: FEATURE_LIBRARY.filter((f) => f.category === 'payments').length },
    { id: 'social', label: 'Social', count: FEATURE_LIBRARY.filter((f) => f.category === 'social').length },
    { id: 'content', label: 'Content', count: FEATURE_LIBRARY.filter((f) => f.category === 'content').length },
    { id: 'analytics', label: 'Analytics', count: FEATURE_LIBRARY.filter((f) => f.category === 'analytics').length },
    { id: 'communication', label: 'Communication', count: FEATURE_LIBRARY.filter((f) => f.category === 'communication').length },
    { id: 'productivity', label: 'Productivity', count: FEATURE_LIBRARY.filter((f) => f.category === 'productivity').length },
    { id: 'ui', label: 'UI/UX', count: FEATURE_LIBRARY.filter((f) => f.category === 'ui').length },
  ];

  const filteredFeatures = useMemo(() => {
    return FEATURE_LIBRARY.filter((feature) => {
      const matchesSearch =
        searchQuery === '' ||
        feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const isFeatureSelected = (featureId: string) => {
    const feature = FEATURE_LIBRARY.find((f) => f.id === featureId);
    return feature ? selectedFeatures.some((f) => f.name === feature.name) : false;
  };

  const handleSelect = (feature: FeatureTemplate) => {
    if (!isFeatureSelected(feature.id)) {
      onSelect(feature);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass border border-neutral-700/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-700/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-violet-500/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-violet-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Feature Library</h2>
              <p className="text-sm text-neutral-400">
                {filteredFeatures.length} features available
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-neutral-700/30 space-y-4 flex-shrink-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-3 glass-subtle rounded-lg text-white placeholder-neutral-500 border border-neutral-700/30 focus:border-primary-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'glass-subtle text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {category.label}
                <span className="ml-1.5 opacity-60">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFeatures.map((feature) => {
              const Icon = feature.icon;
              const isSelected = isFeatureSelected(feature.id);

              return (
                <button
                  key={feature.id}
                  onClick={() => handleSelect(feature)}
                  disabled={isSelected}
                  className={`glass-subtle rounded-xl p-4 text-left transition-all border ${
                    isSelected
                      ? 'border-green-500/30 bg-green-500/10 cursor-not-allowed'
                      : 'border-transparent hover:border-primary-500/30 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-green-500/20'
                          : 'bg-gradient-to-br from-primary-500/20 to-violet-500/20'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Icon className="w-5 h-5 text-primary-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm mb-1">{feature.name}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            feature.priority === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : feature.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {feature.priority}
                        </span>
                        {feature.dependencies && feature.dependencies.length > 0 && (
                          <span className="text-xs text-neutral-500">
                            +{feature.dependencies.length} dep
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-500">No features found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700/30 bg-neutral-900/50 flex items-center justify-between flex-shrink-0">
          <p className="text-sm text-neutral-500">
            {selectedFeatures.length} features selected
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 hover:text-primary-300 transition-all text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export { FEATURE_LIBRARY };
