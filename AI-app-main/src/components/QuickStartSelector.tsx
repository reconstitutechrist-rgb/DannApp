'use client';

import React, { useState } from 'react';
import {
  Zap,
  ShoppingCart,
  FileText,
  Users,
  Briefcase,
  Palette,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { AppConcept, Feature } from '@/types/appConcept';

export interface QuickStartTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  color: string;
  features: string[];
  concept: Partial<AppConcept>;
}

const QUICK_START_TEMPLATES: QuickStartTemplate[] = [
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Admin panel with analytics, user management, and settings',
    icon: Briefcase,
    category: 'Business',
    color: 'from-blue-500/20 to-cyan-500/20',
    features: ['User Authentication', 'Analytics Dashboard', 'User Management', 'Settings Panel', 'API Integration'],
    concept: {
      name: 'SaaS Dashboard',
      description: 'A modern admin dashboard for managing users, viewing analytics, and configuring application settings',
      purpose: 'Provide administrators with tools to manage users, track metrics, and configure the platform',
      targetUsers: 'administrators, product managers, support teams',
      uiPreferences: {
        style: 'modern',
        colorScheme: 'dark',
        layout: 'dashboard',
        primaryColor: '#3b82f6',
      },
      technical: {
        needsAuth: true,
        authType: 'email',
        needsDatabase: true,
        dataModels: ['User', 'Analytics', 'Settings'],
        needsAPI: true,
        needsFileUpload: false,
        needsRealtime: false,
      },
    },
  },
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Online store with products, cart, and checkout',
    icon: ShoppingCart,
    category: 'E-commerce',
    color: 'from-green-500/20 to-emerald-500/20',
    features: ['Product Catalog', 'Shopping Cart', 'Checkout Flow', 'Payment Processing', 'Order Management'],
    concept: {
      name: 'Online Store',
      description: 'A complete e-commerce platform for selling products online with secure payment processing',
      purpose: 'Enable merchants to sell products online and customers to browse, purchase, and track orders',
      targetUsers: 'shoppers, merchants',
      uiPreferences: {
        style: 'modern',
        colorScheme: 'light',
        layout: 'multi-page',
        primaryColor: '#10b981',
      },
      technical: {
        needsAuth: true,
        authType: 'email',
        needsDatabase: true,
        dataModels: ['Product', 'Order', 'Cart', 'User'],
        needsAPI: true,
        needsFileUpload: true,
        needsRealtime: false,
      },
    },
  },
  {
    id: 'blog-platform',
    name: 'Blog Platform',
    description: 'Content management system with posts, categories, and comments',
    icon: FileText,
    category: 'Content',
    color: 'from-purple-500/20 to-pink-500/20',
    features: ['Blog Posts', 'Rich Text Editor', 'Categories & Tags', 'Comments', 'Search'],
    concept: {
      name: 'Blog Platform',
      description: 'A modern blogging platform with rich content editing, categorization, and reader engagement',
      purpose: 'Allow writers to publish content and readers to discover and engage with articles',
      targetUsers: 'writers, bloggers, readers',
      uiPreferences: {
        style: 'minimalist',
        colorScheme: 'auto',
        layout: 'multi-page',
        primaryColor: '#a855f7',
      },
      technical: {
        needsAuth: true,
        authType: 'email',
        needsDatabase: true,
        dataModels: ['Post', 'Category', 'Comment', 'User'],
        needsAPI: false,
        needsFileUpload: true,
        needsRealtime: false,
      },
    },
  },
  {
    id: 'social-network',
    name: 'Social Network',
    description: 'Community platform with profiles, posts, and messaging',
    icon: Users,
    category: 'Social',
    color: 'from-orange-500/20 to-red-500/20',
    features: ['User Profiles', 'Feed & Posts', 'Likes & Comments', 'Follow System', 'Messaging'],
    concept: {
      name: 'Social Network',
      description: 'A social platform where users can connect, share content, and communicate with each other',
      purpose: 'Enable users to build connections, share updates, and engage with their network',
      targetUsers: 'general users, content creators, communities',
      uiPreferences: {
        style: 'modern',
        colorScheme: 'dark',
        layout: 'dashboard',
        primaryColor: '#f97316',
      },
      technical: {
        needsAuth: true,
        authType: 'email',
        needsDatabase: true,
        dataModels: ['User', 'Post', 'Comment', 'Message'],
        needsAPI: false,
        needsFileUpload: true,
        needsRealtime: true,
      },
    },
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Productivity app with tasks, projects, and due dates',
    icon: Zap,
    category: 'Productivity',
    color: 'from-yellow-500/20 to-amber-500/20',
    features: ['Task Lists', 'Projects', 'Due Dates & Reminders', 'Priority Levels', 'Search & Filter'],
    concept: {
      name: 'Task Manager',
      description: 'A productivity tool for organizing tasks, managing projects, and tracking deadlines',
      purpose: 'Help individuals and teams stay organized and productive by managing tasks efficiently',
      targetUsers: 'freelancers, teams, project managers',
      uiPreferences: {
        style: 'modern',
        colorScheme: 'auto',
        layout: 'dashboard',
        primaryColor: '#eab308',
      },
      technical: {
        needsAuth: true,
        authType: 'email',
        needsDatabase: true,
        dataModels: ['Task', 'Project', 'User'],
        needsAPI: false,
        needsFileUpload: false,
        needsRealtime: true,
      },
    },
  },
  {
    id: 'portfolio-site',
    name: 'Portfolio Site',
    description: 'Showcase your work with projects, about, and contact',
    icon: Palette,
    category: 'Personal',
    color: 'from-indigo-500/20 to-violet-500/20',
    features: ['Project Gallery', 'About Page', 'Contact Form', 'Resume/CV', 'Dark Mode'],
    concept: {
      name: 'Portfolio Website',
      description: 'A professional portfolio to showcase projects, skills, and achievements',
      purpose: 'Present work to potential clients and employers in an engaging way',
      targetUsers: 'designers, developers, creatives',
      uiPreferences: {
        style: 'modern',
        colorScheme: 'dark',
        layout: 'single-page',
        primaryColor: '#6366f1',
      },
      technical: {
        needsAuth: false,
        needsDatabase: false,
        needsAPI: false,
        needsFileUpload: false,
        needsRealtime: false,
      },
    },
  },
];

