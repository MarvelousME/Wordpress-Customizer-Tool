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

export interface AgentSkill {
  name: string
  description: string
  capabilities: string[]
  sourceFile?: string
}

export interface Agent {
  id: string
  name: string
  description: string
  skills: string[]
  proficiency: 'expert' | 'senior' | 'intermediate' | 'junior'
  avatar?: string
  assigned_tasks: string[]
  customSkills?: AgentSkill[]
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  path: string
  thumbnailUrl?: string
  uploadedAt: number
  status: 'pending' | 'uploaded' | 'error'
  errorMessage?: string
}

export interface WizardState {
  // Screen 1: Connection
  remoteUrl: string
  username: string
  password: string
  connectionTested: boolean
  connectionSuccess: boolean
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'failed'
  connectionError: string | null
  themeImported: boolean
  themeInfo: any | null
  
  // Screen 2: Consolidation
  repoPath: string
  branch: string
  consolidationComplete: boolean
  gapsIdentified: any[]
  uploadedFiles: UploadedFile[]
  
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
  
  // Actions - Connection
  setRemoteUrl: (url: string) => void
  setUsername: (username: string) => void
  setPassword: (password: string) => void
  testConnection: () => Promise<boolean>
  setConnectionTested: (tested: boolean, success: boolean) => void
  setThemeImported: (imported: boolean) => void
  setThemeInfo: (info: any) => void
  
  // Actions - Files
  addFiles: (files: FileList | File[]) => Promise<void>
  removeFile: (fileId: string) => void
  generateThumbnail: (file: UploadedFile) => Promise<string | null>
  
  // Actions - Agents
  parseSkillsFromMarkdown: (content: string, fileName: string) => AgentSkill[]
  addAgent: (agent: Agent) => void
  removeAgent: (agentId: string) => void
  setAgents: (agents: Agent[]) => void
  setTaskAssignments: (assignments: Record<string, string[]>) => void
  
  // Actions - General
  setRepoPath: (path: string) => void
  setBranch: (branch: string) => void
  setConsolidationComplete: (complete: boolean) => void
  setGapsIdentified: (gaps: any[]) => void
  setSpecificationFile: (file: File | null) => void
  setSpecificationText: (text: string) => void
  setLogoFile: (file: File | null) => void
  setImplementationPlan: (plan: any) => void
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
      connectionStatus: 'idle',
      connectionError: null,
      themeImported: false,
      themeInfo: null,
      
      repoPath: '',
      branch: 'main',
      consolidationComplete: false,
      gapsIdentified: [],
      uploadedFiles: [],
      
      specificationFile: null,
      specificationText: '',
      logoFile: null,
      implementationPlan: null,
      
      agents: [],
      taskAssignments: {},
      
      launchReady: false,
      currentScreen: 0,
      completedScreens: [],
      
      // Actions - Connection
      setRemoteUrl: (url) => set({ remoteUrl: url }),
      setUsername: (username) => set({ username }),
      setPassword: (password) => set({ password }),
      
