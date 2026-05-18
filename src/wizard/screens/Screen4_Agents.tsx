import { useState } from 'react'
import { motion } from 'framer-motion'
import { useWizardStore, Agent } from '../../hooks/useWizardStore'
import { AnimatedButton, GlassCard } from '../../components/GlassCard'
import { Bot, Users, CheckCircle, Sparkles } from 'lucide-react'

interface Screen4_AgentsProps {
  onNext: () => void
  onBack: () => void
}

const defaultAgents: Agent[] = [
  {
    id: 'AGENT-001',
    name: 'Frontend Developer',
    description: 'Specializes in React, CSS, and UI/UX',
    skills: ['React', 'CSS', 'UI/UX', 'Framer Motion'],
    proficiency: 'expert',
    assigned_tasks: [],
  },
  {
    id: 'AGENT-002',
    name: 'Backend Developer',
    description: 'PHP, WordPress API, Database expert',
    skills: ['PHP', 'WordPress', 'MySQL', 'REST API'],
    proficiency: 'expert',
    assigned_tasks: [],
  },
  {
    id: 'AGENT-003',
    name: 'DevOps Engineer',
    description: 'Docker, Deployment, CI/CD specialist',
    skills: ['Docker', 'CI/CD', 'Linux', 'Nginx'],
    proficiency: 'senior',
    assigned_tasks: [],
  },
  {
    id: 'AGENT-004',
    name: 'QA Engineer',
    description: 'Testing and bug fixing expert',
    skills: ['Testing', 'Debugging', 'Quality Assurance'],
    proficiency: 'senior',
    assigned_tasks: [],
  },
]

export default function Screen4_Agents({ onNext, onBack }: Screen4_AgentsProps) {
  const {
    agents,
    taskAssignments,
    implementationPlan,
    setAgents,
    setTaskAssignments,
  } = useWizardStore()

  const [selectedAgents, setSelectedAgents] = useState<Agent[]>(
    agents.length > 0 ? agents : defaultAgents
  )
  const [assigning, setAssigning] = useState(false)

  const autoAssignTasks = () => {
    setAssigning(true)
    
    setTimeout(() => {
      if (implementationPlan?.tasks) {
        const assignments: Record<string, string[]> = {}
        
        implementationPlan.tasks.forEach((task: any) => {
          // Simple skill-based assignment
          const requiredSkills = task.required_skills || []
          const matchedAgents = selectedAgents.filter(agent =>
            agent.skills.some(skill => 
              requiredSkills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
            )
          )
          
          assignments[task.id] = matchedAgents.map(a => a.id)
        })
        
        setTaskAssignments(assignments)
        
        // Update agents with assigned tasks
        const updatedAgents = selectedAgents.map(agent => ({
          ...agent,
          assigned_tasks: Object.entries(assignments)
            .filter(([_, agentIds]) => agentIds.includes(agent.id))
            .map(([taskId]) => taskId),
        }))
        
        setAgents(updatedAgents)
      }
      
      setAssigning(false)
    }, 1500)
  }

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert': return 'text-purple-400 bg-purple-500/20'
      case 'senior': return 'text-blue-400 bg-blue-500/20'
      case 'intermediate': return 'text-green-400 bg-green-500/20'
      case 'junior': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">AI Agent Creation & Assignment</h2>
        <p className="text-gray-400">Define AI agents and assign them to tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Bot size={24} className="text-purple-400" />
            Available Agents
          </h3>

          <div className="space-y-4">
            {selectedAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">{agent.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{agent.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getProficiencyColor(agent.proficiency)}`}>
                    {agent.proficiency}
                  </span>
                </div>
                
                <div className="mt-3">
                  <p className="text-gray-500 text-xs mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.skills.map((skill, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {agent.assigned_tasks && agent.assigned_tasks.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={14} />
                    <span>{agent.assigned_tasks.length} tasks assigned</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users size={24} className="text-purple-400" />
            Task Assignments
          </h3>

          {implementationPlan?.tasks ? (
            <div className="space-y-4">
              {implementationPlan.tasks.map((task: any, index: number) => {
                const assignedAgentIds = taskAssignments[task.id] || []
                const assignedAgents = selectedAgents.filter(a => assignedAgentIds.includes(a.id))

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">{task.title}</h4>
                        <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="mt-3">
                      <p className="text-gray-500 text-xs mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.required_skills?.map((skill: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {assignedAgents.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-gray-500 text-xs mb-2">Assigned To:</p>
                        <div className="flex flex-wrap gap-2">
                          {assignedAgents.map(agent => (
                            <span key={agent.id} className="text-xs px-2 py-1 gradient-bg text-white rounded">
                              {agent.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No tasks available. Please complete the specification first.</p>
            </div>
          )}
        </GlassCard>
      </div>

      {!Object.keys(taskAssignments).length && implementationPlan?.tasks && (
        <AnimatedButton
          onClick={autoAssignTasks}
          loading={assigning}
          className="w-full"
          icon={Sparkles}
        >
          Auto-Assign Agents to Tasks
        </AnimatedButton>
      )}

      {Object.keys(taskAssignments).length > 0 && (
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
            Continue to Summary →
          </AnimatedButton>
        </motion.div>
      )}
    </div>
  )
}
