import React, { useState, useMemo } from 'react';
import type { UIPreferences, AppConcept } from '../types/appConcept';
import { generateMockContent } from '../utils/mockContentGenerator';

interface LayoutPreviewProps {
  preferences: UIPreferences;
  concept?: Partial<AppConcept>;
  className?: string;
  onPreferenceChange?: (prefs: Partial<UIPreferences>) => void;
  onElementSelect?: (elementId: string | null) => void;
  selectedElement?: string | null;
}

type ViewMode = 'mobile' | 'tablet' | 'desktop';

export default function LayoutPreview({ 
  preferences, 
  concept, 
  className = '', 
  onPreferenceChange,
  onElementSelect,
  selectedElement 
}: LayoutPreviewProps) {
  const { style, colorScheme, layout, primaryColor } = preferences;
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  // Generate mock content based on concept
  const content = useMemo(() => {
    return generateMockContent(
      concept?.name || '',
      concept?.description || '',
      concept?.coreFeatures || [],
      concept?.purpose || ''
    );
  }, [concept]);

  // Derived styles
  const isDark = colorScheme === 'dark' || (colorScheme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Base Colors
  const bgColor = isDark ? 'bg-slate-900' : 'bg-white';
  const textColor = isDark ? 'text-slate-100' : 'text-slate-900';
  const secondaryText = isDark ? 'text-slate-400' : 'text-slate-500';
  const borderColor = isDark ? 'border-slate-700' : 'border-slate-200';
  const surfaceColor = isDark ? 'bg-slate-800' : 'bg-slate-50';
  const cardColor = isDark ? 'bg-slate-800' : 'bg-white';
  
  const accentColor = primaryColor || 'bg-blue-600';
  const accentText = primaryColor?.replace('bg-', 'text-') || 'text-blue-600';

  // Style Class Helper
  const getRadius = () => {
    switch (style) {
      case 'playful': return 'rounded-2xl';
      case 'professional': return 'rounded-sm';
      case 'modern': return 'rounded-xl';
      case 'minimalist': default: return 'rounded-lg';
    }
  };

  const getFontClass = () => {
    switch (style) {
      case 'playful': return 'font-sans';
      case 'professional': return 'font-serif'; 
      case 'minimalist': return 'font-light tracking-wide';
      case 'modern': default: return 'font-sans';
    }
  };

  // --- SELECTION WRAPPER ---
  const Selectable = ({ id, children, className = '' }: { id: string, children: React.ReactNode, className?: string }) => {
    const isSelected = selectedElement === id;
    
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onElementSelect?.(isSelected ? null : id);
        }}
        className={`relative transition-all duration-200 cursor-pointer ${className} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 z-10' : 'hover:ring-1 hover:ring-blue-500/50'}`}
      >
        {children}
        {isSelected && (
          <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-t font-medium flex items-center gap-1">
            <span>Selected: {id}</span>
          </div>
        )}
      </div>
    );
  };

  // --- SMART COMPONENTS ---

  const NavItem = ({ label, active = false }: { label: string, active?: boolean }) => (
    <div className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${active ? accentText : secondaryText} hover:${textColor}`}>
      {label}
    </div>
  );

  const Header = () => (
    <Selectable id="Header" className="w-full">
      <div className={`h-14 ${isDark ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-md flex items-center px-4 justify-between sticky top-0 z-10`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 ${getRadius()} ${accentColor} flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-${accentColor}/20`}>
            {(concept?.name || 'A').charAt(0)}
          </div>
          <div className="hidden md:flex gap-1">
            {content.navItems.map((item, i) => (
              <NavItem key={i} label={item} active={i === 0} />
            ))}
          </div>
        </div>
        <div className="flex gap-3 items-center">
           <div className={`hidden sm:block px-3 py-1.5 text-xs font-medium ${accentColor} text-white ${getRadius()}`}>
              New Project
           </div>
          <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} border ${borderColor}`} />
        </div>
      </div>
    </Selectable>
  );

  const Sidebar = () => (
    <Selectable id="Sidebar" className="h-full">
      <div className={`w-64 h-full shrink-0 ${isDark ? 'bg-slate-900 border-r border-slate-800' : 'bg-white border-r border-slate-200'} flex flex-col p-4 gap-1 hidden md:flex`}>
        <div className="mb-6 flex items-center gap-3 px-2">
           <div className={`w-8 h-8 ${getRadius()} ${accentColor}`} />
           <span className="font-bold text-lg tracking-tight">{concept?.name || 'App Name'}</span>
        </div>
        
        {content.navItems.map((item, i) => (
          <div key={i} className={`h-10 ${getRadius()} flex items-center px-3 gap-3 cursor-pointer transition-all ${i === 0 ? `${accentColor} text-white shadow-lg shadow-${accentColor}/20` : `hover:${surfaceColor} ${secondaryText}`}`}>
            <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-white/20' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <span className="text-sm font-medium">{item}</span>
          </div>
        ))}

        <div className="mt-auto">
          <div className={`p-4 ${getRadius()} ${isDark ? 'bg-slate-800' : 'bg-slate-50'} border ${borderColor}`}>
             <p className="text-xs font-medium mb-2">Pro Plan</p>
             <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div className={`h-full w-3/4 ${accentColor}`} />
             </div>
             <p className="text-[10px] text-slate-400">12 days left</p>
          </div>
        </div>
      </div>
    </Selectable>
  );

  const Hero = () => (
    <Selectable id="Hero Section" className="w-full mb-8">
      <div className={`relative overflow-hidden ${getRadius()} ${isDark ? 'bg-slate-800' : 'bg-slate-50'} border ${borderColor} p-8 md:p-12 flex flex-col items-center text-center gap-6`}>
         {/* Background Decor */}
         <div className={`absolute top-0 right-0 w-64 h-64 ${accentColor} opacity-5 blur-[80px] rounded-full pointer-events-none`} />
         <div className={`absolute bottom-0 left-0 w-48 h-48 ${accentColor} opacity-5 blur-[60px] rounded-full pointer-events-none`} />
         
         <h1 className="text-3xl md:text-4xl font-bold max-w-lg relative z-10 leading-tight">
            {content.hero.title}
         </h1>
         <p className={`${secondaryText} max-w-md text-lg relative z-10`}>
            {content.hero.subtitle}
         </p>
         <button className={`px-8 py-3 ${getRadius()} ${accentColor} text-white font-medium shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-0.5 relative z-10`}>
            {content.hero.cta}
         </button>
      </div>
    </Selectable>
  );

  const StatsRow = () => (
    <Selectable id="Stats Grid" className="w-full mb-8">
       <div className="grid grid-cols-3 gap-4">
          {content.stats.map((stat, i) => (
             <div key={i} className={`p-4 ${getRadius()} ${cardColor} border ${borderColor} flex flex-col gap-1`}>
                <span className={`text-xs font-medium ${secondaryText} uppercase tracking-wider`}>{stat.label}</span>
                <span className="text-2xl font-bold">{stat.value}</span>
             </div>
          ))}
       </div>
    </Selectable>
  );

  const CardGrid = () => (
    <Selectable id="Content Grid" className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.cards.map((card, i) => (
          <div key={i} className={`group ${getRadius()} ${cardColor} border ${borderColor} p-5 flex flex-col gap-3 hover:border-${accentColor.replace('bg-', '')}-400 transition-colors cursor-pointer`}>
            <div className="flex justify-between items-start">
               <div className={`w-10 h-10 ${getRadius()} ${isDark ? 'bg-slate-700' : 'bg-slate-100'} group-hover:${accentColor} group-hover:text-white transition-colors flex items-center justify-center`}>
                  <span className="text-lg">⚡</span>
               </div>
               <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} ${secondaryText}`}>
                  {card.tag}
               </span>
            </div>
            <div>
               <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
               <p className={`text-sm ${secondaryText}`}>{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </Selectable>
  );

  // --- LAYOUT RENDERERS ---

  const renderLayout = () => {
    const ContentArea = () => (
      <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin">
        {layout === 'dashboard' && <h2 className="text-2xl font-bold mb-6">Overview</h2>}
        
        {layout !== 'dashboard' && <Hero />}
        
        <StatsRow />
        
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold">Recent Activity</h3>
           <span className={`text-sm ${accentText} cursor-pointer`}>View All</span>
        </div>
        <CardGrid />

        {/* List Section */}
        <div className={`mt-8 ${getRadius()} border ${borderColor} overflow-hidden`}>
           {content.listItems.map((item, i) => (
              <div key={i} className={`p-4 ${cardColor} flex items-center justify-between border-b ${borderColor} last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : item.status === 'pending' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                    <span className="font-medium">{item.title}</span>
                 </div>
                 <span className={`text-xs ${secondaryText}`}>{item.meta}</span>
              </div>
           ))}
        </div>
      </div>
    );

    switch (layout) {
      case 'dashboard':
        return (
          <div className="flex h-full">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
              <Header />
              <ContentArea />
            </div>
          </div>
        );
      
      case 'multi-page':
        return (
          <div className="flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
            <Header />
            <ContentArea />
          </div>
        );

      case 'single-page':
      default:
        return (
          <div className="flex flex-col h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 scrollbar-thin">
             {/* Transparent Header */}
             <div className={`absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-10`}>
                <span className="font-bold text-xl tracking-tight">{concept?.name || 'App'}</span>
                <div className={`px-4 py-2 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-md flex gap-4`}>
                   {content.navItems.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-xs font-medium opacity-80 hover:opacity-100 cursor-pointer">{item}</span>
                   ))}
                </div>
                <button className={`px-4 py-1.5 rounded-full ${accentColor} text-white text-xs font-medium`}>
                   Sign In
                </button>
             </div>

             <ContentArea />
          </div>
        );
    }
  };

  // --- TOOLBAR & FRAME ---

  const PREVIEW_SIZES = {
    mobile: 'w-[375px] h-[700px]',
    tablet: 'w-[768px] h-[900px]',
    desktop: 'w-full h-full'
  };

  return (
    <div className={`w-full h-full flex flex-col ${className} bg-slate-950 relative`} onClick={() => onElementSelect?.(null)}>
      {/* Top Toolbar */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-slate-900 shrink-0 z-20">
         <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-white/5">
            {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
               <button
                  key={mode}
                  onClick={(e) => { e.stopPropagation(); setViewMode(mode); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === mode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
               >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
               </button>
            ))}
         </div>
         
         {onPreferenceChange && (
            <div className="flex items-center gap-2">
               <button 
                 onClick={(e) => { e.stopPropagation(); onPreferenceChange({ colorScheme: isDark ? 'light' : 'dark' }); }} 
                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-white/5" 
                 title="Toggle Dark Mode"
               >
                  {isDark ? '🌙' : '☀️'}
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); onPreferenceChange({ style: style === 'modern' ? 'playful' : 'modern' }); }} 
                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-white/5" 
                 title="Cycle Style"
               >
                  🎨
               </button>
            </div>
         )}
      </div>

      {/* Preview Canvas */}
      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
         <div className={`transition-all duration-500 ease-in-out shadow-2xl relative ${PREVIEW_SIZES[viewMode]} ${viewMode !== 'desktop' ? 'rounded-[3rem] border-[8px] border-slate-800' : ''} overflow-hidden`}>
            
            {/* Internal App Content */}
            <div className={`w-full h-full ${bgColor} ${textColor} ${getFontClass()} transition-colors duration-300 relative overflow-hidden`}>
               {renderLayout()}
               
               {/* Floating Badge (Only on desktop to avoid clutter) */}
               {viewMode === 'desktop' && (
                 <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[10px] border border-white/20 pointer-events-none z-50">
                   {style} • {layout} • {colorScheme}
                 </div>
               )}
            </div>

            {/* Mobile Notch Simulation */}
            {viewMode === 'mobile' && (
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-50" />
            )}
         </div>
      </div>
    </div>
  );
}
