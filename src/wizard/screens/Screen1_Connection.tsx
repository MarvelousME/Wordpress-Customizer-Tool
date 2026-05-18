import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWizardStore } from '../../hooks/useWizardStore'
import { AnimatedButton, Alert, GlassCard } from '../../components/GlassCard'
import { Wifi, CheckCircle, XCircle, Loader, Download } from 'lucide-react'

interface Screen1_ConnectionProps {
  onNext: () => void
}

export default function Screen1_Connection({ onNext }: Screen1_ConnectionProps) {
  const {
    remoteUrl,
    username,
    password,
    connectionTested,
    connectionSuccess,
    themeImported,
    themeInfo,
    setRemoteUrl,
    setUsername,
    setPassword,
    setConnectionTested,
    setThemeImported,
    setThemeInfo,
  } = useWizardStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const testConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call to test WordPress connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In production, this would call the actual API endpoint
      // POST /api/connection/test
      const mockSuccess = true // This should come from actual API response
      
      if (mockSuccess) {
        setConnectionTested(true, true)
        setThemeInfo({
          name: 'Twenty Twenty-Four',
          version: '1.0.0',
          author: 'WordPress Team',
          screenshot: 'https://via.placeholder.com/300x200',
        })
      } else {
        throw new Error('Connection failed. Please check your credentials.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnectionTested(true, false)
    } finally {
      setLoading(false)
    }
  }

  const importTheme = async () => {
    setImporting(true)
    setImportProgress(0)

    try {
      // Simulate theme import with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setImportProgress(i)
      }

      setThemeImported(true)
    } catch (err) {
      setError('Theme import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Remote WordPress Connection</h2>
        <p className="text-gray-400">Connect to your existing WordPress site</p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Wifi size={24} className="text-purple-400" />
            Connection Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Backend URL *</label>
              <input
                type="url"
                value={remoteUrl}
                onChange={(e) => setRemoteUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Password/App Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <AnimatedButton
              onClick={testConnection}
              loading={loading}
              disabled={!remoteUrl || !username || !password}
              className="w-full mt-4"
              icon={Wifi}
            >
              Test Connection
            </AnimatedButton>

            {connectionTested && connectionSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-400 mt-4"
              >
                <CheckCircle size={20} />
                <span>Connection successful!</span>
              </motion.div>
            )}

            {connectionTested && !connectionSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 mt-4"
              >
                <XCircle size={20} />
                <span>Connection failed</span>
              </motion.div>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4">Active Theme</h3>

          {themeInfo ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <img
                src={themeInfo.screenshot}
                alt={themeInfo.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div>
                <h4 className="text-lg font-semibold text-white">{themeInfo.name}</h4>
                <p className="text-gray-400 text-sm">Version: {themeInfo.version}</p>
                <p className="text-gray-400 text-sm">Author: {themeInfo.author}</p>
              </div>

              {!themeImported && (
                <AnimatedButton
                  onClick={importTheme}
                  loading={importing}
                  className="w-full"
                  icon={Download}
                >
                  Import Theme to Local
                </AnimatedButton>
              )}

              {importing && (
                <div className="mt-4">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-bg"
                      animate={{ width: `${importProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-2">
                    Importing... {importProgress}%
                  </p>
                </div>
              )}

              {themeImported && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <CheckCircle size={20} />
                  <span>Theme imported successfully!</span>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>Test connection to view theme information</p>
            </div>
          )}
        </GlassCard>
      </div>

      {connectionSuccess && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-end mt-8"
        >
          <AnimatedButton onClick={onNext}>
            Continue to Consolidation →
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  )
}
