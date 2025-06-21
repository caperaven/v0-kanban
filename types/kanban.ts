export interface KanbanItem {
  id: string
  title: string
  description?: string
  assignee?: string
  priority?: "low" | "medium" | "high"
  swimlane: string
  columnId: string
  createdAt: Date
  tags?: string[]
}

export interface KanbanColumn {
  id: string
  title: string
  color: string
  isVisible: boolean
  isCollapsed: boolean
  order: number
}

export interface SwimLane {
  id: string
  title: string
  isCollapsed: boolean
}

export interface ColumnStats {
  [columnId: string]: {
    [swimlaneId: string]: number
  }
}
