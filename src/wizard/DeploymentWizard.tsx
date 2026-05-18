import { motion } from 'framer-motion'
import { GlassCard, ProgressBar, AnimatedButton } from './components/GlassCard'
import { useWizardStore } from './hooks/useWizardStore'
import { Rocket, CheckCircle, Loader, Play } from 'lucide-react'

export default function DeploymentWizard() {
  const { implementationPlan, taskAssignments } = useWizardStore()

  if (!implementationPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <GlassCard className="text-center p-12">
          <h2 className="text-2xl font-bold text-white mb-4">No Implementation Plan</h2>
          <p className="text-gray-400">Please complete the setup wizard first.</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <Rocket size={64} className="mx-auto text-purple-400 mb-4" />
          <h1 className="text-5xl font-bold gradient-text mb-4">Deployment Wizard</h1>
          <p className="text-gray-400 text-lg">Execute your implementation plan step by step</p>
        </motion.div>

        <GlassCard className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Task Overview</h2>
          
          <div className="space-y-4">
            {implementationPlan.tasks.map((task: any, index: number) => {
              const assignedAgents = taskAssignments[task.id] || []
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 gradient-bg text-white rounded">
                          {task.id}
                        </span>
                        <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                      </div>
                      <p className="text-gray-400 mt-2">{task.description}</p>
                      
                      <div className="flex items-center gap-4 mt-4">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {task.priority} priority
                        </span>
                        <span className="text-gray-400 text-sm">
                          {task.estimated_hours}h estimated
                        </span>
                        {assignedAgents.length > 0 && (
                          <span className="text-purple-400 text-sm">
                            {assignedAgents.length} agent(s) assigned
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <AnimatedButton icon={Play} variant="secondary">
                      Execute
                    </AnimatedButton>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-6">Deployment Progress</h2>
          
          <div className="space-y-6">
            <ProgressBar progress={0} showLabel={true} />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-green-400">0</p>
                <p className="text-gray-400 text-sm mt-1">Completed</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-yellow-400">0</p>
                <p className="text-gray-400 text-sm mt-1">In Progress</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <p className="text-2xl font-bold text-white">{implementationPlan.tasks.length}</p>
                <p className="text-gray-400 text-sm mt-1">Pending</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
