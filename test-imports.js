import fs from 'fs';
import path from 'path';

console.log('Checking component imports...');

try {
  const toolsRegistry = await import('./src/data/toolsRegistry.js');
  console.log('✅ toolsRegistry imported successfully. Count:', toolsRegistry.TOOLS_REGISTRY.length);
} catch (e) {
  console.error('❌ Error in toolsRegistry:', e);
}

try {
  const categories = await import('./src/data/categories.js');
  console.log('✅ categories imported successfully. Count:', categories.CATEGORIES.length);
} catch (e) {
  console.error('❌ Error in categories:', e);
}
