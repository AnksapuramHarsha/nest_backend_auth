import { Injectable } from '@nestjs/common';

/**
 * Interface for cache items
 */
interface CacheItem<T> {
  value: T;
  expiry: number | null;
}

/**
 * Cache service for storing and retrieving data with optional expiration
 */
@Injectable()
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  
  /**
   * Set an item in the cache
   * @param key - Unique identifier for the cached item
   * @param value - Value to store in the cache
   * @param ttl - Time to live in seconds (optional)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { value, expiry });
  }
  
  /**
   * Get an item from the cache
   * @param key - Key of the item to retrieve
   * @returns The cached value or null if not found or expired
   */
  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    
    // Return null if item doesn't exist
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (item.expiry && item.expiry < Date.now()) {
      await this.delete(key);
      return null;
    }
    
    return item.value as T;
  }
  
  /**
   * Check if an item exists in the cache and is not expired
   * @param key - Key to check
   * @returns Boolean indicating if the item exists and is valid
   */
  async has(key: string): Promise<boolean> {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    if (item.expiry && item.expiry < Date.now()) {
      await this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Remove an item from the cache
   * @param key - Key of the item to remove
   */
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
  
  /**
   * Delete all items matching a pattern
   * @param pattern - Pattern to match (e.g., 'config:category:*')
   * @returns Number of items deleted
   */
  async deletePattern(pattern: string): Promise<number> {
    const regex = this.patternToRegExp(pattern);
    const keysToDelete: string[] = [];
    
    // Find all keys matching the pattern
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }
    
    // Delete all matching keys
    keysToDelete.forEach(key => this.cache.delete(key));
    
    return keysToDelete.length;
  }
  
  /**
   * Convert a cache pattern with wildcards to a RegExp
   * @param pattern - Pattern string with * wildcards
   * @returns RegExp object
   */
  private patternToRegExp(pattern: string): RegExp {
    const escapedPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
      .replace(/\*/g, '.*'); // Convert * to .*
    
    return new RegExp(`^${escapedPattern}$`);
  }
  
  /**
   * Clear all items from the cache
   */
  async clear(): Promise<void> {
    this.cache.clear();
  }
  
  /**
   * Get all valid keys in the cache
   * @returns Array of valid cache keys
   */
  async keys(): Promise<string[]> {
    const validKeys: string[] = [];
    const now = Date.now();
    
    this.cache.forEach((item, key) => {
      if (!item.expiry || item.expiry >= now) {
        validKeys.push(key);
      }
    });
    
    return validKeys;
  }
}