      testConnection: async () => {
        const { remoteUrl, username, password } = get()
        set({ connectionStatus: 'connecting', connectionError: null })

        try {
          // Normalize URL
          let baseUrl = remoteUrl.trim()
          if (!baseUrl.startsWith('http')) {
            baseUrl = `https://${baseUrl}`
          }
          baseUrl = baseUrl.replace(/\/+$/, '')

          const apiBase = `${baseUrl}/wp-json`
          
          // 1. Check Site Info (Public endpoint)
          const siteInfoResponse = await fetch(`${apiBase}/`, { 
            method: 'GET',
            signal: AbortSignal.timeout(8000),
            headers: { 'Accept': 'application/json' }
          })

          if (!siteInfoResponse.ok) {
            throw new Error(`Site unreachable at ${baseUrl}. Status: ${siteInfoResponse.status}`)
          }

          const siteData = await siteInfoResponse.json()
          
          // 2. Verify Credentials via REST API
          const authHeader = 'Basic ' + btoa(`${username}:${password}`)
          
          const userResponse = await fetch(`${apiBase}/wp/v2/users/me`, {
            method: 'GET',
            signal: AbortSignal.timeout(8000),
            headers: {
              'Authorization': authHeader,
              'Accept': 'application/json'
            }
          })

          let siteInfo = { name: siteData.name || 'WordPress Site', version: 'Unknown' }

          if (userResponse.ok) {
            const userData = await userResponse.json()
            siteInfo = { 
              name: siteData.name || 'WordPress Site', 
              version: siteData.version || 'Unknown',
              theme: 'Active Theme Detected'
            }
            set({
              connectionTested: true,
              connectionSuccess: true,
              connectionStatus: 'connected',
              connectionError: null,
              themeInfo: siteInfo
            })
            return true
          } else if (userResponse.status === 401) {
            throw new Error('Invalid Username or Password.')
          } else {
            throw new Error(`Authentication failed. Server responded with ${userResponse.status}`)
          }

        } catch (error: any) {
          console.error('Connection failed:', error)
          let errorMsg = 'Failed to connect. Check URL and network.'
          
          if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
            errorMsg = 'Connection timed out. The server took too long to respond.'
          } else if (error.message.includes('Invalid Username')) {
            errorMsg = error.message
          } else if (error.message.includes('Failed to fetch')) {
            errorMsg = 'Network error. Ensure CORS is enabled on the WordPress server or use a proxy.'
          } else if (error.message) {
            errorMsg = error.message
          }

          set({
            connectionTested: true,
            connectionSuccess: false,
            connectionStatus: 'failed',
            connectionError: errorMsg
          })
          return false
        }
      },
      
      setConnectionTested: (tested, success) => set({ 
        connectionTested: tested, 
        connectionSuccess: success 
      }),
      setThemeImported: (imported) => set({ themeImported: imported }),
      setThemeInfo: (info) => set({ themeInfo: info }),
      
      // Actions - Files
      addFiles: async (files) => {
        const fileArray = Array.from(files)
        const newEntries: UploadedFile[] = []

        for (const file of fileArray) {
          const id = crypto.randomUUID()
          const baseEntry: UploadedFile = {
            id,
            name: file.name,
            size: file.size,
            type: file.type,
            path: URL.createObjectURL(file),
            uploadedAt: Date.now(),
            status: 'pending'
          }

          if (file.type.startsWith('image/')) {
            try {
              const thumbUrl = await get().generateThumbnail(baseEntry)
              if (thumbUrl) {
                baseEntry.thumbnailUrl = thumbUrl
              }
            } catch (e) {
              console.warn(`Could not generate thumbnail for ${file.name}`, e)
            }
          }

          baseEntry.status = 'uploaded'
          newEntries.push(baseEntry)
        }

        set((state) => ({ uploadedFiles: [...state.uploadedFiles, ...newEntries] }))
      },

      removeFile: (fileId) => {
        set((state) => {
          const file = state.uploadedFiles.find(f => f.id === fileId)
          if (file && file.path.startsWith('blob:')) {
            URL.revokeObjectURL(file.path)
          }
          return { uploadedFiles: state.uploadedFiles.filter(f => f.id !== fileId) }
        })
      },

      generateThumbnail: async (file) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = file.path
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) { resolve(null); return }

            const MAX_SIZE = 150
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE }
            } else {
              if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE }
            }

            canvas.width = width
            canvas.height = height
            ctx.drawImage(img, 0, 0, width, height)
            
            resolve(canvas.toDataURL('image/jpeg', 0.7))
          }
          img.onerror = () => resolve(null)
        })
      },

      // Actions - Agents
      parseSkillsFromMarkdown: (content, fileName) => {
        const lines = content.split('\n')
        let name = 'Unknown Agent'
        let role = 'General Assistant'
        const capabilities: string[] = []

        let currentSection = ''

        lines.forEach(line => {
          const trimmed = line.trim()
          if (trimmed.startsWith('# ') && !trimmed.startsWith('##')) {
            name = trimmed.replace('# ', '')
          } else if (trimmed.startsWith('## ')) {
            role = trimmed.replace('## ', '')
            currentSection = 'role'
          } else if (trimmed.startsWith('- ')) {
            if (currentSection === 'role' || currentSection === '') {
              capabilities.push(trimmed.replace('- ', ''))
            }
          }
        })

        return [{
          name,
          description: `Loaded from ${fileName}`,
          capabilities,
          sourceFile: fileName
        }]
      },

      addAgent: (agent) => set((state) => ({ agents: [...state.agents, agent] })),
      removeAgent: (agentId) => set((state) => ({ agents: state.agents.filter(a => a.id !== agentId) })),
      setAgents: (agents) => set({ agents }),
      setTaskAssignments: (assignments) => set({ taskAssignments: assignments }),
      
      // Actions - General
      setRepoPath: (path) => set({ repoPath: path }),
      setBranch: (branch) => set({ branch }),
      setConsolidationComplete: (complete) => set({ consolidationComplete: complete }),
      setGapsIdentified: (gaps) => set({ gapsIdentified: gaps }),
      setSpecificationFile: (file) => set({ specificationFile: file }),
      setSpecificationText: (text) => set({ specificationText: text }),
      setLogoFile: (file) => set({ logoFile: file }),
      setImplementationPlan: (plan) => set({ implementationPlan: plan }),
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
        connectionStatus: 'idle',
        connectionError: null,
        themeImported: false,
        themeInfo: null,
        repoPath: '',
        branch: 'main',
        consolidationComplete: false,
        gapsIdentified: [],
        uploadedFiles: [],
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
        uploadedFiles: state.uploadedFiles.map(f => ({...f, path: '', thumbnailUrl: ''})),
      }),
    }
  )
)
