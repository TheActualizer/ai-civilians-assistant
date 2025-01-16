import { useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export const removeDuplicateNavItems = (items: NavItem[]): NavItem[] => {
  const seen = new Set<string>();
  
  const filterDuplicates = (items: NavItem[]): NavItem[] => {
    return items.filter(item => {
      // Create a unique key based on path and label
      const key = `${item.path}-${item.label}`;
      
      if (seen.has(key)) {
        console.log(`🔄 Duplicate nav item detected and removed: ${item.label} (${item.path})`);
        return false;
      }
      
      seen.add(key);
      
      // Recursively handle children
      if (item.children) {
        item.children = filterDuplicates(item.children);
      }
      
      return true;
    });
  };

  console.log('🔍 Starting navbar deduplication check...');
  const result = filterDuplicates(items);
  console.log(`✅ Navbar deduplication complete. Original: ${items.length}, Filtered: ${result.length}`);
  
  return result;
};

export const useNavItemValidation = () => {
  const location = useLocation();
  
  const validateNavStructure = (items: NavItem[]) => {
    const paths = new Set<string>();
    
    const validateItem = (item: NavItem) => {
      // Check for invalid paths
      if (!item.path.startsWith('/')) {
        console.warn(`⚠️ Invalid path format detected: ${item.path}`);
      }
      
      // Check for duplicate paths
      if (paths.has(item.path)) {
        console.warn(`⚠️ Duplicate path detected: ${item.path}`);
      }
      paths.add(item.path);
      
      // Validate children recursively
      if (item.children) {
        item.children.forEach(validateItem);
      }
    };
    
    items.forEach(validateItem);
  };
  
  return { validateNavStructure };
};