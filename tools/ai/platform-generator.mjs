#!/usr/bin/env node

/**
 * AI Platform Generator
 *
 * Generates platform-specific implementations while maintaining
 * shared business logic and architectural consistency.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

class AIPlatformGenerator {
  constructor() {
    this.platforms = {
      mobile: this.generateMobilePlatform.bind(this),
      desktop: this.generateDesktopPlatform.bind(this),
      extension: this.generateExtensionPlatform.bind(this),
    };
  }

  async generatePlatform(platformType, options = {}) {
    console.log(`🚀 Generating ${platformType} platform...\n`);

    if (!this.platforms[platformType]) {
      console.error(`Unknown platform type: ${platformType}`);
      console.log('Available platforms:', Object.keys(this.platforms).join(', '));
      process.exit(1);
    }

    try {
      await this.createSharedStructure();
      await this.platforms[platformType](options);
      await this.generatePlatformTests(platformType);
      await this.updateConfigurationFiles(platformType);

      console.log(
        `✅ ${platformType.charAt(0).toUpperCase() + platformType.slice(1)} platform generated successfully!`
      );
      this.displayNextSteps(platformType);
    } catch (error) {
      console.error(`❌ Platform generation failed:`, error.message);
      process.exit(1);
    }
  }

  async createSharedStructure() {
    console.log('📁 Creating shared platform structure...');

    const sharedDirs = [
      'src/platforms/shared',
      'src/platforms/shared/types',
      'src/platforms/shared/utils',
      'src/platforms/shared/constants',
      'src/platforms/shared/services',
      'src/platforms/shared/hooks',
    ];

    for (const dir of sharedDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`   Created: ${dir}`);
      }
    }

    // Generate shared platform detection utility
    await this.generatePlatformDetection();
    await this.generateSharedTypes();
    await this.generateSharedServices();
  }

  async generatePlatformDetection() {
    const content = `/**
 * Platform Detection Utility
 * 
 * Provides runtime platform detection for conditional logic.
 */

export enum Platform {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  EXTENSION = 'extension',
  UNKNOWN = 'unknown'
}

export interface PlatformInfo {
  type: Platform;
  name: string;
  version?: string;
  capabilities: PlatformCapabilities;
}

export interface PlatformCapabilities {
  hasFileSystem: boolean;
  hasCamera: boolean;
  supportsNotifications: boolean;
  supportsBackgroundSync: boolean;
  supportsOfflineStorage: boolean;
  maxStorageSize: number; // in MB
}

export class PlatformDetector {
  private static _current: PlatformInfo | null = null;

  static detect(): PlatformInfo {
    if (this._current) return this._current;

    // Server-side rendering check
    if (typeof window === 'undefined') {
      this._current = {
        type: Platform.UNKNOWN,
        name: 'Server',
        capabilities: this.getServerCapabilities()
      };
      return this._current;
    }

    // Desktop (Electron)
    if (window.electron) {
      this._current = {
        type: Platform.DESKTOP,
        name: 'Electron',
        version: window.electron.version,
        capabilities: this.getDesktopCapabilities()
      };
      return this._current;
    }

    // Mobile (React Native WebView)
    if (window.ReactNativeWebView) {
      this._current = {
        type: Platform.MOBILE,
        name: 'React Native',
        capabilities: this.getMobileCapabilities()
      };
      return this._current;
    }

    // Browser Extension
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      this._current = {
        type: Platform.EXTENSION,
        name: 'Chrome Extension',
        capabilities: this.getExtensionCapabilities()
      };
      return this._current;
    }

    // Web (default)
    this._current = {
      type: Platform.WEB,
      name: this.getBrowserName(),
      capabilities: this.getWebCapabilities()
    };

    return this._current;
  }

  static is(platform: Platform): boolean {
    return this.detect().type === platform;
  }

  static isWeb(): boolean { return this.is(Platform.WEB); }
  static isMobile(): boolean { return this.is(Platform.MOBILE); }
  static isDesktop(): boolean { return this.is(Platform.DESKTOP); }
  static isExtension(): boolean { return this.is(Platform.EXTENSION); }

  private static getBrowserName(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return 'Unknown Browser';
  }

  private static getWebCapabilities(): PlatformCapabilities {
    return {
      hasFileSystem: 'showSaveFilePicker' in window,
      hasCamera: !!(navigator.mediaDevices?.getUserMedia),
      supportsNotifications: 'Notification' in window,
      supportsBackgroundSync: 'serviceWorker' in navigator,
      supportsOfflineStorage: 'indexedDB' in window,
      maxStorageSize: this.estimateWebStorageSize()
    };
  }

  private static getMobileCapabilities(): PlatformCapabilities {
    return {
      hasFileSystem: false,
      hasCamera: true,
      supportsNotifications: true,
      supportsBackgroundSync: true,
      supportsOfflineStorage: true,
      maxStorageSize: 1000 // 1GB typical for mobile apps
    };
  }

  private static getDesktopCapabilities(): PlatformCapabilities {
    return {
      hasFileSystem: true,
      hasCamera: true,
      supportsNotifications: true,
      supportsBackgroundSync: true,
      supportsOfflineStorage: true,
      maxStorageSize: 10000 // 10GB for desktop apps
    };
  }

  private static getExtensionCapabilities(): PlatformCapabilities {
    return {
      hasFileSystem: false,
      hasCamera: false,
      supportsNotifications: true,
      supportsBackgroundSync: true,
      supportsOfflineStorage: true,
      maxStorageSize: 100 // 100MB for extensions
    };
  }

  private static getServerCapabilities(): PlatformCapabilities {
    return {
      hasFileSystem: false,
      hasCamera: false,
      supportsNotifications: false,
      supportsBackgroundSync: false,
      supportsOfflineStorage: false,
      maxStorageSize: 0
    };
  }

  private static estimateWebStorageSize(): number {
    // Estimate based on browser storage quotas
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then(estimate => {
        return Math.floor((estimate.quota || 0) / (1024 * 1024)); // Convert to MB
      });
    }
    return 50; // 50MB default estimate
  }
}

