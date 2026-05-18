import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWizardStore } from '../../hooks/useWizardStore'
import { AnimatedButton, GlassCard, ProgressBar, LoadingSkeleton } from '../../components/GlassCard'
import { FolderGit, FileCode, CheckCircle, AlertCircle } from 'lucide-react'

interface Screen2_ConsolidationProps {
  onNext: () => void
  onBack: () => void
}

export default function Screen2_Consolidation({ onNext, onBack }: Screen2_ConsolidationProps) {
  const {
    repoPath,
    branch,
    consolidationComplete,
    gapsIdentified,
    setRepoPath,
    setBranch,
    setConsolidationComplete,
    setGapsIdentified,
  } = useWizardStore()

  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [consolidationReport, setConsolidationReport] = useState<any>(null)

  const analyzeCodebase = async () => {
    setAnalyzing(true)
    setAnalysisProgress(0)

    try {
      // Simulate codebase analysis with progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setAnalysisProgress(i)
      }

      // Mock analysis results
      setConsolidationReport({
        services: [
          { name: 'Custom Post Types', location: '/includes/post-types.php', status: 'found' },
          { name: 'Custom Taxonomies', location: '/includes/taxonomies.php', status: 'found' },
          { name: 'Widget Areas', location: '/functions.php', status: 'found' },
        ],
        gaps: [
          { name: 'SEO Integration', description: 'Missing SEO meta tags', priority: 'high' },
          { name: 'Performance Optimization', description: 'No caching mechanism', priority: 'medium' },
        ],
        conflicts: [],
      })

      setGapsIdentified([
        { name: 'SEO Integration', description: 'Missing SEO meta tags', priority: 'high' },
        { name: 'Performance Optimization', description: 'No caching mechanism', priority: 'medium' },
      ])

      setConsolidationComplete(true)
    } catch (err) {
      console.error('Analysis failed:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Local Repository Consolidation</h2>
        <p className="text-gray-400">Merge remote theme with local codebase</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FolderGit size={24} className="text-purple-400" />
            Repository Connection
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Local Repository Path</label>
              <input
                type="text"
                value={repoPath}
                onChange={(e) => setRepoPath(e.target.value)}
                placeholder="/path/to/your/repository"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="main">main</option>
                <option value="master">master</option>
                <option value="develop">develop</option>
              </select>
            </div>

            <AnimatedButton
              onClick={analyzeCodebase}
              loading={analyzing}
              disabled={!repoPath}
              className="w-full"
              icon={FileCode}
            >
              Analyze Codebase
            </AnimatedButton>
          </div>
        </GlassCard>

        {analyzing && (
          <GlassCard>
            <h3 className="text-xl font-semibold text-white mb-4">Analyzing Codebase...</h3>
            <ProgressBar progress={analysisProgress} />
            <LoadingSkeleton lines={5} className="mt-4" />
          </GlassCard>
        )}

        {consolidationComplete && consolidationReport && (
          <>
            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-400" />
                Services Identified
              </h3>
              <div className="space-y-3">
                {consolidationReport.services.map((service: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{service.name}</span>
                      <span className="text-green-400 text-sm">{service.status}</span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{service.location}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={24} className="text-yellow-400" />
                Gaps Identified
              </h3>
              <div className="space-y-3">
                {consolidationReport.gaps.map((gap: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{gap.name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        gap.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{gap.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-semibold text-white mb-4">Consolidation Report</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  The codebase analysis is complete. All identified services have been documented,
                  and gaps have been flagged for implementation. No conflicting files were found.
                </p>
                <p className="text-gray-300 mt-4">
                  Documentation has been generated and saved to <code className="bg-white/10 px-2 py-1 rounded">docs/consolidation/theme-analysis.md</code>
                </p>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {consolidationComplete && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between mt-8"
        >
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            ← Back
          </button>
          <AnimatedButton onClick={onNext}>
            Continue to Specification →
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  )
}