interface QuickStartSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: QuickStartTemplate) => void;
  onSkip: () => void;
}

export const QuickStartSelector: React.FC<QuickStartSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSkip,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelect = (template: QuickStartTemplate) => {
    setSelectedTemplate(template.id);
    // Small delay for visual feedback
    setTimeout(() => {
      onSelect(template);
      setSelectedTemplate(null);
    }, 200);
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
              <Zap className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Quick Start</h2>
              <p className="text-sm text-neutral-400">
                Choose a template to get started faster
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            aria-label="Close quick start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_START_TEMPLATES.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;

              return (
                <button
                  key={template.id}
                  onClick={() => handleSelect(template)}
                  className={`group text-left glass-subtle rounded-xl p-5 transition-all border ${
                    isSelected
                      ? 'border-primary-500/50 scale-95'
                      : 'border-transparent hover:border-primary-500/30 hover:bg-white/5'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {template.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-neutral-800/60 text-xs text-neutral-400">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-4">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-neutral-500">
                        <div className="w-1 h-1 rounded-full bg-primary-400/50" />
                        {feature}
                      </div>
                    ))}
                    {template.features.length > 3 && (
                      <div className="text-xs text-neutral-600">
                        +{template.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-700/30">
                    <span className="text-xs text-primary-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Use template
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-700/30 bg-neutral-900/50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Sparkles className="w-4 h-4" />
            <span>Or start from scratch for full customization</span>
          </div>
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-lg glass-subtle hover:bg-white/5 text-neutral-300 hover:text-white transition-all text-sm font-medium"
          >
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
};

export { QUICK_START_TEMPLATES };