// Convenience exports
export const platform = PlatformDetector.detect();
export const isWeb = PlatformDetector.isWeb();
export const isMobile = PlatformDetector.isMobile();
export const isDesktop = PlatformDetector.isDesktop();
export const isExtension = PlatformDetector.isExtension();`;

    fs.writeFileSync('src/platforms/shared/utils/platformDetection.ts', content);
    console.log('   Generated: Platform detection utility');
  }

  async generateSharedTypes() {
    const content = `/**
 * Shared Platform Types
 * 
 * Common type definitions used across all platforms.
 */

import { Platform } from '../utils/platformDetection';

// Storage interfaces
export interface IPlatformStorage {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
}

// Network interfaces
export interface IPlatformNetwork {
  isOnline(): Promise<boolean>;
  getConnectionType(): Promise<ConnectionType>;
  onConnectionChange(callback: (isOnline: boolean) => void): () => void;
}

export enum ConnectionType {
  WIFI = 'wifi',
  CELLULAR = 'cellular',
  ETHERNET = 'ethernet',
  UNKNOWN = 'unknown',
  NONE = 'none'
}

// Notification interfaces
export interface IPlatformNotifications {
  requestPermission(): Promise<boolean>;
  show(notification: PlatformNotification): Promise<void>;
  cancel(id: string): Promise<void>;
  cancelAll(): Promise<void>;
}

export interface PlatformNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  sound?: boolean;
  vibrate?: number[];
  data?: Record<string, any>;
}

// Navigation interfaces
export interface IPlatformNavigation {
  navigate(route: string, params?: Record<string, any>): void;
  goBack(): void;
  canGoBack(): boolean;
  replace(route: string, params?: Record<string, any>): void;
  reset(route: string, params?: Record<string, any>): void;
}

// File system interfaces
export interface IPlatformFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  delete(path: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  listFiles(directory: string): Promise<string[]>;
}

// Audio interfaces
export interface IPlatformAudio {
  play(url: string): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  seek(position: number): Promise<void>;
  setVolume(volume: number): Promise<void>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  isPlaying(): Promise<boolean>;
}

// Platform configuration
export interface PlatformConfig {
  platform: Platform;
  apiBaseUrl: string;
  cacheSize: number;
  offlineMode: boolean;
  debugMode: boolean;
  features: PlatformFeatures;
}

export interface PlatformFeatures {
  audioPlayer: boolean;
  bookmarks: boolean;
  search: boolean;
  tafsir: boolean;
  translations: boolean;
  notes: boolean;
  sharing: boolean;
  nightMode: boolean;
}

// Service factory types
export interface PlatformServices {
  storage: IPlatformStorage;
  network: IPlatformNetwork;
  notifications: IPlatformNotifications;
  navigation: IPlatformNavigation;
  fileSystem?: IPlatformFileSystem;
  audio: IPlatformAudio;
}

// Component adaptation types
export interface ResponsiveBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface PlatformDimensions {
  width: number;
  height: number;
  scale: number;
  isTablet: boolean;
  isDesktop: boolean;
}`;

    fs.writeFileSync('src/platforms/shared/types/index.ts', content);
    console.log('   Generated: Shared types');
  }

  async generateSharedServices() {
    const content = `/**
 * Platform Service Factory
 * 
 * Creates platform-specific service implementations.
 */

import { PlatformDetector, Platform } from '../utils/platformDetection';
import { PlatformServices, PlatformConfig } from '../types';

export class PlatformServiceFactory {
  private static services: PlatformServices | null = null;
  private static config: PlatformConfig | null = null;

