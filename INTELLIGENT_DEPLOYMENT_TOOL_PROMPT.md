# Intelligent WordPress Deployment Tool - Development Prompt

## Overview
Build an intelligent, wizard-driven deployment tool that enables seamless customization and deployment of WordPress websites. The tool must be deterministic based on user inputs, with a stunning, intuitive wizard interface that persists state locally and provides secure, encrypted workflows.

---

## Prerequisites & Setup

### Local Environment Requirements
- **Docker Desktop** (latest version) - must be installed and running
- **Development Environment** (IDE) - VS Code, PhpStorm, or similar
- **Git** - for repository management
- **Node.js 18+** - for frontend wizard interface
- **PHP 8.1+** - for WordPress backend operations

### Initial Setup
1. Download and configure Docker-optimized WordPress instance
2. Spin up Docker container with pre-configured WordPress stack
3. Launch wizard interface automatically on container startup
4. Implement local state persistence (encrypted JSON file)
5. Validate remote website accessibility before proceeding

---

## Wizard Architecture

### Core Requirements
- **Asynchronous Navigation**: Each screen loads independently with back/forward capability
- **State Persistence**: All inputs encrypted and saved locally between sessions
- **Session Recovery**: On reload, display saved state with confirmation/edit capability
- **Security**: All credentials encrypted at rest (AES-256), never logged
- **Validation**: Remote website must be active and accessible before any operations

### UI/UX Design System
- **Framework**: React with Framer Motion for animations
- **Styling**: TailwindCSS with custom glassmorphic components
- **Icons**: Lucide React with animated variants
- **Logo**: Placeholder from `Wizard-Logo/` folder in repo
- **Theme**: Dark mode with glassmorphic overlays, gradient accents

#### Visual Elements
- **Page Transitions**: Smooth fade/slide animations between wizard screens
- **Animated Icons**: Hover-triggered micro-interactions on all icons
- **3D Hover Cards**: Perspective transforms on interactive cards
- **3D Scroll Animations**: Parallax effects on scrollable content
- **Glassmorphic Panels**: Backdrop blur with semi-transparent layers
- **Animated Alerts/Modals**: Slide-in notifications with progress indicators
- **Loading States**: Skeleton screens with shimmer effects
- **Progress Indicators**: Visual step tracker at top of wizard

---

## Wizard Screens

### Screen 1: Remote WordPress Connection

**Purpose**: Connect to existing WordPress site and optionally import theme

**UI Components**:
- Input fields (with validation):
  - Remote Backend URL (required, URL validation)
  - WordPress Username (required)
  - Password/App Password (required, masked with toggle visibility)
  - Connection Test Button (with loading spinner)
- Connection Status Indicator (animated checkmark/x)
- Active Theme Display Card (3D hover effect)
- Import Theme Toggle (switch with animation)
- Theme Preview Modal (if import selected)

**Workflow**:
1. User enters remote WordPress credentials
2. Click "Test Connection" → Async API call to remote site
3. On success:
   - Display active theme name, version, screenshot
   - Show theme details in glassmorphic card
   - Enable "Import Theme to Local" option
4. On failure:
   - Show animated error notification
   - Display specific error message (auth, network, etc.)
   - Retry option
5. If import selected:
   - Download theme files to local Docker instance
   - Extract to `wp-content/themes/`
   - Show progress bar with percentage
   - Display success notification with theme location
6. Save encrypted credentials to local state (optional: "Remember me" checkbox)

**Technical Implementation**:
- Use WordPress REST API for connection testing
- Endpoint: `/wp-json/wp/v2/themes?status=active`
- Implement retry logic (3 attempts with exponential backoff)
- Store credentials in encrypted format using crypto-js

---

### Screen 2: Local Repository Consolidation

**Purpose**: Merge remote theme with local codebase, identify gaps, create documentation

**UI Components**:
- Repository Connection Panel:
  - Local repo path (auto-detected or manual input)
  - Branch selector (dropdown)
  - "Analyze Codebase" button
- Consolidation Progress Dashboard:
  - Animated circular progress indicators
  - Service/functionality breakdown cards
  - Gap detection visualization
