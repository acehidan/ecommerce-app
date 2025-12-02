// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for TanStack Query ES modules
config.resolver.sourceExts.push('mjs', 'cjs');
config.resolver.unstable_enablePackageExports = true;

// Ensure proper resolution of @tanstack packages
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

module.exports = config;