  static initialize(config: Partial<PlatformConfig> = {}): void {
    const platform = PlatformDetector.detect();
    
    this.config = {
      platform: platform.type,
      apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.quran.com',
      cacheSize: 100, // MB
      offlineMode: true,
      debugMode: process.env.NODE_ENV === 'development',
      features: {
        audioPlayer: true,
        bookmarks: true,
        search: true,
        tafsir: true,
        translations: true,
        notes: true,
        sharing: platform.capabilities.hasFileSystem,
        nightMode: true
      },
      ...config
    };

    // Create platform-specific services
    this.services = this.createServices(platform.type);
  }

  static getServices(): PlatformServices {
    if (!this.services) {
      throw new Error('PlatformServiceFactory not initialized. Call initialize() first.');
    }
    return this.services;
  }

  static getConfig(): PlatformConfig {
    if (!this.config) {
      throw new Error('PlatformServiceFactory not initialized. Call initialize() first.');
    }
    return this.config;
  }

  private static createServices(platform: Platform): PlatformServices {
    switch (platform) {
      case Platform.WEB:
        return this.createWebServices();
      case Platform.MOBILE:
        return this.createMobileServices();
      case Platform.DESKTOP:
        return this.createDesktopServices();
      case Platform.EXTENSION:
        return this.createExtensionServices();
      default:
        throw new Error(\`Unsupported platform: \${platform}\`);
    }
  }

  private static createWebServices(): PlatformServices {
    return {
      storage: this.createWebStorage(),
      network: this.createWebNetwork(),
      notifications: this.createWebNotifications(),
      navigation: this.createWebNavigation(),
      audio: this.createWebAudio()
    };
  }

  private static createMobileServices(): PlatformServices {
    return {
      storage: this.createMobileStorage(),
      network: this.createMobileNetwork(),
      notifications: this.createMobileNotifications(),
      navigation: this.createMobileNavigation(),
      audio: this.createMobileAudio()
    };
  }

  private static createDesktopServices(): PlatformServices {
    return {
      storage: this.createDesktopStorage(),
      network: this.createDesktopNetwork(),
      notifications: this.createDesktopNotifications(),
      navigation: this.createDesktopNavigation(),
      fileSystem: this.createDesktopFileSystem(),
      audio: this.createDesktopAudio()
    };
  }

  private static createExtensionServices(): PlatformServices {
    return {
      storage: this.createExtensionStorage(),
      network: this.createExtensionNetwork(),
      notifications: this.createExtensionNotifications(),
      navigation: this.createExtensionNavigation(),
      audio: this.createExtensionAudio()
    };
  }

  // Service creation methods (stubs - will be implemented per platform)
  private static createWebStorage() {
    // Import and return WebStorageService
    throw new Error('WebStorageService not implemented yet');
  }

  private static createWebNetwork() {
    // Import and return WebNetworkService
    throw new Error('WebNetworkService not implemented yet');
  }

  private static createWebNotifications() {
    // Import and return WebNotificationService
    throw new Error('WebNotificationService not implemented yet');
  }

  private static createWebNavigation() {
    // Import and return WebNavigationService
    throw new Error('WebNavigationService not implemented yet');
  }

  private static createWebAudio() {
    // Import and return WebAudioService
    throw new Error('WebAudioService not implemented yet');
  }

  // Similar stub methods for other platforms...
  private static createMobileStorage() { throw new Error('Not implemented'); }
  private static createMobileNetwork() { throw new Error('Not implemented'); }
  private static createMobileNotifications() { throw new Error('Not implemented'); }
  private static createMobileNavigation() { throw new Error('Not implemented'); }
  private static createMobileAudio() { throw new Error('Not implemented'); }

  private static createDesktopStorage() { throw new Error('Not implemented'); }
  private static createDesktopNetwork() { throw new Error('Not implemented'); }
  private static createDesktopNotifications() { throw new Error('Not implemented'); }
  private static createDesktopNavigation() { throw new Error('Not implemented'); }
  private static createDesktopFileSystem() { throw new Error('Not implemented'); }
  private static createDesktopAudio() { throw new Error('Not implemented'); }

  private static createExtensionStorage() { throw new Error('Not implemented'); }
  private static createExtensionNetwork() { throw new Error('Not implemented'); }
  private static createExtensionNotifications() { throw new Error('Not implemented'); }
  private static createExtensionNavigation() { throw new Error('Not implemented'); }
  private static createExtensionAudio() { throw new Error('Not implemented'); }
}

// Convenience hooks for React components
export const usePlatformServices = () => {
  return PlatformServiceFactory.getServices();
};

export const usePlatformConfig = () => {
  return PlatformServiceFactory.getConfig();
};`;

    fs.writeFileSync('src/platforms/shared/services/ServiceFactory.ts', content);
    console.log('   Generated: Service factory');
  }

  // Platform-specific generators
  async generateMobilePlatform(options) {
    console.log('📱 Generating React Native mobile platform...');

    const mobileDirs = [
      'src/platforms/mobile',
      'src/platforms/mobile/components',
      'src/platforms/mobile/screens',
      'src/platforms/mobile/navigation',
      'src/platforms/mobile/services',
      'src/platforms/mobile/storage',
      'src/platforms/mobile/hooks',
      'src/platforms/mobile/__tests__',
    ];

    for (const dir of mobileDirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.generateMobilePackageJson();
    await this.generateMobileServices();
    await this.generateMobileComponents();
    await this.generateMobileNavigation();

    console.log('   Mobile platform structure created');
  }

  async generateDesktopPlatform(options) {
    console.log('🖥️  Generating Electron desktop platform...');

    const desktopDirs = [
      'src/platforms/desktop',
      'src/platforms/desktop/main',
      'src/platforms/desktop/renderer',
      'src/platforms/desktop/services',
      'src/platforms/desktop/windows',
      'src/platforms/desktop/ipc',
      'src/platforms/desktop/__tests__',
    ];

    for (const dir of desktopDirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.generateDesktopPackageJson();
    await this.generateDesktopMain();
    await this.generateDesktopServices();
    await this.generateDesktopIPC();

    console.log('   Desktop platform structure created');
  }

  async generateExtensionPlatform(options) {
    console.log('🧩 Generating browser extension platform...');

    const extensionDirs = [
      'src/platforms/extension',
      'src/platforms/extension/background',
      'src/platforms/extension/content',
      'src/platforms/extension/popup',
      'src/platforms/extension/options',
      'src/platforms/extension/services',
      'src/platforms/extension/__tests__',
    ];

    for (const dir of extensionDirs) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await this.generateExtensionManifest();
    await this.generateExtensionBackground();
    await this.generateExtensionServices();
    await this.generateExtensionPopup();

    console.log('   Extension platform structure created');
  }

  // Mobile-specific generators
  async generateMobilePackageJson() {
    const content = {
      name: 'quran-mobile',
      version: '1.0.0',
      main: 'index.js',
      scripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        start: 'react-native start',
        test: 'jest',
        lint: 'eslint .',
        'build:android': 'cd android && ./gradlew assembleRelease',
        'build:ios':
          'cd ios && xcodebuild -workspace QuranApp.xcworkspace -scheme QuranApp -configuration Release -destination generic/platform=iOS -archivePath QuranApp.xcarchive archive',
      },
      dependencies: {
        react: '^18.2.0',
        'react-native': '^0.72.0',
        '@react-navigation/native': '^6.1.0',
        '@react-navigation/stack': '^6.3.0',
        '@react-native-async-storage/async-storage': '^1.19.0',
        'react-native-track-player': '^4.0.0',
        'react-native-vector-icons': '^10.0.0',
      },
    };

    fs.writeFileSync('src/platforms/mobile/package.json', JSON.stringify(content, null, 2));
  }

  async generateMobileServices() {
    const content = `/**
 * Mobile Platform Services
 * 
 * React Native specific service implementations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-netinfo/netinfo';
import { Platform } from 'react-native';
import { 
  IPlatformStorage, 
  IPlatformNetwork, 
  ConnectionType 
} from '../../shared/types';

export class MobileStorageService implements IPlatformStorage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('MobileStorage.getItem error:', error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('MobileStorage.setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('MobileStorage.removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('MobileStorage.clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('MobileStorage.getAllKeys error:', error);
      return [];
    }
  }
}

export class MobileNetworkService implements IPlatformNetwork {
  async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  async getConnectionType(): Promise<ConnectionType> {
    const state = await NetInfo.fetch();
    
    switch (state.type) {
      case 'wifi': return ConnectionType.WIFI;
      case 'cellular': return ConnectionType.CELLULAR;
      case 'ethernet': return ConnectionType.ETHERNET;
      case 'none': return ConnectionType.NONE;
      default: return ConnectionType.UNKNOWN;
    }
  }

  onConnectionChange(callback: (isOnline: boolean) => void): () => void {
    return NetInfo.addEventListener(state => {
      callback(state.isConnected ?? false);
    });
  }
}`;

    fs.writeFileSync('src/platforms/mobile/services/index.ts', content);
  }

  async generateMobileComponents() {
    const content = `/**
 * Mobile-Specific Components
 * 
 * React Native components that wrap shared business logic.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useVerseListing } from '../../../shared/hooks/useVerseListing';

interface MobileVerseCardProps {
  verseId: string;
  onPress?: () => void;
}

export const MobileVerseCard: React.FC<MobileVerseCardProps> = ({
  verseId,
  onPress
}) => {
  const { verse, loading } = useVerseListing({ verseId });

  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  if (!verse) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.arabicText}>{verse.arabicText}</Text>
      <Text style={styles.translation}>{verse.translation?.text}</Text>
      <Text style={styles.reference}>
        Surah {verse.surahId}, Ayah {verse.ayahNumber}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  arabicText: {
    fontSize: 18,
    fontFamily: 'Scheherazade', // Arabic font
    textAlign: 'right',
    marginBottom: 8,
    lineHeight: 28,
  },
  translation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 24,
  },
  reference: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  loading: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});`;

    fs.writeFileSync('src/platforms/mobile/components/MobileVerseCard.tsx', content);
  }

  async generateMobileNavigation() {
    const content = `/**
 * Mobile Navigation Setup
 * 
 * React Navigation configuration for the mobile app.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screen components (to be created)
import HomeScreen from '../screens/HomeScreen';
import SurahScreen from '../screens/SurahScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Bookmarks') {
          iconName = 'bookmark';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1B4332',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
  </Tab.Navigator>
);

export const MobileNavigation = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Surah" 
        component={SurahScreen} 
        options={{ title: 'Surah' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);`;

    fs.writeFileSync('src/platforms/mobile/navigation/index.tsx', content);
  }

  // Desktop-specific generators
  async generateDesktopPackageJson() {
    const content = {
      name: 'quran-desktop',
      version: '1.0.0',
      main: 'dist/main.js',
      scripts: {
        dev: 'electron-forge start',
        build: 'electron-forge make',
        package: 'electron-forge package',
        make: 'electron-forge make',
        publish: 'electron-forge publish',
      },
      dependencies: {
        electron: '^25.0.0',
        'electron-store': '^8.1.0',
        'electron-updater': '^6.1.0',
      },
      devDependencies: {
        '@electron-forge/cli': '^6.2.0',
        '@electron-forge/maker-squirrel': '^6.2.0',
        '@electron-forge/maker-zip': '^6.2.0',
        '@electron-forge/maker-deb': '^6.2.0',
        '@electron-forge/maker-rpm': '^6.2.0',
      },
    };

    fs.writeFileSync('src/platforms/desktop/package.json', JSON.stringify(content, null, 2));
  }

  async generateDesktopMain() {
    const content = `/**
 * Electron Main Process
 * 
 * Main process entry point for the desktop application.
 */

import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';

class DesktopApp {
  private mainWindow: BrowserWindow | null = null;
  private store: Store;

  constructor() {
    this.store = new Store();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await app.whenReady();
    
    this.createMainWindow();
    this.setupMenu();
    this.setupIPC();
    this.setupAutoUpdater();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      titleBarStyle: 'hiddenInset',
      show: false,
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile('dist/index.html');
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  private setupMenu(): void {
    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Window',
            accelerator: 'CmdOrCtrl+N',
            click: () => this.createMainWindow(),
          },
          { type: 'separator' },
          {
            role: 'quit',
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  private setupIPC(): void {
    ipcMain.handle('store-get', (_, key) => {
      return this.store.get(key);
    });

    ipcMain.handle('store-set', (_, key, value) => {
      this.store.set(key, value);
    });

    ipcMain.handle('store-delete', (_, key) => {
      this.store.delete(key);
    });

    ipcMain.handle('app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('show-save-dialog', async () => {
      const { dialog } = require('electron');
      return await dialog.showSaveDialog(this.mainWindow!, {
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });
    });
  }

  private setupAutoUpdater(): void {
    if (process.env.NODE_ENV === 'production') {
      autoUpdater.checkForUpdatesAndNotify();
    }
  }
}

new DesktopApp();`;

    fs.writeFileSync('src/platforms/desktop/main/index.ts', content);
  }

  async generateDesktopServices() {
    const content = `/**
 * Desktop Platform Services
 * 
 * Electron-specific service implementations.
 */

import { ipcRenderer } from 'electron';
import { IPlatformStorage, IPlatformFileSystem } from '../../shared/types';

export class DesktopStorageService implements IPlatformStorage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      return await ipcRenderer.invoke('store-get', key);
    } catch (error) {
      console.error('DesktopStorage.getItem error:', error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await ipcRenderer.invoke('store-set', key, value);
    } catch (error) {
      console.error('DesktopStorage.setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await ipcRenderer.invoke('store-delete', key);
    } catch (error) {
      console.error('DesktopStorage.removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    // Desktop apps typically don't clear all storage
    throw new Error('Clear all storage not supported on desktop');
  }

  async getAllKeys(): Promise<string[]> {
    // Implementation depends on electron-store API
    return [];
  }
}

export class DesktopFileSystemService implements IPlatformFileSystem {
  async readFile(path: string): Promise<string> {
    return await ipcRenderer.invoke('fs-read-file', path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    await ipcRenderer.invoke('fs-write-file', path, content);
  }

  async exists(path: string): Promise<boolean> {
    return await ipcRenderer.invoke('fs-exists', path);
  }

  async delete(path: string): Promise<void> {
    await ipcRenderer.invoke('fs-delete', path);
  }

  async createDirectory(path: string): Promise<void> {
    await ipcRenderer.invoke('fs-create-directory', path);
  }

  async listFiles(directory: string): Promise<string[]> {
    return await ipcRenderer.invoke('fs-list-files', directory);
  }
}`;

    fs.writeFileSync('src/platforms/desktop/services/index.ts', content);
  }

  async generateDesktopIPC() {
    const content = `/**
 * Electron IPC Preload Script
 * 
 * Exposes safe APIs to the renderer process.
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // App info
  version: () => ipcRenderer.invoke('app-version'),

  // Storage
  store: {
    get: (key: string) => ipcRenderer.invoke('store-get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('store-set', key, value),
    delete: (key: string) => ipcRenderer.invoke('store-delete', key),
  },

  // File system
  fs: {
    readFile: (path: string) => ipcRenderer.invoke('fs-read-file', path),
    writeFile: (path: string, content: string) => ipcRenderer.invoke('fs-write-file', path, content),
    exists: (path: string) => ipcRenderer.invoke('fs-exists', path),
    delete: (path: string) => ipcRenderer.invoke('fs-delete', path),
    createDirectory: (path: string) => ipcRenderer.invoke('fs-create-directory', path),
    listFiles: (directory: string) => ipcRenderer.invoke('fs-list-files', directory),
  },

  // Dialogs
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
});

// Type definitions for TypeScript
declare global {
  interface Window {
    electron: {
      version(): Promise<string>;
      store: {
        get(key: string): Promise<unknown>;
        set(key: string, value: unknown): Promise<void>;
        delete(key: string): Promise<void>;
      };
      fs: {
        readFile(path: string): Promise<string>;
        writeFile(path: string, content: string): Promise<void>;
        exists(path: string): Promise<boolean>;
        delete(path: string): Promise<void>;
        createDirectory(path: string): Promise<void>;
        listFiles(directory: string): Promise<string[]>;
      };
      showSaveDialog(): Promise<unknown>;
    };
  }
}`;

    fs.writeFileSync('src/platforms/desktop/ipc/preload.ts', content);
  }

  // Extension-specific generators
  async generateExtensionManifest() {
    const content = {
      manifest_version: 3,
      name: 'Quran Reader Extension',
      version: '1.0.0',
      description: 'Read Quran verses with translations and tafsir',
      permissions: ['storage', 'notifications', 'activeTab'],
      background: {
        service_worker: 'background.js',
      },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['content.js'],
        },
      ],
      action: {
        default_popup: 'popup.html',
        default_title: 'Quran Reader',
      },
      options_page: 'options.html',
      icons: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png',
      },
    };

    fs.writeFileSync('src/platforms/extension/manifest.json', JSON.stringify(content, null, 2));
  }

