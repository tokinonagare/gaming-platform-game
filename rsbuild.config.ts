import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'gameApp',
      filename: 'remoteEntry.js',
      
      // Provider - 只暴露组件，不消费其他Remote
      exposes: {
        './App': './src/App'
      },

      // 消费共享库
      remotes: {
        sharedLib: 'sharedLib@http://localhost:3100/remoteEntry.js'
      },

      // 共享依赖
      shared: {
        'react': {
          singleton: true,
          eager: false,
          requiredVersion: '^19.0.0'
        },
        'react-dom': {
          singleton: true,
          eager: false,
          requiredVersion: '^19.0.0'
        },
        'axios': {
          singleton: true,
          eager: false,
          requiredVersion: '^1.0.0'
        }
      },

      dts: false
    })
  ],

  source: { entry: { index: './src/main.tsx' } },
  dev: { port: 3002, host: '0.0.0.0' },
  html: { template: './src/index.html', title: '🎮 Game Service' },
  output: { distPath: { root: 'dist' }, assetPrefix: 'http://localhost:3002/' }
})