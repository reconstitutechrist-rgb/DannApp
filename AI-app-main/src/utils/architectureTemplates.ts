/**
 * Architecture Templates for Complex Applications
 * Provides structured templates for common app types with proper folder organization
 */

export interface FileStructure {
  path: string;
  description: string;
  type: 'directory' | 'file';
  required: boolean;
}

export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  category: 'saas' | 'ecommerce' | 'content' | 'social' | 'business' | 'general';
  complexity: 'MEDIUM' | 'COMPLEX' | 'VERY_COMPLEX';
  recommendedFor: string[];
  structure: FileStructure[];
  technologies: string[];
  features: string[];
  estimatedFiles: number;
  phases?: {
    number: number;
    name: string;
    description: string;
    files: string[];
  }[];
}

export const ARCHITECTURE_TEMPLATES: Record<string, ArchitectureTemplate> = {
  'saas-dashboard': {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Enterprise dashboard with authentication, multi-user support, and data visualization',
    category: 'saas',
    complexity: 'COMPLEX',
    recommendedFor: [
      'admin panels',
      'dashboards with 5+ features',
      'multi-user applications',
      'data-heavy apps',
      'analytics platforms',
      'management systems'
    ],
    structure: [
      { path: 'src/app/', description: 'Next.js App Router pages', type: 'directory', required: true },
      { path: 'src/app/(auth)/', description: 'Authentication route group', type: 'directory', required: true },
      { path: 'src/app/(auth)/login/page.tsx', description: 'Login page', type: 'file', required: true },
      { path: 'src/app/(auth)/signup/page.tsx', description: 'Signup page', type: 'file', required: false },
      { path: 'src/app/(dashboard)/', description: 'Dashboard route group', type: 'directory', required: true },
      { path: 'src/app/(dashboard)/layout.tsx', description: 'Dashboard layout with sidebar', type: 'file', required: true },
      { path: 'src/app/(dashboard)/page.tsx', description: 'Main dashboard page', type: 'file', required: true },
      { path: 'src/app/api/', description: 'API routes', type: 'directory', required: true },
      { path: 'src/app/api/auth/[...nextauth]/route.ts', description: 'NextAuth configuration', type: 'file', required: false },
      { path: 'src/components/', description: 'Reusable UI components', type: 'directory', required: true },
      { path: 'src/components/layout/', description: 'Layout components', type: 'directory', required: true },
      { path: 'src/components/layout/Header.tsx', description: 'Header component', type: 'file', required: true },
      { path: 'src/components/layout/Sidebar.tsx', description: 'Sidebar navigation', type: 'file', required: true },
      { path: 'src/components/layout/Footer.tsx', description: 'Footer component', type: 'file', required: false },
      { path: 'src/components/dashboard/', description: 'Dashboard-specific components', type: 'directory', required: true },
      { path: 'src/lib/', description: 'Utility functions and helpers', type: 'directory', required: true },
      { path: 'src/lib/db.ts', description: 'Database connection', type: 'file', required: false },
      { path: 'src/lib/auth.ts', description: 'Authentication utilities', type: 'file', required: true },
      { path: 'src/hooks/', description: 'Custom React hooks', type: 'directory', required: true },
      { path: 'src/types/', description: 'TypeScript type definitions', type: 'directory', required: true },
      { path: 'src/stores/', description: 'State management (Context or Zustand)', type: 'directory', required: false },
      { path: 'prisma/schema.prisma', description: 'Database schema', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'NextAuth.js', 'Prisma (optional)', 'React Query (optional)'],
    features: ['Authentication', 'User Management', 'Dashboard Layout', 'Data Visualization', 'API Routes', 'Database Integration'],
    estimatedFiles: 15,
    phases: [
      {
        number: 1,
        name: 'Core Structure & Layout',
        description: 'Basic UI structure, routing, and layout components',
        files: ['app/layout.tsx', 'app/page.tsx', 'components/layout/Header.tsx', 'components/layout/Sidebar.tsx']
      },
      {
        number: 2,
        name: 'Authentication System',
        description: 'User login, signup, and session management',
        files: ['app/(auth)/login/page.tsx', 'lib/auth.ts', 'api/auth/[...nextauth]/route.ts']
      },
      {
        number: 3,
        name: 'Dashboard Features',
        description: 'Main dashboard functionality and widgets',
        files: ['app/(dashboard)/page.tsx', 'components/dashboard/', 'hooks/']
      },
      {
        number: 4,
        name: 'Polish & Optimization',
        description: 'Styling, loading states, error handling',
        files: ['types/', 'lib/utils.ts']
      }
    ]
  },

  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce Platform',
    description: 'Full e-commerce site with products, cart, checkout, and payment processing',
    category: 'ecommerce',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'online stores',
      'product catalogs',
      'shopping carts',
      'payment processing',
      'inventory management',
      'marketplace platforms'
    ],
    structure: [
      { path: 'src/app/', description: 'Next.js pages', type: 'directory', required: true },
      { path: 'src/app/products/', description: 'Product pages', type: 'directory', required: true },
      { path: 'src/app/products/[id]/page.tsx', description: 'Product detail page', type: 'file', required: true },
      { path: 'src/app/cart/', description: 'Shopping cart', type: 'directory', required: true },
      { path: 'src/app/cart/page.tsx', description: 'Cart page', type: 'file', required: true },
      { path: 'src/app/checkout/', description: 'Checkout flow', type: 'directory', required: true },
      { path: 'src/app/checkout/page.tsx', description: 'Checkout page', type: 'file', required: true },
      { path: 'src/app/api/products/', description: 'Product API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/checkout/', description: 'Checkout API endpoints', type: 'directory', required: true },
      { path: 'src/components/product/', description: 'Product components', type: 'directory', required: true },
      { path: 'src/components/product/ProductCard.tsx', description: 'Product card component', type: 'file', required: true },
      { path: 'src/components/product/ProductGrid.tsx', description: 'Product grid layout', type: 'file', required: true },
      { path: 'src/components/cart/', description: 'Cart components', type: 'directory', required: true },
      { path: 'src/components/cart/CartItem.tsx', description: 'Cart item component', type: 'file', required: true },
      { path: 'src/lib/stripe.ts', description: 'Stripe payment integration', type: 'file', required: false },
      { path: 'src/lib/inventory.ts', description: 'Inventory management', type: 'file', required: false },
      { path: 'src/stores/cartStore.ts', description: 'Cart state management (Zustand)', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Product, Order, User models', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Stripe', 'Prisma'],
    features: ['Product Catalog', 'Shopping Cart', 'Checkout Flow', 'Payment Processing', 'Order Management', 'Inventory Tracking'],
    estimatedFiles: 20,
    phases: [
      {
        number: 1,
        name: 'Product Catalog',
        description: 'Product listing, detail pages, and search',
        files: ['app/products/', 'components/product/', 'api/products/']
      },
      {
        number: 2,
        name: 'Shopping Cart',
        description: 'Cart functionality and state management',
        files: ['stores/cartStore.ts', 'components/cart/', 'app/cart/']
      },
      {
        number: 3,
        name: 'Checkout & Payments',
        description: 'Checkout flow and Stripe integration',
        files: ['app/checkout/', 'lib/stripe.ts', 'api/checkout/']
      },
      {
        number: 4,
        name: 'Orders & Polish',
        description: 'Order tracking, confirmation, and UI polish',
        files: ['app/orders/', 'types/', 'lib/']
      }
    ]
  },

  'blog-cms': {
    id: 'blog-cms',
    name: 'Blog with CMS',
    description: 'Content-focused blog with markdown support, categories, and admin panel',
    category: 'content',
    complexity: 'MEDIUM',
    recommendedFor: [
      'blogs',
      'documentation sites',
      'content platforms',
      'news sites',
      'portfolio sites',
      'marketing sites'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/blog/', description: 'Blog pages', type: 'directory', required: true },
      { path: 'src/app/blog/[slug]/page.tsx', description: 'Blog post page', type: 'file', required: true },
      { path: 'src/app/admin/', description: 'Admin panel', type: 'directory', required: false },
      { path: 'src/app/api/posts/', description: 'Post API endpoints', type: 'directory', required: true },
      { path: 'src/components/blog/', description: 'Blog components', type: 'directory', required: true },
      { path: 'src/components/blog/PostCard.tsx', description: 'Post card component', type: 'file', required: true },
      { path: 'src/components/blog/PostGrid.tsx', description: 'Post grid layout', type: 'file', required: true },
      { path: 'src/components/blog/MDXContent.tsx', description: 'Markdown renderer', type: 'file', required: true },
      { path: 'src/lib/posts.ts', description: 'Post fetching utilities', type: 'file', required: true },
      { path: 'src/lib/mdx.ts', description: 'MDX processing', type: 'file', required: false },
      { path: 'content/posts/', description: 'Blog post markdown files', type: 'directory', required: true },
      { path: 'prisma/schema.prisma', description: 'Post, Category, Author models', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Prisma (optional)'],
    features: ['Blog Posts', 'Categories', 'Tags', 'Search', 'RSS Feed', 'Admin Panel (optional)', 'Markdown Support'],
    estimatedFiles: 12,
    phases: [
      {
        number: 1,
        name: 'Blog Structure',
        description: 'Basic blog pages and post listing',
        files: ['app/blog/', 'components/blog/', 'lib/posts.ts']
      },
      {
        number: 2,
        name: 'Content Rendering',
        description: 'Markdown/MDX rendering and styling',
        files: ['components/blog/MDXContent.tsx', 'lib/mdx.ts']
      },
      {
        number: 3,
        name: 'Features & Admin',
        description: 'Categories, search, and optional admin',
        files: ['app/admin/', 'api/posts/', 'prisma/']
      }
    ]
  },

  'social-platform': {
    id: 'social-platform',
    name: 'Social Platform',
    description: 'Social media app with posts, comments, likes, and real-time updates',
    category: 'social',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'social media apps',
      'community platforms',
      'forums',
      'discussion boards',
      'networking sites',
      'collaboration tools'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/feed/page.tsx', description: 'Main feed page', type: 'file', required: true },
      { path: 'src/app/profile/[id]/page.tsx', description: 'User profile page', type: 'file', required: true },
      { path: 'src/app/post/[id]/page.tsx', description: 'Post detail page', type: 'file', required: true },
      { path: 'src/app/api/posts/', description: 'Post API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/comments/', description: 'Comment API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/likes/', description: 'Like API endpoints', type: 'directory', required: true },
      { path: 'src/components/feed/', description: 'Feed components', type: 'directory', required: true },
      { path: 'src/components/feed/Post.tsx', description: 'Post component', type: 'file', required: true },
      { path: 'src/components/feed/Comment.tsx', description: 'Comment component', type: 'file', required: true },
      { path: 'src/components/profile/', description: 'Profile components', type: 'directory', required: true },
      { path: 'src/lib/realtime.ts', description: 'Real-time updates (Pusher/Socket.io)', type: 'file', required: false },
      { path: 'src/stores/feedStore.ts', description: 'Feed state management', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'User, Post, Comment, Like models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Zustand', 'Pusher/Socket.io (optional)'],
    features: ['User Profiles', 'Posts', 'Comments', 'Likes', 'Following', 'Real-time Updates', 'Feed Algorithm'],
    estimatedFiles: 18,
    phases: [
      {
        number: 1,
        name: 'Core Social Features',
        description: 'Posts, comments, likes basic functionality',
        files: ['app/feed/', 'components/feed/', 'api/posts/', 'api/comments/']
      },
      {
        number: 2,
        name: 'User Profiles',
        description: 'User profiles and following system',
        files: ['app/profile/', 'components/profile/', 'api/users/']
      },
      {
        number: 3,
        name: 'Real-time & Advanced',
        description: 'Real-time updates and feed algorithm',
        files: ['lib/realtime.ts', 'stores/', 'api/feed/']
      }
    ]
  },

  'business-app': {
    id: 'business-app',
    name: 'Business Application',
    description: 'General business app with CRUD operations, forms, and data management',
    category: 'business',
    complexity: 'MEDIUM',
    recommendedFor: [
      'CRM systems',
      'project management',
      'inventory management',
      'booking systems',
      'ticketing systems',
      'internal tools'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/dashboard/page.tsx', description: 'Main dashboard', type: 'file', required: true },
      { path: 'src/app/items/', description: 'Item management pages', type: 'directory', required: true },
      { path: 'src/app/items/page.tsx', description: 'Items list page', type: 'file', required: true },
      { path: 'src/app/items/[id]/page.tsx', description: 'Item detail/edit page', type: 'file', required: true },
      { path: 'src/app/api/items/', description: 'CRUD API endpoints', type: 'directory', required: true },
      { path: 'src/components/forms/', description: 'Form components', type: 'directory', required: true },
      { path: 'src/components/tables/', description: 'Table components', type: 'directory', required: true },
      { path: 'src/lib/validation.ts', description: 'Form validation schemas', type: 'file', required: true },
      { path: 'src/lib/api.ts', description: 'API client utilities', type: 'file', required: true },
      { path: 'src/hooks/useItems.ts', description: 'Data fetching hooks', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Business data models', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Hook Form', 'Zod', 'Prisma'],
    features: ['CRUD Operations', 'Forms & Validation', 'Data Tables', 'Search & Filter', 'Export/Import', 'Dashboard'],
    estimatedFiles: 12,
    phases: [
      {
        number: 1,
        name: 'Data Structure',
        description: 'Database models and API endpoints',
        files: ['prisma/', 'api/items/', 'lib/api.ts']
      },
      {
        number: 2,
        name: 'UI & Forms',
        description: 'List view, forms, and validation',
        files: ['app/items/', 'components/forms/', 'lib/validation.ts']
      },
      {
        number: 3,
        name: 'Dashboard & Features',
        description: 'Dashboard, search, filters, export',
        files: ['app/dashboard/', 'components/tables/', 'hooks/']
      }
    ]
  },

  'landing-page': {
    id: 'landing-page',
    name: 'Landing Page / Marketing Site',
    description: 'Marketing-focused landing page with sections, forms, and conversions',
    category: 'content',
    complexity: 'MEDIUM',
    recommendedFor: [
      'landing pages',
      'marketing sites',
      'product launches',
      'portfolios',
      'agency sites',
      'SaaS marketing'
    ],
    structure: [
      { path: 'src/app/page.tsx', description: 'Main landing page', type: 'file', required: true },
      { path: 'src/app/pricing/page.tsx', description: 'Pricing page', type: 'file', required: false },
      { path: 'src/app/api/contact/route.ts', description: 'Contact form endpoint', type: 'file', required: true },
      { path: 'src/components/sections/', description: 'Landing page sections', type: 'directory', required: true },
      { path: 'src/components/sections/Hero.tsx', description: 'Hero section', type: 'file', required: true },
      { path: 'src/components/sections/Features.tsx', description: 'Features section', type: 'file', required: true },
      { path: 'src/components/sections/Pricing.tsx', description: 'Pricing section', type: 'file', required: false },
      { path: 'src/components/sections/FAQ.tsx', description: 'FAQ section', type: 'file', required: false },
      { path: 'src/components/sections/CTA.tsx', description: 'Call-to-action section', type: 'file', required: true },
      { path: 'src/components/forms/ContactForm.tsx', description: 'Contact form', type: 'file', required: true },
      { path: 'src/lib/analytics.ts', description: 'Analytics tracking', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion (optional)', 'React Hook Form'],
    features: ['Hero Section', 'Features', 'Pricing', 'Testimonials', 'FAQ', 'Contact Form', 'Analytics'],
    estimatedFiles: 10,
    phases: [
      {
        number: 1,
        name: 'Core Sections',
        description: 'Hero, features, and basic structure',
        files: ['app/page.tsx', 'components/sections/Hero.tsx', 'components/sections/Features.tsx']
      },
      {
        number: 2,
        name: 'Conversion Elements',
        description: 'Forms, pricing, and CTAs',
        files: ['components/sections/Pricing.tsx', 'components/sections/CTA.tsx', 'components/forms/']
      },
      {
        number: 3,
        name: 'Polish & Analytics',
        description: 'Animations, analytics, and optimization',
        files: ['lib/analytics.ts', 'app/pricing/']
      }
    ]
  },

  'realtime-collab': {
    id: 'realtime-collab',
    name: 'Real-time Collaboration App',
    description: 'Google Docs-style collaborative app with real-time editing, presence, and cursor tracking',
    category: 'business',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'collaborative editors',
      'real-time documents',
      'team collaboration',
      'shared workspaces',
      'live coding',
      'design collaboration'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/document/[id]/page.tsx', description: 'Document editor page', type: 'file', required: true },
      { path: 'src/app/api/documents/', description: 'Document API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/collaboration/', description: 'Collaboration API', type: 'directory', required: true },
      { path: 'src/components/editor/', description: 'Editor components', type: 'directory', required: true },
      { path: 'src/components/editor/CollaborativeEditor.tsx', description: 'Main editor component', type: 'file', required: true },
      { path: 'src/components/editor/Toolbar.tsx', description: 'Editor toolbar', type: 'file', required: true },
      { path: 'src/components/editor/UserCursors.tsx', description: 'Real-time cursor tracking', type: 'file', required: true },
      { path: 'src/components/presence/', description: 'Presence components', type: 'directory', required: true },
      { path: 'src/components/presence/ActiveUsers.tsx', description: 'Active users list', type: 'file', required: true },
      { path: 'src/lib/yjs.ts', description: 'Yjs CRDT integration', type: 'file', required: true },
      { path: 'src/lib/websocket.ts', description: 'WebSocket connection', type: 'file', required: true },
      { path: 'src/stores/collaborationStore.ts', description: 'Collaboration state', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Document, User, Permission models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Yjs/Automerge', 'Socket.io/Pusher', 'Tiptap/Slate', 'Zustand'],
    features: ['Real-time Editing', 'Cursor Tracking', 'User Presence', 'Comments', 'Version History', 'Permissions', 'Offline Support'],
    estimatedFiles: 22,
    phases: [
      {
        number: 1,
        name: 'Editor Foundation',
        description: 'Basic editor with rich text capabilities',
        files: ['components/editor/CollaborativeEditor.tsx', 'components/editor/Toolbar.tsx']
      },
      {
        number: 2,
        name: 'Real-time Sync',
        description: 'Yjs integration and WebSocket setup',
        files: ['lib/yjs.ts', 'lib/websocket.ts', 'stores/collaborationStore.ts']
      },
      {
        number: 3,
        name: 'Presence & Cursors',
        description: 'User presence and cursor tracking',
        files: ['components/editor/UserCursors.tsx', 'components/presence/']
      },
      {
        number: 4,
        name: 'Advanced Features',
        description: 'Comments, version history, permissions',
        files: ['api/collaboration/', 'prisma/']
      }
    ]
  },

  'analytics-dashboard': {
    id: 'analytics-dashboard',
    name: 'Analytics & BI Dashboard',
    description: 'Data visualization platform with charts, graphs, and business intelligence features',
    category: 'business',
    complexity: 'COMPLEX',
    recommendedFor: [
      'analytics platforms',
      'business intelligence',
      'data visualization',
      'reporting tools',
      'metrics dashboards',
      'KPI tracking'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/dashboard/page.tsx', description: 'Main analytics dashboard', type: 'file', required: true },
      { path: 'src/app/reports/page.tsx', description: 'Reports page', type: 'file', required: true },
      { path: 'src/app/api/analytics/', description: 'Analytics API endpoints', type: 'directory', required: true },
      { path: 'src/components/charts/', description: 'Chart components', type: 'directory', required: true },
      { path: 'src/components/charts/LineChart.tsx', description: 'Line chart component', type: 'file', required: true },
      { path: 'src/components/charts/BarChart.tsx', description: 'Bar chart component', type: 'file', required: true },
      { path: 'src/components/charts/PieChart.tsx', description: 'Pie chart component', type: 'file', required: true },
      { path: 'src/components/metrics/', description: 'Metric components', type: 'directory', required: true },
      { path: 'src/components/metrics/MetricCard.tsx', description: 'Metric card component', type: 'file', required: true },
      { path: 'src/components/filters/', description: 'Filter components', type: 'directory', required: true },
      { path: 'src/components/filters/DateRangePicker.tsx', description: 'Date range filter', type: 'file', required: true },
      { path: 'src/lib/analytics.ts', description: 'Analytics data processing', type: 'file', required: true },
      { path: 'src/lib/export.ts', description: 'Export to CSV/PDF', type: 'file', required: false },
      { path: 'src/hooks/useAnalytics.ts', description: 'Analytics data hooks', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Analytics data models', type: 'file', required: false }
    ],
    technologies: ['Next.js', 'TypeScript', 'Recharts/Chart.js', 'D3.js (optional)', 'React Query', 'Date-fns'],
    features: ['Interactive Charts', 'KPI Metrics', 'Date Filtering', 'Export Reports', 'Custom Dashboards', 'Real-time Data'],
    estimatedFiles: 18,
    phases: [
      {
        number: 1,
        name: 'Data Layer',
        description: 'Analytics API and data processing',
        files: ['api/analytics/', 'lib/analytics.ts', 'hooks/useAnalytics.ts']
      },
      {
        number: 2,
        name: 'Charts & Visualizations',
        description: 'Chart components and metric cards',
        files: ['components/charts/', 'components/metrics/']
      },
      {
        number: 3,
        name: 'Filtering & Interactivity',
        description: 'Filters, drill-downs, and dashboard customization',
        files: ['components/filters/', 'app/dashboard/', 'app/reports/']
      },
      {
        number: 4,
        name: 'Export & Advanced',
        description: 'Export functionality and advanced features',
        files: ['lib/export.ts', 'prisma/']
      }
    ]
  },

  'messaging-chat': {
    id: 'messaging-chat',
    name: 'Messaging & Chat App',
    description: 'Real-time messaging platform with channels, direct messages, and file sharing',
    category: 'social',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'chat applications',
      'team messaging',
      'instant messaging',
      'slack-like apps',
      'customer support chat',
      'community chat'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/chat/page.tsx', description: 'Main chat interface', type: 'file', required: true },
      { path: 'src/app/channel/[id]/page.tsx', description: 'Channel page', type: 'file', required: true },
      { path: 'src/app/api/messages/', description: 'Message API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/channels/', description: 'Channel API endpoints', type: 'directory', required: true },
      { path: 'src/components/chat/', description: 'Chat components', type: 'directory', required: true },
      { path: 'src/components/chat/MessageList.tsx', description: 'Message list component', type: 'file', required: true },
      { path: 'src/components/chat/MessageInput.tsx', description: 'Message input component', type: 'file', required: true },
      { path: 'src/components/chat/ChannelSidebar.tsx', description: 'Channel sidebar', type: 'file', required: true },
      { path: 'src/components/chat/UserPresence.tsx', description: 'User online status', type: 'file', required: true },
      { path: 'src/components/chat/FileUpload.tsx', description: 'File upload component', type: 'file', required: true },
      { path: 'src/lib/websocket.ts', description: 'WebSocket/Socket.io setup', type: 'file', required: true },
      { path: 'src/lib/notifications.ts', description: 'Push notifications', type: 'file', required: false },
      { path: 'src/stores/chatStore.ts', description: 'Chat state management', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Message, Channel, User models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Socket.io/Pusher', 'Zustand', 'Prisma', 'Uploadthing'],
    features: ['Real-time Messages', 'Channels', 'Direct Messages', 'File Sharing', 'Typing Indicators', 'Read Receipts', 'Notifications'],
    estimatedFiles: 20,
    phases: [
      {
        number: 1,
        name: 'Message System',
        description: 'Basic messaging and database schema',
        files: ['prisma/', 'api/messages/', 'components/chat/MessageList.tsx']
      },
      {
        number: 2,
        name: 'Real-time Features',
        description: 'WebSocket integration and live updates',
        files: ['lib/websocket.ts', 'stores/chatStore.ts', 'components/chat/MessageInput.tsx']
      },
      {
        number: 3,
        name: 'Channels & Presence',
        description: 'Channel management and user presence',
        files: ['api/channels/', 'components/chat/ChannelSidebar.tsx', 'components/chat/UserPresence.tsx']
      },
      {
        number: 4,
        name: 'File Sharing & Polish',
        description: 'File uploads, notifications, and UI polish',
        files: ['components/chat/FileUpload.tsx', 'lib/notifications.ts']
      }
    ]
  },

  'calendar-scheduling': {
    id: 'calendar-scheduling',
    name: 'Calendar & Scheduling App',
    description: 'Event management and scheduling system with calendar views and booking functionality',
    category: 'business',
    complexity: 'COMPLEX',
    recommendedFor: [
      'calendar apps',
      'scheduling systems',
      'booking platforms',
      'appointment systems',
      'event management',
      'time tracking'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/calendar/page.tsx', description: 'Calendar view page', type: 'file', required: true },
      { path: 'src/app/events/[id]/page.tsx', description: 'Event detail page', type: 'file', required: true },
      { path: 'src/app/api/events/', description: 'Event API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/availability/', description: 'Availability API', type: 'directory', required: false },
      { path: 'src/components/calendar/', description: 'Calendar components', type: 'directory', required: true },
      { path: 'src/components/calendar/CalendarGrid.tsx', description: 'Calendar grid component', type: 'file', required: true },
      { path: 'src/components/calendar/EventCard.tsx', description: 'Event card component', type: 'file', required: true },
      { path: 'src/components/calendar/EventModal.tsx', description: 'Event creation modal', type: 'file', required: true },
      { path: 'src/components/calendar/TimeSlotPicker.tsx', description: 'Time slot picker', type: 'file', required: true },
      { path: 'src/lib/calendar.ts', description: 'Calendar utilities', type: 'file', required: true },
      { path: 'src/lib/timezone.ts', description: 'Timezone handling', type: 'file', required: false },
      { path: 'src/lib/ical.ts', description: 'iCal export/import', type: 'file', required: false },
      { path: 'src/stores/calendarStore.ts', description: 'Calendar state', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Event, Booking, User models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Date-fns/Day.js', 'React Big Calendar', 'Zustand', 'Prisma'],
    features: ['Calendar Views', 'Event Creation', 'Drag & Drop', 'Recurring Events', 'Reminders', 'Timezone Support', 'iCal Export'],
    estimatedFiles: 16,
    phases: [
      {
        number: 1,
        name: 'Calendar Foundation',
        description: 'Calendar grid and basic event display',
        files: ['components/calendar/CalendarGrid.tsx', 'lib/calendar.ts', 'stores/calendarStore.ts']
      },
      {
        number: 2,
        name: 'Event Management',
        description: 'Event creation, editing, and deletion',
        files: ['components/calendar/EventModal.tsx', 'api/events/', 'prisma/']
      },
      {
        number: 3,
        name: 'Scheduling Features',
        description: 'Time slot picking and availability',
        files: ['components/calendar/TimeSlotPicker.tsx', 'api/availability/', 'lib/timezone.ts']
      },
      {
        number: 4,
        name: 'Advanced Features',
        description: 'Recurring events, iCal, drag & drop',
        files: ['lib/ical.ts', 'app/events/']
      }
    ]
  },

  'file-management': {
    id: 'file-management',
    name: 'File Management / Cloud Drive',
    description: 'Cloud storage and file management system with folders, sharing, and search',
    category: 'business',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'cloud storage',
      'file sharing',
      'document management',
      'media library',
      'team drives',
      'backup solutions'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/drive/page.tsx', description: 'Main drive view', type: 'file', required: true },
      { path: 'src/app/folder/[id]/page.tsx', description: 'Folder view page', type: 'file', required: true },
      { path: 'src/app/shared/page.tsx', description: 'Shared files page', type: 'file', required: false },
      { path: 'src/app/api/files/', description: 'File API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/folders/', description: 'Folder API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/share/', description: 'Sharing API endpoints', type: 'directory', required: true },
      { path: 'src/components/drive/', description: 'Drive components', type: 'directory', required: true },
      { path: 'src/components/drive/FileList.tsx', description: 'File list component', type: 'file', required: true },
      { path: 'src/components/drive/FileUpload.tsx', description: 'File upload component', type: 'file', required: true },
      { path: 'src/components/drive/FolderTree.tsx', description: 'Folder tree navigation', type: 'file', required: true },
      { path: 'src/components/drive/FilePreview.tsx', description: 'File preview modal', type: 'file', required: true },
      { path: 'src/components/drive/ShareModal.tsx', description: 'File sharing modal', type: 'file', required: true },
      { path: 'src/lib/storage.ts', description: 'S3/Cloud storage integration', type: 'file', required: true },
      { path: 'src/lib/search.ts', description: 'File search functionality', type: 'file', required: false },
      { path: 'src/stores/driveStore.ts', description: 'Drive state management', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'File, Folder, Permission models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'AWS S3/Uploadthing', 'Zustand', 'Prisma', 'React Dropzone'],
    features: ['File Upload', 'Folder Structure', 'File Preview', 'Sharing & Permissions', 'Search', 'Versioning', 'Storage Quotas'],
    estimatedFiles: 20,
    phases: [
      {
        number: 1,
        name: 'File Structure',
        description: 'File and folder management basics',
        files: ['prisma/', 'api/files/', 'api/folders/', 'components/drive/FileList.tsx']
      },
      {
        number: 2,
        name: 'Upload & Storage',
        description: 'File upload and cloud storage integration',
        files: ['lib/storage.ts', 'components/drive/FileUpload.tsx']
      },
      {
        number: 3,
        name: 'Navigation & Preview',
        description: 'Folder tree and file preview',
        files: ['components/drive/FolderTree.tsx', 'components/drive/FilePreview.tsx']
      },
      {
        number: 4,
        name: 'Sharing & Search',
        description: 'File sharing, permissions, and search',
        files: ['api/share/', 'components/drive/ShareModal.tsx', 'lib/search.ts']
      }
    ]
  },

  'form-builder': {
    id: 'form-builder',
    name: 'Form Builder / Survey Tool',
    description: 'Drag-and-drop form builder with various field types and response collection',
    category: 'business',
    complexity: 'COMPLEX',
    recommendedFor: [
      'form builders',
      'survey tools',
      'quiz platforms',
      'feedback collection',
      'registration forms',
      'data collection'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/builder/page.tsx', description: 'Form builder page', type: 'file', required: true },
      { path: 'src/app/form/[id]/page.tsx', description: 'Form submission page', type: 'file', required: true },
      { path: 'src/app/responses/[id]/page.tsx', description: 'Responses page', type: 'file', required: true },
      { path: 'src/app/api/forms/', description: 'Form API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/responses/', description: 'Response API endpoints', type: 'directory', required: true },
      { path: 'src/components/builder/', description: 'Builder components', type: 'directory', required: true },
      { path: 'src/components/builder/FieldEditor.tsx', description: 'Field editor component', type: 'file', required: true },
      { path: 'src/components/builder/FieldPalette.tsx', description: 'Field type palette', type: 'file', required: true },
      { path: 'src/components/builder/FormPreview.tsx', description: 'Form preview component', type: 'file', required: true },
      { path: 'src/components/fields/', description: 'Form field components', type: 'directory', required: true },
      { path: 'src/components/fields/TextField.tsx', description: 'Text input field', type: 'file', required: true },
      { path: 'src/components/fields/MultipleChoice.tsx', description: 'Multiple choice field', type: 'file', required: true },
      { path: 'src/lib/validation.ts', description: 'Form validation logic', type: 'file', required: true },
      { path: 'src/lib/export.ts', description: 'Export responses to CSV', type: 'file', required: false },
      { path: 'src/stores/formStore.ts', description: 'Form builder state', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Form, Field, Response models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'React DnD', 'React Hook Form', 'Zod', 'Recharts'],
    features: ['Drag & Drop Builder', 'Multiple Field Types', 'Conditional Logic', 'Response Collection', 'Analytics', 'CSV Export'],
    estimatedFiles: 18,
    phases: [
      {
        number: 1,
        name: 'Form Structure',
        description: 'Database schema and basic form CRUD',
        files: ['prisma/', 'api/forms/', 'stores/formStore.ts']
      },
      {
        number: 2,
        name: 'Builder Interface',
        description: 'Drag-and-drop builder and field palette',
        files: ['components/builder/', 'app/builder/']
      },
      {
        number: 3,
        name: 'Form Rendering',
        description: 'Field components and form submission',
        files: ['components/fields/', 'app/form/', 'api/responses/']
      },
      {
        number: 4,
        name: 'Analytics & Export',
        description: 'Response viewing, analytics, and export',
        files: ['app/responses/', 'lib/export.ts', 'lib/validation.ts']
      }
    ]
  },

  'education-lms': {
    id: 'education-lms',
    name: 'Education / LMS Platform',
    description: 'Learning management system with courses, lessons, quizzes, and progress tracking',
    category: 'content',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'online courses',
      'learning platforms',
      'training systems',
      'educational sites',
      'certification programs',
      'skill development'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/courses/page.tsx', description: 'Course catalog page', type: 'file', required: true },
      { path: 'src/app/course/[id]/page.tsx', description: 'Course detail page', type: 'file', required: true },
      { path: 'src/app/lesson/[id]/page.tsx', description: 'Lesson page', type: 'file', required: true },
      { path: 'src/app/dashboard/page.tsx', description: 'Student dashboard', type: 'file', required: true },
      { path: 'src/app/api/courses/', description: 'Course API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/lessons/', description: 'Lesson API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/progress/', description: 'Progress tracking API', type: 'directory', required: true },
      { path: 'src/components/course/', description: 'Course components', type: 'directory', required: true },
      { path: 'src/components/course/CourseCard.tsx', description: 'Course card component', type: 'file', required: true },
      { path: 'src/components/course/LessonList.tsx', description: 'Lesson list component', type: 'file', required: true },
      { path: 'src/components/lesson/', description: 'Lesson components', type: 'directory', required: true },
      { path: 'src/components/lesson/VideoPlayer.tsx', description: 'Video player component', type: 'file', required: true },
      { path: 'src/components/lesson/Quiz.tsx', description: 'Quiz component', type: 'file', required: true },
      { path: 'src/components/progress/', description: 'Progress components', type: 'directory', required: true },
      { path: 'src/lib/video.ts', description: 'Video streaming integration', type: 'file', required: false },
      { path: 'src/stores/courseStore.ts', description: 'Course state management', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Course, Lesson, Progress models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Zustand', 'Video.js/Plyr', 'Stripe (payments)'],
    features: ['Course Catalog', 'Video Lessons', 'Quizzes', 'Progress Tracking', 'Certificates', 'Discussion Forums', 'Payments'],
    estimatedFiles: 22,
    phases: [
      {
        number: 1,
        name: 'Course Structure',
        description: 'Course and lesson database and API',
        files: ['prisma/', 'api/courses/', 'api/lessons/']
      },
      {
        number: 2,
        name: 'Course Catalog',
        description: 'Course listing and detail pages',
        files: ['app/courses/', 'app/course/', 'components/course/']
      },
      {
        number: 3,
        name: 'Lesson Player',
        description: 'Video player, content rendering, quizzes',
        files: ['app/lesson/', 'components/lesson/', 'lib/video.ts']
      },
      {
        number: 4,
        name: 'Progress & Features',
        description: 'Progress tracking, certificates, forums',
        files: ['api/progress/', 'components/progress/', 'app/dashboard/']
      }
    ]
  },

  'finance-budgeting': {
    id: 'finance-budgeting',
    name: 'Finance / Budgeting App',
    description: 'Personal finance tracker with budgets, transactions, and financial insights',
    category: 'business',
    complexity: 'COMPLEX',
    recommendedFor: [
      'budget tracking',
      'expense management',
      'financial planning',
      'money management',
      'investment tracking',
      'accounting tools'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/dashboard/page.tsx', description: 'Financial dashboard', type: 'file', required: true },
      { path: 'src/app/transactions/page.tsx', description: 'Transactions page', type: 'file', required: true },
      { path: 'src/app/budgets/page.tsx', description: 'Budgets page', type: 'file', required: true },
      { path: 'src/app/api/transactions/', description: 'Transaction API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/budgets/', description: 'Budget API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/plaid/', description: 'Plaid bank integration', type: 'directory', required: false },
      { path: 'src/components/finance/', description: 'Finance components', type: 'directory', required: true },
      { path: 'src/components/finance/TransactionList.tsx', description: 'Transaction list', type: 'file', required: true },
      { path: 'src/components/finance/BudgetCard.tsx', description: 'Budget card component', type: 'file', required: true },
      { path: 'src/components/finance/CategoryPieChart.tsx', description: 'Spending by category chart', type: 'file', required: true },
      { path: 'src/components/finance/TrendChart.tsx', description: 'Spending trend chart', type: 'file', required: true },
      { path: 'src/lib/plaid.ts', description: 'Plaid SDK integration', type: 'file', required: false },
      { path: 'src/lib/calculations.ts', description: 'Financial calculations', type: 'file', required: true },
      { path: 'src/stores/financeStore.ts', description: 'Finance state', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Transaction, Budget, Account models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Recharts', 'Plaid (optional)', 'Date-fns'],
    features: ['Transaction Tracking', 'Budget Management', 'Category Analytics', 'Bank Sync', 'Recurring Transactions', 'Financial Goals'],
    estimatedFiles: 18,
    phases: [
      {
        number: 1,
        name: 'Transaction System',
        description: 'Transaction CRUD and database',
        files: ['prisma/', 'api/transactions/', 'components/finance/TransactionList.tsx']
      },
      {
        number: 2,
        name: 'Budget Management',
        description: 'Budget creation and tracking',
        files: ['api/budgets/', 'app/budgets/', 'components/finance/BudgetCard.tsx']
      },
      {
        number: 3,
        name: 'Analytics & Insights',
        description: 'Charts, trends, and financial insights',
        files: ['components/finance/CategoryPieChart.tsx', 'components/finance/TrendChart.tsx', 'lib/calculations.ts']
      },
      {
        number: 4,
        name: 'Bank Integration',
        description: 'Plaid integration for bank sync',
        files: ['api/plaid/', 'lib/plaid.ts', 'app/dashboard/']
      }
    ]
  },

  'multitenant-saas': {
    id: 'multitenant-saas',
    name: 'Multi-tenant SaaS',
    description: 'Multi-tenant SaaS platform with workspaces, team management, and subscription billing',
    category: 'saas',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'saas platforms',
      'team workspaces',
      'organization management',
      'subscription services',
      'b2b applications',
      'enterprise software'
    ],
    structure: [
      { path: 'src/app/', description: 'Pages', type: 'directory', required: true },
      { path: 'src/app/(auth)/', description: 'Authentication pages', type: 'directory', required: true },
      { path: 'src/app/(workspace)/', description: 'Workspace pages', type: 'directory', required: true },
      { path: 'src/app/(workspace)/[workspaceId]/page.tsx', description: 'Workspace dashboard', type: 'file', required: true },
      { path: 'src/app/(workspace)/[workspaceId]/settings/page.tsx', description: 'Workspace settings', type: 'file', required: true },
      { path: 'src/app/api/workspaces/', description: 'Workspace API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/members/', description: 'Team member API', type: 'directory', required: true },
      { path: 'src/app/api/billing/', description: 'Billing API endpoints', type: 'directory', required: true },
      { path: 'src/components/workspace/', description: 'Workspace components', type: 'directory', required: true },
      { path: 'src/components/workspace/WorkspaceSwitcher.tsx', description: 'Workspace switcher', type: 'file', required: true },
      { path: 'src/components/workspace/TeamMembers.tsx', description: 'Team members list', type: 'file', required: true },
      { path: 'src/components/billing/', description: 'Billing components', type: 'directory', required: true },
      { path: 'src/components/billing/PricingPlans.tsx', description: 'Pricing plans component', type: 'file', required: true },
      { path: 'src/lib/stripe.ts', description: 'Stripe subscription integration', type: 'file', required: true },
      { path: 'src/lib/permissions.ts', description: 'Role-based access control', type: 'file', required: true },
      { path: 'src/middleware.ts', description: 'Tenant isolation middleware', type: 'file', required: true },
      { path: 'prisma/schema.prisma', description: 'Workspace, Member, Subscription models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'NextAuth.js', 'Zustand'],
    features: ['Workspaces', 'Team Management', 'Role-based Access', 'Subscription Billing', 'Invitations', 'Usage Limits', 'Multi-tenancy'],
    estimatedFiles: 24,
    phases: [
      {
        number: 1,
        name: 'Workspace Foundation',
        description: 'Workspace creation and multi-tenancy setup',
        files: ['prisma/', 'api/workspaces/', 'middleware.ts', 'lib/permissions.ts']
      },
      {
        number: 2,
        name: 'Team Management',
        description: 'Member invitations and role management',
        files: ['api/members/', 'components/workspace/TeamMembers.tsx', 'components/workspace/WorkspaceSwitcher.tsx']
      },
      {
        number: 3,
        name: 'Billing System',
        description: 'Stripe integration and subscription management',
        files: ['api/billing/', 'lib/stripe.ts', 'components/billing/']
      },
      {
        number: 4,
        name: 'Settings & Features',
        description: 'Workspace settings and advanced features',
        files: ['app/(workspace)/[workspaceId]/settings/', 'app/(workspace)/[workspaceId]/']
      }
    ]
  },

  'headless-cms': {
    id: 'headless-cms',
    name: 'API-first / Headless CMS',
    description: 'Headless CMS with content modeling, API generation, and multi-channel publishing',
    category: 'content',
    complexity: 'VERY_COMPLEX',
    recommendedFor: [
      'headless cms',
      'content platforms',
      'api-first systems',
      'multi-channel publishing',
      'content management',
      'developer platforms'
    ],
    structure: [
      { path: 'src/app/', description: 'Admin UI pages', type: 'directory', required: true },
      { path: 'src/app/admin/page.tsx', description: 'Admin dashboard', type: 'file', required: true },
      { path: 'src/app/admin/content/page.tsx', description: 'Content management page', type: 'file', required: true },
      { path: 'src/app/admin/models/page.tsx', description: 'Content model builder', type: 'file', required: true },
      { path: 'src/app/api/content/', description: 'Content API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/models/', description: 'Model API endpoints', type: 'directory', required: true },
      { path: 'src/app/api/graphql/route.ts', description: 'GraphQL API endpoint', type: 'file', required: false },
      { path: 'src/components/admin/', description: 'Admin components', type: 'directory', required: true },
      { path: 'src/components/admin/ContentEditor.tsx', description: 'Content editor component', type: 'file', required: true },
      { path: 'src/components/admin/ModelBuilder.tsx', description: 'Model builder component', type: 'file', required: true },
      { path: 'src/components/admin/FieldConfigurator.tsx', description: 'Field config component', type: 'file', required: true },
      { path: 'src/components/fields/', description: 'Dynamic field components', type: 'directory', required: true },
      { path: 'src/lib/schema.ts', description: 'Dynamic schema generation', type: 'file', required: true },
      { path: 'src/lib/api-builder.ts', description: 'REST API generation', type: 'file', required: true },
      { path: 'src/lib/graphql.ts', description: 'GraphQL schema generation', type: 'file', required: false },
      { path: 'src/lib/versioning.ts', description: 'Content versioning system', type: 'file', required: false },
      { path: 'prisma/schema.prisma', description: 'ContentModel, Content, Field models', type: 'file', required: true }
    ],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'GraphQL (optional)', 'Zod', 'TipTap/Slate'],
    features: ['Content Modeling', 'REST API', 'GraphQL (optional)', 'Versioning', 'Webhooks', 'Multi-language', 'Media Library'],
    estimatedFiles: 22,
    phases: [
      {
        number: 1,
        name: 'Model Builder',
        description: 'Content type modeling and schema',
        files: ['prisma/', 'app/admin/models/', 'components/admin/ModelBuilder.tsx', 'lib/schema.ts']
      },
      {
        number: 2,
        name: 'Content Editor',
        description: 'Content creation and editing interface',
        files: ['app/admin/content/', 'components/admin/ContentEditor.tsx', 'components/fields/']
      },
      {
        number: 3,
        name: 'API Generation',
        description: 'Dynamic REST and GraphQL API',
        files: ['api/content/', 'lib/api-builder.ts', 'lib/graphql.ts']
      },
      {
        number: 4,
        name: 'Advanced Features',
        description: 'Versioning, webhooks, media library',
        files: ['lib/versioning.ts', 'api/models/', 'app/admin/']
      }
    ]
  }
};

/**
 * Detect app complexity and recommend templates based on user request
 */
export function detectComplexity(userRequest: string): {
  complexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'VERY_COMPLEX';
  suggestedTemplates: ArchitectureTemplate[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
} {
  const lowerRequest = userRequest.toLowerCase();

  // Keywords for complexity detection
  const complexKeywords = {
    'VERY_COMPLEX': ['marketplace', 'social media', 'real-time chat', 'ecommerce', 'online store', 'shopping cart'],
    'COMPLEX': ['dashboard', 'saas', 'admin panel', 'crm', 'management system', 'with database', 'with auth'],
    'MEDIUM': ['blog', 'cms', 'landing page', 'business app', 'crud', 'forms'],
    'SIMPLE': ['calculator', 'todo', 'counter', 'timer', 'simple game']
  };

  // Feature count detection
  const featureWords = ['and', 'with', 'include', 'plus', 'also', 'along with'];
  const featureCount = featureWords.reduce((count, word) => {
    return count + (lowerRequest.match(new RegExp(word, 'g')) || []).length;
  }, 0);

  // Detect complexity level
  let detectedComplexity: 'SIMPLE' | 'MEDIUM' | 'COMPLEX' | 'VERY_COMPLEX' = 'SIMPLE';
  let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  for (const [complexity, keywords] of Object.entries(complexKeywords)) {
    for (const keyword of keywords) {
      if (lowerRequest.includes(keyword)) {
        detectedComplexity = complexity as any;
        confidence = 'HIGH';
        break;
      }
    }
    if (confidence === 'HIGH') break;
  }

  // Adjust based on feature count
  if (featureCount >= 5 && detectedComplexity === 'SIMPLE') {
    detectedComplexity = 'COMPLEX';
    confidence = 'MEDIUM';
  } else if (featureCount >= 3 && detectedComplexity === 'SIMPLE') {
    detectedComplexity = 'MEDIUM';
    confidence = 'MEDIUM';
  }

  // Find matching templates
  const suggestedTemplates: ArchitectureTemplate[] = [];

  for (const template of Object.values(ARCHITECTURE_TEMPLATES)) {
    let matchScore = 0;

    // Check if any recommended keywords match
    for (const recommendation of template.recommendedFor) {
      if (lowerRequest.includes(recommendation.toLowerCase())) {
        matchScore += 10;
      }
    }

    // Check feature matches
    for (const feature of template.features) {
      if (lowerRequest.includes(feature.toLowerCase())) {
        matchScore += 5;
      }
    }

    // Check technology matches
    for (const tech of template.technologies) {
      if (lowerRequest.includes(tech.toLowerCase())) {
        matchScore += 3;
      }
    }

    if (matchScore >= 10) {
      suggestedTemplates.push(template);
    }
  }

  // Sort by match score (implicitly by how many matches)
  // If no templates match, suggest based on complexity
  if (suggestedTemplates.length === 0) {
    const allTemplates = Object.values(ARCHITECTURE_TEMPLATES);
    if (detectedComplexity === 'VERY_COMPLEX') {
      suggestedTemplates.push(...allTemplates.filter(t => t.complexity === 'VERY_COMPLEX'));
    } else if (detectedComplexity === 'COMPLEX') {
      suggestedTemplates.push(...allTemplates.filter(t => t.complexity === 'COMPLEX'));
    } else if (detectedComplexity === 'MEDIUM') {
      suggestedTemplates.push(...allTemplates.filter(t => t.complexity === 'MEDIUM'));
    }
  }

  return {
    complexity: detectedComplexity,
    suggestedTemplates: suggestedTemplates.slice(0, 3), // Return top 3
    confidence
  };
}

/**
 * Generate folder structure prompt for AI based on template
 */
export function generateTemplatePrompt(template: ArchitectureTemplate): string {
  const requiredStructure = template.structure
    .filter(item => item.required)
    .map(item => `- ${item.path} (${item.description})`)
    .join('\n');

  const optionalStructure = template.structure
    .filter(item => !item.required)
    .map(item => `- ${item.path} (${item.description})`)
    .join('\n');

  return `
**Architecture Template: ${template.name}**

${template.description}

**Required File Structure:**
${requiredStructure}

**Optional (if needed):**
${optionalStructure}

**Recommended Technologies:**
${template.technologies.join(', ')}

**Key Features to Implement:**
${template.features.map(f => `- ${f}`).join('\n')}

**IMPORTANT GUIDELINES:**
1. Create SEPARATE files for each component - DO NOT put everything in one file
2. Use proper folder organization as shown above
3. Follow Next.js 13+ App Router conventions
4. Use TypeScript for all files
5. Include proper imports and exports
6. Keep files focused and under 200 lines when possible
7. Create reusable components in the components/ directory
8. Put API logic in separate files in lib/ or api/

${template.phases ? `
**Suggested Implementation Phases:**
${template.phases.map(phase => `
Phase ${phase.number}: ${phase.name}
${phase.description}
Files to create: ${phase.files.join(', ')}
`).join('\n')}
` : ''}
`;
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ArchitectureTemplate | null {
  return ARCHITECTURE_TEMPLATES[id] || null;
}

/**
 * Get all templates
 */
export function getAllTemplates(): ArchitectureTemplate[] {
  return Object.values(ARCHITECTURE_TEMPLATES);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ArchitectureTemplate[] {
  return Object.values(ARCHITECTURE_TEMPLATES).filter(t => t.category === category);
}