  async generateExtensionBackground() {
    const content = `/**
 * Extension Background Script
 * 
 * Service worker for the browser extension.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Quran Reader Extension installed');
  
  // Set default settings
  chrome.storage.sync.set({
    defaultTranslation: 'en.sahih',
    fontSize: 'medium',
    theme: 'light'
  });
});

chrome.notifications.onClicked.addListener((notificationId) => {
  // Handle notification clicks
  console.log('Notification clicked:', notificationId);
});

chrome.action.onClicked.addListener((tab) => {
  // Handle extension icon clicks
  chrome.tabs.create({ url: 'popup.html' });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'GET_VERSE':
      handleGetVerse(request.surahId, request.ayahNumber)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true; // Keep message channel open
      
    case 'SAVE_BOOKMARK':
      handleSaveBookmark(request.verse)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true;
  }
});

async function handleGetVerse(surahId, ayahNumber) {
  try {
    const response = await fetch(\`https://api.quran.com/api/v4/verses/by_key/\${surahId}:\${ayahNumber}\`);
    const data = await response.json();
    return { verse: data.verse };
  } catch (error) {
    throw new Error('Failed to fetch verse');
  }
}

async function handleSaveBookmark(verse) {
  try {
    const result = await chrome.storage.sync.get(['bookmarks']);
    const bookmarks = result.bookmarks || [];
    bookmarks.push({
      id: \`\${verse.surahId}:\${verse.ayahNumber}\`,
      verse,
      createdAt: new Date().toISOString()
    });
    
    await chrome.storage.sync.set({ bookmarks });
    return { success: true };
  } catch (error) {
    throw new Error('Failed to save bookmark');
  }
}`;

    fs.writeFileSync('src/platforms/extension/background/index.ts', content);
  }

