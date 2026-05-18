import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWizardStore } from '../../hooks/useWizardStore'
import { AnimatedButton, GlassCard, Alert } from '../../components/GlassCard'
import { Upload, FileText, Image, CheckCircle } from 'lucide-react'

interface Screen3_SpecificationProps {
  onNext: () => void
  onBack: () => void
}

export default function Screen3_Specification({ onNext, onBack }: Screen3_SpecificationProps) {
  const {
    specificationFile,
    specificationText,
    logoFile,
    implementationPlan,
    setSpecificationFile,
    setSpecificationText,
    setLogoFile,
    setImplementationPlan,
  } = useWizardStore()

  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['application/pdf', 'text/plain', 'text/markdown']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, TXT, or MD file')
        return
      }
      setSpecificationFile(file)
      setError(null)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PNG, JPG, or SVG file')
        return
      }
      setLogoFile(file)
      setError(null)
    }
  }

  const generatePlan = async () => {
    if (!specificationText && !specificationFile) {
      setError('Please provide a specification via file upload or text input')
      return
    }

    setGenerating(true)
    setError(null)

    try {
      // Simulate plan generation
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock implementation plan
      setImplementationPlan({
        project_name: 'WordPress Customization Project',
        objective: 'Customize WordPress site with enhanced features',
        generated_at: new Date().toISOString(),
        tasks: [
          {
            id: 'TASK-001',
            title: 'Setup Development Environment',
            description: 'Configure Docker and local development stack',
            status: 'pending',
            priority: 'high',
            estimated_hours: 4,
            dependencies: [],
            required_skills: ['DevOps', 'Docker'],
            deliverables: ['docker-compose.yml', '.env'],
          },
          {
            id: 'TASK-002',
            title: 'Implement SEO Features',
            description: 'Add meta tags, Open Graph, and schema markup',
            status: 'pending',
            priority: 'high',
            estimated_hours: 8,
            dependencies: ['TASK-001'],
            required_skills: ['PHP', 'WordPress'],
            deliverables: ['seo-functions.php'],
          },
          {
            id: 'TASK-003',
            title: 'Performance Optimization',
            description: 'Implement caching and asset optimization',
            status: 'pending',
            priority: 'medium',
            estimated_hours: 12,
            dependencies: ['TASK-001'],
            required_skills: ['PHP', 'JavaScript'],
            deliverables: ['cache-handler.php', 'optimized-assets/'],
          },
        ],
        timeline: {
          total_estimated_hours: 24,
          phases: ['Setup', 'Development', 'Testing'],
        },
      })
    } catch (err) {
      setError('Failed to generate implementation plan')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Specification & Objective</h2>
        <p className="text-gray-400">Upload project requirements and generate implementation plan</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Upload size={24} className="text-purple-400" />
            Upload Specification
          </h3>

          <div
            className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-white font-medium">Drop file here or click to upload</p>
            <p className="text-gray-500 text-sm mt-2">PDF, TXT, or MD</p>
            
            {specificationFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 text-green-400"
              >
                <CheckCircle size={20} />
                <span>{specificationFile.name}</span>
              </motion.div>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Image size={24} className="text-purple-400" />
            Upload Logo
          </h3>

          <div
            className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => logoInputRef.current?.click()}
          >
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <Image size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-white font-medium">Drop logo here or click to upload</p>
            <p className="text-gray-500 text-sm mt-2">PNG, JPG, or SVG</p>
            
            {logoFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 text-green-400"
              >
                <CheckCircle size={20} />
                <span>{logoFile.name}</span>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText size={24} className="text-purple-400" />
          Or Enter Specification Text
        </h3>
        <textarea
          value={specificationText}
          onChange={(e) => setSpecificationText(e.target.value)}
          placeholder="Describe your project requirements, features, and objectives..."
          className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
        />
      </GlassCard>

      {!implementationPlan ? (
        <AnimatedButton
          onClick={generatePlan}
          loading={generating}
          disabled={!specificationText && !specificationFile}
          className="w-full"
        >
          Generate Implementation Plan
        </AnimatedButton>
      ) : (
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-400" />
            Implementation Plan Generated
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>Project:</span>
              <span className="text-white">{implementationPlan.project_name}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Total Tasks:</span>
              <span className="text-white">{implementationPlan.tasks.length}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Estimated Hours:</span>
              <span className="text-white">{implementationPlan.timeline.total_estimated_hours}h</span>
            </div>
            
            <div className="mt-6">
              <h4 className="text-white font-medium mb-3">Tasks:</h4>
              <div className="space-y-2">
                {implementationPlan.tasks.map((task: any) => (
                  <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{task.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {implementationPlan && (
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
            Continue to Agents →
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  )
}
