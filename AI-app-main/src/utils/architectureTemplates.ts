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