  async generateExtensionServices() {
    const content = `/**
 * Extension Platform Services
 * 
 * Browser extension specific service implementations.
 */

import { IPlatformStorage, IPlatformNotifications, PlatformNotification } from '../../shared/types';

export class ExtensionStorageService implements IPlatformStorage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const result = await chrome.storage.sync.get([key]);
      return result[key] || null;
    } catch (error) {
      console.error('ExtensionStorage.getItem error:', error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await chrome.storage.sync.set({ [key]: value });
    } catch (error) {
      console.error('ExtensionStorage.setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await chrome.storage.sync.remove([key]);
    } catch (error) {
      console.error('ExtensionStorage.removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await chrome.storage.sync.clear();
    } catch (error) {
      console.error('ExtensionStorage.clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const result = await chrome.storage.sync.get();
      return Object.keys(result);
    } catch (error) {
      console.error('ExtensionStorage.getAllKeys error:', error);
      return [];
    }
  }
}

export class ExtensionNotificationService implements IPlatformNotifications {
  async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.permissions.request(
        { permissions: ['notifications'] },
        (granted) => resolve(granted)
      );
    });
  }

  async show(notification: PlatformNotification): Promise<void> {
    await chrome.notifications.create(notification.id, {
      type: 'basic',
      iconUrl: notification.icon || 'icons/icon48.png',
      title: notification.title,
      message: notification.body
    });
  }

  async cancel(id: string): Promise<void> {
    await chrome.notifications.clear(id);
  }

  async cancelAll(): Promise<void> {
    const notifications = await chrome.notifications.getAll();
    await Promise.all(
      Object.keys(notifications).map(id => chrome.notifications.clear(id))
    );
  }
}`;

    fs.writeFileSync('src/platforms/extension/services/index.ts', content);
  }

