import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import createProvider, { type ProviderType, BaseProvider } from "../index";
import { WorkerProvider } from "../workers";

/**
 * Provider Test Configuration
 * 
 * This is the SINGLE PLACE to configure how each provider type is created and cleaned up.
 * When adding a new provider, just add an entry here.
 * 
 * Each provider config specifies:
 * - create: how to create the provider instance (must return BaseProvider)
 * - cleanup: optional cleanup function (e.g., terminate workers)
 */
interface ProviderTestConfig {
  type: ProviderType;
  /** Factory function to create the provider. Receives a unique suffix for db names. */
  create: (dbSuffix: string) => BaseProvider;
  /** Optional cleanup function called after each test */
  cleanup?: (provider: BaseProvider) => void;
}

/**
 * ============================================
 * PROVIDER REGISTRY - UPDATE THIS TO ADD NEW PROVIDERS
 * ============================================
 * 
 * To add a new provider:
 * 1. Add its type to the ProviderType union in src/index.ts
 * 2. Add a config entry here
 */
const providerConfigs: ProviderTestConfig[] = [
  // IndexDB - runs directly in main thread
  {
    type: 'indexDB',
    create: () => createProvider('indexDB'),
  },
  
  // SQLite - runs in a Worker (OPFS requires Worker context)
  {
    type: 'sqlite',
    create: (dbSuffix) => new WorkerProvider('sqlite', `test_${dbSuffix}`),
    cleanup: (provider) => {
      if (provider instanceof WorkerProvider) {
        provider.terminate();
      }
    },
  },
  
  // LocalStorage - uncomment to enable
  // {
  //   type: 'local',
  //   create: () => createProvider('local'),
  // },
];

// Extract provider types for test.each
const testableProviders = providerConfigs.map(c => c.type);

// Helper to get config for a provider type
function getConfig(type: ProviderType): ProviderTestConfig {
  const config = providerConfigs.find(c => c.type === type);
  if (!config) throw new Error(`No config found for provider: ${type}`);
  return config;
}

// Track created items for cleanup
const createdPaths: string[] = [];

