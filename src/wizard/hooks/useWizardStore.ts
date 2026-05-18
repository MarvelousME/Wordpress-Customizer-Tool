import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  priority: 'high' | 'medium' | 'low'
  estimated_hours: number
  dependencies: string[]
  required_skills: string[]
  deliverables: string[]
  assigned_agents?: string[]
}

export interface Agent {
  id: string
  name: string
  description: string
  skills: string[]
  proficiency: 'expert' | 'senior' | 'intermediate' | 'junior'
  avatar?: string
  assigned_tasks: string[]
}

export interface WizardState {
  // Screen 1: Connection
  remoteUrl: string
  username: string
  password: string
  connectionTested: boolean
  connectionSuccess: boolean
  themeImported: boolean
  themeInfo: any | null
  
  // Screen 2: Consolidation
  repoPath: string
  branch: string
  consolidationComplete: boolean
  gapsIdentified: any[]
  
  // Screen 3: Specification
  specificationFile: File | null
  specificationText: string
  logoFile: File | null
  implementationPlan: any | null
  
  // Screen 4: Agents
  agents: Agent[]
  taskAssignments: Record<string, string[]>
  
  // Screen 5: Summary
  launchReady: boolean
  
  // Navigation
  currentScreen: number
  completedScreens: number[]
  
  // Actions
  setRemoteUrl: (url: string) => void
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  setConnectionTested: (tested: boolean, success: boolean) => void
  setThemeImported: (imported: boolean) => void
  setThemeInfo: (info: any) => void
  setRepoPath: (path: string) => void
  setBranch: (branch: string) => void
  setConsolidationComplete: (complete: boolean) => void
  setGapsIdentified: (gaps: any[]) => void
  setSpecificationFile: (file: File | null) => void
  setSpecificationText: (text: string) => void
  setLogoFile: (file: File | null) => void
  setImplementationPlan: (plan: any) => void
  setAgents: (agents: Agent[]) => void
  setTaskAssignments: (assignments: Record<string, string[]>) => void
  setCurrentScreen: (screen: number) => void
  addCompletedScreen: (screen: number) => void
  setLaunchReady: (ready: boolean) => void
  resetWizard: () => void
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      // Initial state
      remoteUrl: '',
      username: '',
      password: '',
      connectionTested: false,
      connectionSuccess: false,
      themeImported: false,
      themeInfo: null,
      
      repoPath: '',
      branch: 'main',
      consolidationComplete: false,
      gapsIdentified: [],
      
      specificationFile: null,
      specificationText: '',
      logoFile: null,
      implementationPlan: null,
      
      agents: [],
      taskAssignments: {},
      
      launchReady: false,
      currentScreen: 0,
      completedScreens: [],
      
      // Actions
      setRemoteUrl: (url) => set({ remoteUrl: url }),
      setUsername: (username) => set({ username }),
      setPassword: (password) => set({ password }),
      setConnectionTested: (tested, success) => set({ 
        connectionTested: tested, 
        connectionSuccess: success 
      }),
      setThemeImported: (imported) => set({ themeImported: imported }),
      setThemeInfo: (info) => set({ themeInfo: info }),
      setRepoPath: (path) => set({ repoPath: path }),
      setBranch: (branch) => set({ branch }),
      setConsolidationComplete: (complete) => set({ consolidationComplete: complete }),
      setGapsIdentified: (gaps) => set({ gapsIdentified: gaps }),
      setSpecificationFile: (file) => set({ specificationFile: file }),
      setSpecificationText: (text) => set({ specificationText: text }),
      setLogoFile: (file) => set({ logoFile: file }),
      setImplementationPlan: (plan) => set({ implementationPlan: plan }),
      setAgents: (agents) => set({ agents }),
      setTaskAssignments: (assignments) => set({ taskAssignments: assignments }),
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      addCompletedScreen: (screen) => set((state) => ({ 
        completedScreens: [...state.completedScreens, screen] 
      })),
      setLaunchReady: (ready) => set({ launchReady: ready }),
      resetWizard: () => set({
        remoteUrl: '',
        username: '',
        password: '',
        connectionTested: false,
        connectionSuccess: false,
        themeImported: false,
        themeInfo: null,
        repoPath: '',
        branch: 'main',
        consolidationComplete: false,
        gapsIdentified: [],
        specificationFile: null,
        specificationText: '',
        logoFile: null,
        implementationPlan: null,
        agents: [],
        taskAssignments: {},
        launchReady: false,
        currentScreen: 0,
        completedScreens: [],
      }),
    }),
    {
      name: 'wizard-storage',
      partialize: (state) => ({
        remoteUrl: state.remoteUrl,
        username: state.username,
        repoPath: state.repoPath,
        branch: state.branch,
        consolidationComplete: state.consolidationComplete,
        specificationText: state.specificationText,
        implementationPlan: state.implementationPlan,
        agents: state.agents,
        taskAssignments: state.taskAssignments,
        currentScreen: state.currentScreen,
        completedScreens: state.completedScreens,
      }),
    }
  )
)