  async generateExtensionPopup() {
    const content = `/**
 * Extension Popup Component
 * 
 * Main UI for the browser extension popup.
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ExtensionStorageService } from '../services';

const PopupApp: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);

  const storage = new ExtensionStorageService();

  useEffect(() => {
    loadBookmarks();
    loadRandomVerse();
  }, []);

  const loadBookmarks = async () => {
    const savedBookmarks = await storage.getItem('bookmarks');
    setBookmarks(savedBookmarks || []);
  };

  const loadRandomVerse = async () => {
    setLoading(true);
    try {
      // Get random verse (simplified)
      const surahId = Math.floor(Math.random() * 114) + 1;
      const ayahNumber = 1;
      
      const response = await chrome.runtime.sendMessage({
        type: 'GET_VERSE',
        surahId,
        ayahNumber
      });
      
      if (response.verse) {
        setCurrentVerse(response.verse);
      }
    } catch (error) {
      console.error('Failed to load verse:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async () => {
    if (!currentVerse) return;

    try {
      await chrome.runtime.sendMessage({
        type: 'SAVE_BOOKMARK',
        verse: currentVerse
      });
      
      await loadBookmarks();
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Bookmark Saved',
        message: 'Verse has been bookmarked successfully'
      });
    } catch (error) {
      console.error('Failed to save bookmark:', error);
    }
  };

  return (
    <div style={{ width: '400px', padding: '16px' }}>
      <header style={{ marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
        <h1 style={{ margin: 0, fontSize: '18px', color: '#1B4332' }}>
          Quran Reader
        </h1>
      </header>

      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading...
          </div>
        ) : currentVerse ? (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              fontSize: '16px', 
              fontFamily: 'serif', 
              textAlign: 'right',
              marginBottom: '8px',
              lineHeight: '1.6'
            }}>
              {currentVerse.text_uthmani}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              {currentVerse.translations?.[0]?.text}
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              Surah {currentVerse.verse_key}
            </div>
            
            <button 
              onClick={saveBookmark}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                background: '#1B4332',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Bookmark
            </button>
          </div>
        ) : null}

        <div>
          <h3 style={{ fontSize: '14px', margin: '16px 0 8px' }}>Recent Bookmarks</h3>
          {bookmarks.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#999' }}>No bookmarks yet</p>
          ) : (
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              {bookmarks.slice(0, 5).map((bookmark, index) => (
                <div key={index} style={{ 
                  padding: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '12px'
                }}>
                  <div>{bookmark.verse.verse_key}</div>
                  <div style={{ color: '#666' }}>
                    {bookmark.verse.translations?.[0]?.text?.substring(0, 60)}...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer style={{ marginTop: '16px', textAlign: 'center' }}>
        <button 
          onClick={loadRandomVerse}
          style={{
            padding: '6px 12px',
            background: '#52B69A',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          New Verse
        </button>
      </footer>
    </div>
  );
};

// Initialize the popup
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<PopupApp />);`;

    fs.writeFileSync('src/platforms/extension/popup/index.tsx', content);
  }