- Consolidation Report:
  - Expandable accordion sections
  - Diff viewer for conflicting files
  - Merge strategy selection (append/replace/skip)
- Documentation Preview:
  - Generated markdown preview
  - "Save to Repo" button
- Conflict Resolution Modal (if needed)

**Workflow**:
1. Connect to local repository (Git integration)
2. Scan imported theme files and local codebase
3. Perform codebase analysis:
   - Identify all services, functionalities, components
   - Detect duplicates across codebases
   - Identify gaps (missing features in local vs remote)
   - Map dependencies and relationships
4. Consolidation Strategy:
   - **Never remove existing code** - only append/enhance
   - For gaps: Create new implementations
   - For conflicts: Present diff and let user choose merge strategy
   - Generate consolidation report
5. Create Synopsis:
   - If existing code: Append to `docs/consolidation/theme-analysis.md`
   - If no existing code: Create new structured documentation
6. Documentation Structure:
   ```markdown
   # Theme Consolidation Report
   - Imported Theme: [name, version]
   - Analysis Date: [timestamp]
   - Services Identified:
     - [Service 1]: Description, Location, Dependencies
     - [Service 2]: ...
   - Gaps Identified:
     - [Gap 1]: Description, Proposed Solution
   - Consolidation Actions:
     - [Action 1]: Status (completed/pending)
   ```
7. Save all changes to local repo with commit message
8. Display summary with animated success notification

**Technical Implementation**:
- Use Git library for repository operations
- Implement AST-based code analysis for PHP/JS files
- Use diff library for conflict visualization
- Generate markdown programmatically
- Create atomic commits for each consolidation action

---

### Screen 3: Specification & Objective Upload

**Purpose**: Upload project requirements and generate implementation plan

**UI Components**:
- File Upload Zone (drag & drop with animated border):
  - Supported formats: PDF, TXT, MD
  - File preview card with icon
  - Remove file button
- Text Editor (WYSIWYG):
  - Rich text editor (TipTap or similar)
  - Markdown support
  - Toolbar with formatting options
- Logo Upload Zone:
  - Image preview with crop tool
  - Size/format validation
- "Generate Implementation Plan" button
- Plan Preview Modal:
  - Task tree visualization
  - Timeline estimation
  - Resource requirements

**Workflow**:
1. User provides specification via:
   - File upload (PDF/TXT/MD) OR
   - Direct text input in WYSIWYG editor
2. Upload project logo (optional but recommended)
3. Click "Generate Implementation Plan"
4. Process specification:
   - Parse uploaded file or text content
   - Extract requirements, features, constraints
   - Identify technical components needed
   - Estimate complexity and dependencies
5. Generate Task Tree:
   - Break down into hierarchical tasks
   - Assign task IDs and dependencies
   - Estimate time for each task
   - Identify required skills/technologies
6. Save task tree as JSON:
   ```json
   {
     "project_name": "Project Name",
     "objective": "Brief objective",
     "logo_path": "path/to/logo.png",
     "generated_at": "ISO timestamp",
     "tasks": [
       {
         "id": "TASK-001",
         "title": "Task Title",
         "description": "Detailed description",
         "status": "pending",
         "priority": "high|medium|low",
         "estimated_hours": 8,
         "dependencies": [],
         "required_skills": ["skill1", "skill2"],
         "deliverables": ["file1", "file2"]
       }
     ],
     "timeline": {
       "total_estimated_hours": 120,
       "phases": [...]
     }
   }
   ```
7. Save JSON to `docs/implementation-plan.json`
8. Display preview with option to regenerate

**Technical Implementation**:
- Use PDF parsing library (pdf-parse) for PDF files
- Implement markdown parser for MD files
- Use NLP/LLM API for requirement extraction (optional)
- Generate task tree using rule-based or AI approach
- Implement file upload with validation

---

### Screen 4: AI Agent Creation & Assignment

**Purpose**: Define AI agents (skills) and assign to tasks

**UI Components**:
- Agent Definition Panel:
  - Agent name input
  - Skill description (multiline)
  - Capability checkboxes
  - Agent avatar/icon selector
- Task Assignment Matrix:
  - Tasks on left axis
  - Agents on top axis
  - Interactive grid for assignments
  - Conflict highlighting
