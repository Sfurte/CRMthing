// Auto-discover all element files in this directory (except registry.js)
const elementModules = import.meta.glob('./*.jsx', { eager: true });

const ElementRenderers = {};
const elementDefinitions = [];

for (const [path, mod] of Object.entries(elementModules)) {
  // Skip registry.js itself
  if (path === './registry.js' || path === './registry.jsx') continue;

  const Component = mod.default;
  const def = mod.definition;

  if (Component && def) {
    ElementRenderers[def.type] = Component;
    elementDefinitions.push(def);
  }
}

export { ElementRenderers, elementDefinitions };
export const ELEMENT_TYPES = elementDefinitions.map((d) => d.type);