  // Test generation
  async generatePlatformTests(platformType) {
    console.log(`🧪 Generating ${platformType} platform tests...`);

    const testContent = `/**
 * ${platformType.charAt(0).toUpperCase() + platformType.slice(1)} Platform Tests
 * 
 * Tests for ${platformType}-specific implementations.
 */

import { Platform, PlatformDetector } from '../../shared/utils/platformDetection';

describe('${platformType.charAt(0).toUpperCase() + platformType.slice(1)} Platform', () => {
  beforeEach(() => {
    // Mock platform-specific globals
    ${this.generatePlatformMocks(platformType)}
  });

  describe('Platform Detection', () => {
    it('should detect ${platformType} platform correctly', () => {
      const platform = PlatformDetector.detect();
      expect(platform.type).toBe(Platform.${platformType.toUpperCase()});
    });

    it('should have correct capabilities for ${platformType}', () => {
      const platform = PlatformDetector.detect();
      ${this.generateCapabilityTests(platformType)}
    });
  });

  describe('Platform Services', () => {
    ${this.generateServiceTests(platformType)}
  });
});`;

    const testDir = `src/platforms/${platformType}/__tests__`;
    fs.writeFileSync(path.join(testDir, 'platform.test.ts'), testContent);
    console.log(`   Generated: ${platformType} platform tests`);
  }

