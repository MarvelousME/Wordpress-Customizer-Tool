import { motion, AnimatePresence } from 'framer-motion'
import { useWizardStore } from '../hooks/useWizardStore'
import Screen1_Connection from './screens/Screen1_Connection'
import Screen2_Consolidation from './screens/Screen2_Consolidation'
import Screen3_Specification from './screens/Screen3_Specification'
import Screen4_Agents from './screens/Screen4_Agents'
import Screen5_Summary from './screens/Screen5_Summary'
import { GlassCard, ProgressBar } from '../components/GlassCard'
import { CheckCircle, Circle } from 'lucide-react'

const screens = [
  { title: 'Connection', icon: '🔗' },
  { title: 'Consolidation', icon: '📦' },
  { title: 'Specification', icon: '📋' },
  { title: 'Agents', icon: '🤖' },
  { title: 'Summary', icon: '🚀' },
]

export default function Wizard() {
  const { currentScreen, setCurrentScreen, completedScreens, addCompletedScreen } = useWizardStore()

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      addCompletedScreen(currentScreen)
      setCurrentScreen(currentScreen + 1)
    }
  }

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1)
    }
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <Screen1_Connection onNext={handleNext} />
      case 1:
        return <Screen2_Consolidation onNext={handleNext} onBack={handleBack} />
      case 2:
        return <Screen3_Specification onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Screen4_Agents onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Screen5_Summary onBack={handleBack} />
      default:
        return null
    }
  }

  const progress = ((currentScreen + 1) / screens.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Intelligent Deployment Tool
          </h1>
          <p className="text-gray-400 text-lg">
            Wizard-driven WordPress deployment and customization
          </p>
        </motion.div>

        {/* Progress Bar */}
        <GlassCard className="mb-8">
          <ProgressBar progress={progress} />
        </GlassCard>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8">
          {screens.map((screen, index) => (
            <motion.div
              key={screen.title}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  index <= currentScreen
                    ? 'gradient-bg text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-gray-500'
                }`}
              >
                {index < currentScreen || completedScreens.includes(index) ? (
                  <CheckCircle size={24} />
                ) : (
                  <span>{screen.icon}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm ${
                  index === currentScreen ? 'text-white font-semibold' : 'text-gray-500'
                }`}
              >
                {screen.title}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Current Screen */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="min-h-[500px]">{renderScreen()}</GlassCard>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentScreen < screens.length - 1 && (
          <motion.div
            className="flex justify-between mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleBack}
              disabled={currentScreen === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentScreen === 0
                  ? 'opacity-0 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              className="px-8 py-3 gradient-bg text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