- Agent Preview Cards:
  - 3D hover cards showing agent details
  - Assigned tasks count
  - Skill proficiency indicators
- "Create & Assign Agents" button
- Approval Modal:
  - Summary of all agents
  - Task assignment overview
  - Confirm/Cancel buttons

**Workflow**:
1. Analyze task tree from previous screen
2. Identify required skills from task requirements
3. Suggest AI agents based on skills:
   - **Frontend Developer**: React, CSS, UI/UX
   - **Backend Developer**: PHP, WordPress API, Database
   - **WordPress Specialist**: Themes, Plugins, Hooks
   - **DevOps Engineer**: Docker, Deployment, CI/CD
   - **QA Engineer**: Testing, Bug fixing
   - **Documentation Writer**: Markdown, Technical writing
   - Custom agents as needed
4. User can:
   - Accept suggested agents
   - Modify agent definitions
   - Create custom agents
   - Adjust skill levels
5. Assign agents to tasks:
   - Manual assignment via matrix
   - Auto-assign based on skill matching
   - One task can have multiple agents
6. Review assignments:
   - Show task coverage (all tasks assigned?)
   - Highlight overloaded agents
   - Show dependency conflicts
7. Upon approval:
   - Save agent definitions to `docs/agents.json`
   - Update task tree with agent assignments
   - Write to repository with commit
8. Display animated success notification

**Technical Implementation**:
- Agent definition schema:
  ```json
  {
    "agents": [
      {
        "id": "AGENT-001",
        "name": "Frontend Developer",
        "description": "Specializes in React, CSS, and UI/UX",
        "skills": ["React", "CSS", "UI/UX", "Framer Motion"],
        "proficiency": "expert|senior|intermediate|junior",
        "avatar": "path/to/avatar.png",
        "assigned_tasks": ["TASK-001", "TASK-005"]
      }
    ]
  }
  ```
- Implement skill matching algorithm
- Use graph visualization for task-agent relationships

---

### Screen 5: Summary & Launch

**Purpose**: Review all configurations and launch project

**UI Components**:
- Summary Dashboard:
  - Remote connection status (card with icon)
  - Theme import status (card with icon)
  - Consolidation report summary (expandable)
  - Implementation plan overview (task count, timeline)
  - Agent assignments summary (agent count, coverage)
- Configuration Review:
  - All settings in editable form
  - "Edit" buttons to jump back to specific screens
  - Validation status indicators
- "Deal With Line" Button:
  - Large, prominent CTA
  - Animated gradient background
  - Hover effects (3D transform)
  - Loading state on click
- Launch Animation:
  - Confetti or particle effect
  - Success modal with next steps

**Workflow**:
1. Display comprehensive summary of all wizard screens
2. Show validation status for each section:
   - ✓ Remote connection: Success
   - ✓ Theme import: Complete
   - ✓ Consolidation: Complete
   - ✓ Implementation plan: Generated
   - ✓ Agent assignments: Complete
3. Allow user to:
   - Review all configurations
   - Edit any section (jumps back to relevant screen)
   - Download summary as PDF
4. Click "Deal With Line" button:
   - Validate all prerequisites
   - Create final commit with all configurations
   - Generate project initialization script
   - Display success animation
5. Transition to deployment wizard (next phase)

**Technical Implementation**:
- Aggregate all state from previous screens
- Implement final validation checks
- Generate project summary PDF
- Create initialization script in repo root
- Set up project structure based on plan

---

## Deployment Wizard

### Overview
After project setup, launch a deployment wizard optimized for executing the implementation plan.

### Deployment Wizard Screens

#### Screen 1: Deployment Plan Overview
- Display task tree with status indicators
- Show deployment phases
- Timeline visualization
- "Start Deployment" button

#### Screen 2-N: Step-by-Step Execution
For each task in the tree:
- Display task details
- Show assigned agents
- Execute task (with progress)
- Display output/logs
- Mark as complete/incomplete
- Allow retry on failure

#### Final Screen: Deployment Summary
- Overall progress dashboard
- Completed vs pending tasks
- Deployment log
- "View Live Site" button
- "Create New Deployment" button