  generatePlatformMocks(platformType) {
    switch (platformType) {
      case 'mobile':
        return `// Mock React Native environment
        global.navigator = { userAgent: 'React Native' };
        global.window = { ReactNativeWebView: true };`;
      case 'desktop':
        return `// Mock Electron environment
        global.window = { electron: { version: '25.0.0' } };`;
      case 'extension':
        return `// Mock Chrome extension environment
        global.window = { chrome: { runtime: { id: 'test' } } };
        global.chrome = { 
          runtime: { id: 'test' },
          storage: { sync: {} }
        };`;
      default:
        return '// Default web environment';
    }
  }

  generateCapabilityTests(platformType) {
    const capabilities = {
      mobile: 'expect(platform.capabilities.hasCamera).toBe(true);',
      desktop: 'expect(platform.capabilities.hasFileSystem).toBe(true);',
      extension: 'expect(platform.capabilities.supportsNotifications).toBe(true);',
    };

    return capabilities[platformType] || 'expect(platform.capabilities).toBeDefined();';
  }

  generateServiceTests(platformType) {
    return `it('should create ${platformType} storage service', () => {
      // Test ${platformType}-specific storage implementation
      expect(true).toBe(true); // TODO: Implement actual test
    });

    it('should handle ${platformType}-specific features', () => {
      // Test platform-specific functionality
      expect(true).toBe(true); // TODO: Implement actual test
    });`;
  }

  async updateConfigurationFiles(platformType) {
    console.log(`⚙️ Updating configuration for ${platformType}...`);

    // Update package.json scripts
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts[`dev:${platformType}`] =
        `cd src/platforms/${platformType} && npm run dev`;
      packageJson.scripts[`build:${platformType}`] =
        `cd src/platforms/${platformType} && npm run build`;
      packageJson.scripts[`test:${platformType}`] = `jest src/platforms/${platformType}`;

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Update TypeScript config
    const tsconfigPath = 'tsconfig.json';
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

      tsconfig.compilerOptions = tsconfig.compilerOptions || {};
      tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};
      tsconfig.compilerOptions.paths[`@platforms/${platformType}/*`] = [
        `src/platforms/${platformType}/*`,
      ];

      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    console.log(`   Updated configuration files for ${platformType}`);
  }

  displayNextSteps(platformType) {
    console.log(
      `\n📋 Next Steps for ${platformType.charAt(0).toUpperCase() + platformType.slice(1)} Platform:`
    );

    switch (platformType) {
      case 'mobile':
        console.log('1. Install React Native CLI: npm install -g @react-native-community/cli');
        console.log('2. Setup development environment: npx react-native doctor');
        console.log('3. Generate platform-specific components');
        console.log('4. Implement navigation with React Navigation');
        console.log('5. Test on iOS/Android simulators');
        break;

      case 'desktop':
        console.log('1. Install Electron Forge: npm install --save-dev @electron-forge/cli');
        console.log('2. Setup main process and IPC handlers');
        console.log('3. Create renderer process components');
        console.log('4. Implement native menus and dialogs');
        console.log('5. Test packaging and distribution');
        break;

      case 'extension':
        console.log('1. Load extension in Chrome Developer Mode');
        console.log('2. Implement background script functionality');
        console.log('3. Create popup UI components');
        console.log('4. Add content script integration');
        console.log('5. Test permissions and API usage');
        break;
    }

    console.log('\nCommon Next Steps:');
    console.log('• Implement platform-specific service methods');
    console.log('• Create shared business logic integration');
    console.log('• Add comprehensive testing');
    console.log('• Setup CI/CD for the platform');
    console.log(`• Run: npm run dev:${platformType} to start development`);
  }
}

// CLI interface
if (require.main === module) {
  const platformType = process.argv[2];

  if (!platformType) {
    console.log('Usage: node platform-generator.js <platform-type>');
    console.log('Available platforms: mobile, desktop, extension');
    console.log('');
    console.log('Examples:');
    console.log('  node platform-generator.js mobile    # Generate React Native mobile app');
    console.log('  node platform-generator.js desktop   # Generate Electron desktop app');
    console.log('  node platform-generator.js extension # Generate browser extension');
    process.exit(1);
  }

  const generator = new AIPlatformGenerator();
  generator.generatePlatform(platformType).catch(console.error);
}

module.exports = AIPlatformGenerator;
