import { AppConcept, Feature } from '../types/appConcept';

export interface MockContent {
  navItems: string[];
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  stats: Array<{ label: string; value: string }>;
  cards: Array<{ title: string; subtitle: string; tag: string }>;
  listItems: Array<{ title: string; meta: string; status: 'active' | 'pending' | 'completed' }>;
}

export function generateMockContent(name: string, description: string, features: Feature[], type: string = ''): MockContent {
  // Default generic content
  const content: MockContent = {
    navItems: ['Dashboard', 'Projects', 'Team', 'Settings'],
    hero: {
      title: `Welcome to ${name || 'Your App'}`,
      subtitle: description || ' The ultimate solution for your needs.',
      cta: 'Get Started'
    },
    stats: [
      { label: 'Total Users', value: '1,234' },
      { label: 'Active Now', value: '89%' },
      { label: 'Revenue', value: '$45k' }
    ],
    cards: [
      { title: 'Project Alpha', subtitle: 'Updated 2h ago', tag: 'High Priority' },
      { title: 'Design System', subtitle: 'Updated 5h ago', tag: 'In Progress' },
      { title: 'Q4 Report', subtitle: 'Updated 1d ago', tag: 'Review' }
    ],
    listItems: [
      { title: 'Review pull request', meta: 'Today, 2:00 PM', status: 'active' },
      { title: 'Team meeting', meta: 'Tomorrow, 10:00 AM', status: 'pending' },
      { title: 'Deploy production', meta: 'Yesterday', status: 'completed' }
    ]
  };

  const lowerDesc = (description + ' ' + type).toLowerCase();
  const featureText = features.map(f => f.name.toLowerCase()).join(' ');

  // Context-aware overrides
  if (lowerDesc.includes('recipe') || lowerDesc.includes('food') || lowerDesc.includes('cook')) {
    content.navItems = ['Recipes', 'Favorites', 'Meal Plan', 'Shopping List'];
    content.hero.cta = 'Start Cooking';
    content.stats = [
      { label: 'Recipes', value: '150+' },
      { label: 'Favorites', value: '42' },
      { label: 'Calories', value: '2,100' }
    ];
    content.cards = [
      { title: 'Spicy Ramen', subtitle: '30 mins • Easy', tag: 'Dinner' },
      { title: 'Avocado Toast', subtitle: '10 mins • V', tag: 'Breakfast' },
      { title: 'Choc Lava Cake', subtitle: '45 mins • Hard', tag: 'Dessert' }
    ];
  } 
  else if (lowerDesc.includes('finance') || lowerDesc.includes('money') || lowerDesc.includes('budget')) {
    content.navItems = ['Overview', 'Transactions', 'Budget', 'Goals'];
    content.hero.cta = 'Add Transaction';
    content.stats = [
      { label: 'Balance', value: '$12,450.00' },
      { label: 'Income', value: '+$4,200' },
      { label: 'Expenses', value: '-$1,850' }
    ];
    content.cards = [
      { title: 'Grocery Store', subtitle: 'Today • Debit', tag: '-$84.50' },
      { title: 'Salary Deposit', subtitle: 'Yesterday', tag: '+$3,200' },
      { title: 'Electric Bill', subtitle: 'Due in 3 days', tag: '$140.00' }
    ];
  }
  else if (lowerDesc.includes('task') || lowerDesc.includes('todo') || lowerDesc.includes('project')) {
    content.navItems = ['My Tasks', 'Projects', 'Calendar', 'Reports'];
    content.hero.cta = 'New Task';
    content.stats = [
      { label: 'Pending', value: '12' },
      { label: 'Completed', value: '45' },
      { label: 'Overdue', value: '2' }
    ];
    content.cards = [
      { title: 'Update Documentation', subtitle: 'Due Today', tag: 'High' },
      { title: 'Fix Navigation Bug', subtitle: 'Assigned to You', tag: 'Medium' },
      { title: 'Client Meeting', subtitle: 'Tomorrow 2pm', tag: 'Low' }
    ];
  }
  else if (lowerDesc.includes('social') || lowerDesc.includes('chat') || lowerDesc.includes('community')) {
    content.navItems = ['Feed', 'Explore', 'Messages', 'Profile'];
    content.hero.cta = 'Post Update';
    content.stats = [
      { label: 'Followers', value: '2.4k' },
      { label: 'Following', value: '450' },
      { label: 'Posts', value: '182' }
    ];
    content.cards = [
      { title: 'Sarah James', subtitle: 'Just shared a photo', tag: 'New' },
      { title: 'Tech Daily', subtitle: 'Posted an article', tag: 'Trending' },
      { title: 'Design Group', subtitle: '5 new messages', tag: 'Active' }
    ];
  }
  else if (lowerDesc.includes('commerce') || lowerDesc.includes('shop') || lowerDesc.includes('store')) {
    content.navItems = ['New Arrivals', 'Men', 'Women', 'Sale'];
    content.hero.cta = 'Shop Now';
    content.stats = [
      { label: 'Cart', value: '3 Items' },
      { label: 'Wishlist', value: '12' },
      { label: 'Orders', value: '5' }
    ];
    content.cards = [
      { title: 'Premium Watch', subtitle: 'Black Leather', tag: '$299' },
      { title: 'Denim Jacket', subtitle: 'Vintage Wash', tag: '$89' },
      { title: 'Running Shoes', subtitle: 'Limited Edition', tag: '$120' }
    ];
  }

  return content;
}
