import { motion } from 'framer-motion'
import { useWizardStore } from '../../hooks/useWizardStore'
import { GlassCard, AnimatedButton } from '../../components/GlassCard'
import { CheckCircle, Rocket, FileText, Bot, Wifi, FolderGit } from 'lucide-react'

interface Screen5_SummaryProps {
  onBack: () => void
}

export default function Screen5_Summary({ onBack }: Screen5_SummaryProps) {
  const {
    remoteUrl,
    connectionSuccess,
    themeImported,
    consolidationComplete,
    implementationPlan,
    agents,
    taskAssignments,
    setLaunchReady,
  } = useWizardStore()

  const handleLaunch = () => {
    setLaunchReady(true)
    // In production, this would trigger the deployment process
    console.log('Launching deployment...')
  }

  const summaryItems = [
    {
      icon: Wifi,
      title: 'Remote Connection',
      status: connectionSuccess ? 'Connected' : 'Not Connected',
      success: connectionSuccess,
      details: remoteUrl || 'No URL provided',
    },
    {
      icon: FolderGit,
      title: 'Theme Import',
      status: themeImported ? 'Imported' : 'Not Imported',
      success: themeImported,
      details: themeImported ? 'Theme successfully imported to local' : 'Theme import pending',
    },
    {
      icon: FileText,
      title: 'Consolidation',
      status: consolidationComplete ? 'Complete' : 'Pending',
      success: consolidationComplete,
      details: consolidationComplete ? 'Codebase analyzed and documented' : 'Analysis pending',
    },
    {
      icon: FileText,
      title: 'Implementation Plan',
      status: implementationPlan ? 'Generated' : 'Not Generated',
      success: !!implementationPlan,
      details: implementationPlan 
        ? `${implementationPlan.tasks?.length || 0} tasks, ${implementationPlan.timeline?.total_estimated_hours || 0}h estimated`
        : 'Plan not generated',
    },
    {
      icon: Bot,
      title: 'Agent Assignments',
      status: Object.keys(taskAssignments).length > 0 ? 'Assigned' : 'Not Assigned',
      success: Object.keys(taskAssignments).length > 0,
      details: `${agents.length} agents created, ${Object.keys(taskAssignments).length} tasks assigned`,
    },
  ]

  const allComplete = summaryItems.every(item => item.success)

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <Rocket size={64} className="mx-auto text-purple-400 mb-4" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Ready to Launch!</h2>
        <p className="text-gray-400">Review your configuration and start deployment</p>
      </div>

      <GlassCard>
        <h3 className="text-xl font-semibold text-white mb-6">Configuration Summary</h3>
        
        <div className="space-y-4">
          {summaryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className={`p-3 rounded-lg ${item.success ? 'gradient-bg' : 'bg-gray-500/20'}`}>
                <item.icon size={24} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-medium">{item.title}</h4>
                  {item.success ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">{item.details}</p>
                <p className={`text-xs mt-2 ${item.success ? 'text-green-400' : 'text-yellow-400'}`}>
                  Status: {item.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {allComplete && (
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4">Project Overview</h3>
          
          {implementationPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold gradient-text">
                    {implementationPlan.tasks?.length || 0}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Total Tasks</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold gradient-text">
                    {implementationPlan.timeline?.total_estimated_hours || 0}h
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Estimated Time</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <p className="text-3xl font-bold gradient-text">
                    {agents.length}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">AI Agents</p>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      )}

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
        
        <AnimatedButton
          onClick={handleLaunch}
          disabled={!allComplete}
          className="px-12 py-4 text-lg"
          icon={Rocket}
        >
          Deal With Line!
        </AnimatedButton>
      </motion.div>

      {!allComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-yellow-400 text-sm mt-4"
        >
          Please complete all previous steps before launching
        </motion.p>
      )}
    </div>
  )
}
