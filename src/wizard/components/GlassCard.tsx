import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
  onClick?: () => void
}

export const GlassCard = ({ 
  children, 
  className = '', 
  hoverEffect = false,
  onClick 
}: GlassCardProps) => {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      whileHover={hoverEffect ? { 
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
      } : {}}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  className?: string
  icon?: LucideIcon
}

export const AnimatedButton = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
}: AnimatedButtonProps) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
  
  const variants = {
    primary: "gradient-bg text-white hover:shadow-lg hover:shadow-purple-500/30",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/20",
    danger: "bg-red-500/80 text-white hover:bg-red-600",
  }

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {Icon && !loading && <Icon size={20} />}
      {children}
    </motion.button>
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
}

export const ProgressBar = ({ progress, className = '', showLabel = true }: ProgressBarProps) => {
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full gradient-bg"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export const LoadingSkeleton = ({ lines = 3, className = '' }: LoadingSkeletonProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="shimmer h-4 rounded" />
      ))}
    </div>
  )
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export const Alert = ({ type, message, onClose }: AlertProps) => {
  const types = {
    success: 'bg-green-500/20 border-green-500 text-green-400',
    error: 'bg-red-500/20 border-red-500 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500 text-blue-400',
  }

  return (
    <motion.div
      className={`p-4 rounded-lg border ${types[type]} glass-panel`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="ml-4 hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </motion.div>
  )
}
