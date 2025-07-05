import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // Security and Performance Configuration
  define: {
    // Environment-specific settings
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  
  build: {
    // Security: Minify and obfuscate code in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Only remove console.log in production
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : []
      },
      mangle: {
        toplevel: process.env.NODE_ENV === 'production' // Only obfuscate in production
      },
      format: {
        comments: process.env.NODE_ENV === 'production' ? false : true // Keep comments in development
      }
    },
    
    // Performance: Code splitting and chunking
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          supabase: ['@supabase/supabase-js']
        },
        // Security: Randomize chunk names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Performance optimizations
    sourcemap: false, // Disable sourcemaps for security
    cssCodeSplit: true,
    reportCompressedSize: false,
    
    // Security: Set file size limits
    chunkSizeWarningLimit: 1000
  },
  
  // Performance: Resolve aliases for faster imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@admin': resolve(__dirname, 'src/admin'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@assets': resolve(__dirname, 'src/assets')
    },
    // Fix for Supabase ESM/CommonJS issues
    dedupe: ['@supabase/supabase-js']
  },
  
  // Development server configuration
  server: {
    port: 3003,
    host: '0.0.0.0',
    strictPort: true,
    
    // Fix HMR connection issues
    hmr: {
      port: 3003,
      host: 'localhost',
      overlay: false
    },
    
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    },
    
    open: false, // Disable auto-open to prevent connection issues
    cors: true
  },
  
  // Performance: Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js',
      '@supabase/gotrue-js'
    ],
    exclude: []
  },
  
  // Security: Prevent path traversal
  publicDir: 'public',
  
  // Performance: CSS optimization
  css: {
    devSourcemap: false
  }
})