### Multi-Deployment Support
- Queue multiple deployments
- Run deployments sequentially or in parallel (configurable)
- Track deployment history
- Rollback capability

---

## Technical Architecture

### Backend (Docker Container)
- **WordPress**: Latest stable version
- **PHP**: 8.1+
- **MySQL**: 8.0+
- **Nginx**: Web server
- **Node.js**: For wizard backend API
- **Python**: For code analysis and AI operations

### Frontend (Wizard Interface)
- **React 18+**: UI framework
- **Framer Motion**: Animations
- **TailwindCSS**: Styling
- **Lucide React**: Icons
- **React Router**: Navigation
- **Zustand**: State management
- **React Hook Form**: Form handling
- **TipTap**: Rich text editor

### API Endpoints
```
POST /api/connection/test - Test WordPress connection
POST /api/theme/import - Import theme to local
POST /api/repo/analyze - Analyze local repository
POST /api/consolidate - Perform codebase consolidation
POST /api/plan/generate - Generate implementation plan
POST /api/agents/create - Create and assign agents
POST /api/deployment/start - Start deployment
GET /api/deployment/status - Get deployment status
```

### File Structure
```
/
├── Wizard-Logo/
│   └── logo.png
├── docs/
│   ├── consolidation/
│   │   └── theme-analysis.md
│   ├── implementation-plan.json
│   └── agents.json
├── src/
│   ├── wizard/
│   │   ├── screens/
│   │   │   ├── Screen1_Connection.tsx
│   │   │   ├── Screen2_Consolidation.tsx
│   │   │   ├── Screen3_Specification.tsx
│   │   │   ├── Screen4_Agents.tsx
│   │   │   └── Screen5_Summary.tsx
│   │   ├── components/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── AnimatedButton.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── hooks/
│   │       └── useWizardState.ts
│   ├── api/
│   │   └── routes.ts
│   └── utils/
│       ├── encryption.ts
│       └── git.ts
├── docker-compose.yml
└── package.json
```

---

## Security Considerations

1. **Credential Encryption**: All passwords encrypted with AES-256
2. **No Logging**: Never log credentials or sensitive data
3. **HTTPS Only**: All remote connections over HTTPS
4. **Input Validation**: Sanitize all user inputs
5. **File Upload Security**: Validate file types, scan for malware
6. **Local Storage**: Use encrypted local storage for state
7. **API Security**: Implement rate limiting and authentication

---

## Success Criteria

- Wizard loads within 3 seconds of Docker startup
- Connection test completes within 10 seconds
- Theme import completes with progress indicator
- Consolidation accurately identifies all gaps
- Implementation plan is comprehensive and actionable
- Agent assignments cover all required skills
- Deployment executes step-by-step with clear feedback
- All animations are smooth (60fps)
- UI is responsive on desktop and tablet
- State persists correctly across sessions
- All credentials remain secure

---

## Development Phases

### Phase 1: Infrastructure Setup
- Configure Docker WordPress instance
- Set up development environment
- Initialize Git repository
- Create basic project structure

### Phase 2: Wizard Framework
- Build React wizard skeleton
- Implement navigation (back/forward)
- Add state persistence
- Create UI component library

### Phase 3: Screen 1 Implementation
- WordPress connection API
- Theme import functionality
- UI components and validation

### Phase 4: Screen 2 Implementation
- Repository analysis tools
- Consolidation logic
- Documentation generation

### Phase 5: Screen 3 Implementation
- File upload handling
- Specification parsing
- Task tree generation

### Phase 6: Screen 4 Implementation
- Agent definition system
- Assignment algorithm
- Visualization components

### Phase 7: Screen 5 & Deployment Wizard
- Summary dashboard
- Deployment execution engine
- Multi-deployment support

### Phase 8: Polish & Testing
- Animation optimization
- Security audit
- End-to-end testing
- Documentation

---

## Notes

- Always prioritize user experience and intuitive design
- Maintain backward compatibility with existing code
- Implement comprehensive error handling
- Provide helpful error messages
- Add loading states for all async operations
- Test with various WordPress configurations
- Ensure Docker container is production-ready
- Document all API endpoints and data structures