describe.each(testableProviders)('createProvider(%s)', (providerType) => {
  let provider: BaseProvider;
  let currentConfig: ProviderTestConfig;

  beforeEach(() => {
    currentConfig = getConfig(providerType);
    provider = currentConfig.create(Date.now().toString());
    createdPaths.length = 0;
  });

  afterEach(async () => {
    // Clean up all created items
    for (const path of createdPaths) {
      try {
        await provider.delete(path);
      } catch {
        // Ignore errors during cleanup
      }
    }
    
    // Run provider-specific cleanup
    currentConfig.cleanup?.(provider);
  });

  describe(`(${providerType}) initialization`, () => {
    it(`(${providerType}) should successfully initialize the database with correct structure`, async () => {
      // Assert: Database should be created and accessible
      expect(provider).toBeDefined();

      // Verify database structure by attempting a simple operation
      const testData = { name: 'test', value: 123 };
      const created = await provider.create('/test', testData);

      // Verify the data was stored correctly
      expect(created).toHaveProperty('id');
      expect(created.name).toBe('test');
      expect(created.value).toBe(123);

      // Verify we can retrieve the data by exact path
      const retrieved = await provider.get(`/test/${created.id}`);
      expect(retrieved).toEqual(created);
    });

    it(`(${providerType}) should handle concurrent initialization requests`, async () => {
      const config = getConfig(providerType);
      const suffix = Date.now().toString();
      
      // Create multiple provider instances simultaneously
      const provider1 = config.create(`concurrent1_${suffix}`);
      const provider2 = config.create(`concurrent2_${suffix}`);

      try {
        // Assert: Both should initialize successfully
        const data1 = await provider1.create('/concurrent1', { test: 'data1' });
        const data2 = await provider2.create('/concurrent2', { test: 'data2' });

        expect(data1).toBeDefined();
        expect(data2).toBeDefined();
        expect(data1.test).toBe('data1');
        expect(data2.test).toBe('data2');
      } finally {
        // Clean up
        config.cleanup?.(provider1);
        config.cleanup?.(provider2);
      }
    });
  });

  describe(`(${providerType}) CRUD operations`, () => {
    describe(`(${providerType}) CREATE operations`, () => {
      it(`(${providerType}) should create a simple item with generated ID`, async () => {
        const testData = { name: 'Test Item', value: 42 };
        const created = await provider.create('/items', testData);

        expect(created).toEqual(expect.objectContaining({
          name: 'Test Item',
          value: 42,
          id: expect.any(String)
        }));
      });

      it(`(${providerType}) should create complex nested objects`, async () => {
        const complexData = {
          user: {
            name: 'John Doe',
            preferences: {
              theme: 'dark',
              notifications: true
            }
          },
          metadata: {
            createdAt: new Date().toISOString(),
            tags: ['important', 'urgent']
          }
        };

        const created = await provider.create('/users', complexData);

        expect(created).toEqual(expect.objectContaining({
          user: expect.objectContaining({
            name: 'John Doe',
            preferences: expect.objectContaining({
              theme: 'dark'
            })
          })
        }));
      });

      it(`(${providerType}) should create multiple items under the same path`, async () => {
        const item1 = await provider.create('/products', { name: 'Product 1', price: 10 });
        const item2 = await provider.create('/products', { name: 'Product 2', price: 20 });

        expect(item1).toEqual(expect.objectContaining({
          name: 'Product 1',
          price: 10,
          id: expect.any(String)
        }));
        expect(item2).toEqual(expect.objectContaining({
          name: 'Product 2',
          price: 20,
          id: expect.any(String)
        }));
      });
    });

    describe(`(${providerType}) READ operations`, () => {
      it(`(${providerType}) should read a single item by exact path`, async () => {
        const testData = { name: 'Single Item', value: 100 };
        const created = await provider.create('/single', testData);
        const retrieved = await provider.get(`/single/${created.id}`);

        expect(retrieved).toEqual(created);
      });

      it(`(${providerType}) should read all items under a path using getAll`, async () => {
        const item1 = await provider.create('/collection', { name: 'Item 1', order: 1 });
        const item2 = await provider.create('/collection', { name: 'Item 2', order: 2 });
        const item3 = await provider.create('/collection', { name: 'Item 3', order: 3 });

        const retrieved = await provider.getAll<{ name: string; order: number; id: string }>('/collection');

        expect(retrieved).toEqual(expect.objectContaining({
          [item1.id]: expect.objectContaining({
            name: 'Item 1',
            order: 1
          }),
          [item2.id]: expect.objectContaining({
            name: 'Item 2',
            order: 2
          }),
          [item3.id]: expect.objectContaining({
            name: 'Item 3',
            order: 3
          })
        }));
      });

      it(`(${providerType}) should throw error when using get on a collection path`, async () => {
        await provider.create('/get-collection', { name: 'Item 1' });

        // get should only work with exact paths, not collection paths
        await expect(provider.get('/get-collection')).rejects.toThrow('No Data Found');
      });

      it(`(${providerType}) should throw error when getAll on non-existent path`, async () => {
        await expect(provider.getAll('/non-existent-collection')).rejects.toThrow('No Data Found');
      });

      it(`(${providerType}) should throw error when reading non-existent item`, async () => {
        await expect(provider.get('/non-existent')).rejects.toThrow('No Data Found');
      });
    });

    describe(`(${providerType}) UPDATE operations`, () => {
      it(`(${providerType}) should update an existing item`, async () => {
        const { id } = await provider.create('/update-test', { name: 'Original', value: 1 });
        const updated = await provider.update(`/update-test/${id}`, { value: 2, newField: 'added' });

        expect(updated).toEqual(expect.objectContaining({ name: 'Original', value: 2, newField: 'added' }));
      });

      it(`(${providerType}) should perform partial updates`, async () => {
        const { id } = await provider.create('/partial-update', { name: 'Original', value: 1, nested: { prop: 'old' } });
        const updated = await provider.update(`/partial-update/${id}`, { value: 2 });

        expect(updated).toEqual(
          expect.objectContaining({ id, name: 'Original', value: 2, nested: { prop: 'old' } })
        );
      });

      it(`(${providerType}) should throw error when updating non-existent item`, async () => {
        await expect(provider.update('/non-existent', { value: 1 })).rejects.toThrow('No Data Found');
      });
    });

    describe(`(${providerType}) DELETE operations`, () => {
      it(`(${providerType}) should delete an existing item`, async () => {
        const { id } = await provider.create('/delete-test', { name: 'To Delete' });
        await provider.delete(`/delete-test/${id}`);

        // Verify it's deleted
        await expect(provider.get(`/delete-test/${id}`)).rejects.toThrow('No Data Found');
      });

      it(`(${providerType}) should not throw when deleting non-existent item`, async () => {
        await expect(provider.delete('/non-existent')).resolves.not.toThrow();
      });
    });

    describe(`(${providerType}) SEARCH operations`, () => {
      let searchItems: Array<{ id: string }> = [];

      beforeEach(async () => {
        searchItems = [
          await provider.create('/search', { name: 'Apple Pie', category: 'dessert' }),
          await provider.create('/search', { name: 'Apple Juice', category: 'beverage' }),
          await provider.create('/search', { name: 'Banana Bread', category: 'dessert' }),
        ];
        searchItems.forEach(item => createdPaths.push(`/search/${item.id}`));
      });

      it(`(${providerType}) should find items with fuzzy search`, async () => {
        const searchResults = await provider.search<{ name: string }>('/search', { name: { fuzzy: 'Apple' } });

        expect(searchResults).toHaveLength(2);
        expect(searchResults.map(r => r.name)).toContain('Apple Pie');
        expect(searchResults.map(r => r.name)).toContain('Apple Juice');
      });

      it(`(${providerType}) should find items with exact search`, async () => {
        const searchResults = await provider.search<{ category: string }>('/search', { category: { exact: 'dessert' } });

        expect(searchResults).toHaveLength(2);
        expect(searchResults.every(r => r.category === 'dessert')).toBe(true);
      });

      it(`(${providerType}) should return empty when no matches found`, async () => {
        const searchResults = await provider.search<{ name: string }>('/search', { name: { fuzzy: 'Orange' } });
        expect(searchResults).toHaveLength(0);
      });
    });
  });
});
