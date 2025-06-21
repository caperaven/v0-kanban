import type { KanbanItem } from "../types/kanban"

const titles = [
  "Implement user authentication",
  "Fix responsive design issues",
  "Add dark mode support",
  "Optimize database queries",
  "Create API documentation",
  "Setup CI/CD pipeline",
  "Refactor legacy code",
  "Add unit tests",
  "Implement search functionality",
  "Update dependencies",
  "Fix security vulnerabilities",
  "Improve error handling",
  "Add data validation",
  "Optimize bundle size",
  "Implement caching strategy",
]

const descriptions = [
  "This task requires careful planning and execution to ensure all requirements are met.",
  "Need to review the current implementation and identify areas for improvement.",
  "Important feature that will enhance user experience significantly.",
  "Critical bug that needs immediate attention and resolution.",
  "Enhancement that will improve overall system performance.",
  "Documentation update to keep everything current and accurate.",
  "Refactoring needed to improve code maintainability.",
  "Testing implementation to ensure code quality and reliability.",
]

const assignees = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
const priorities = ["low", "medium", "high"]
const columns = ["backlog", "todo", "in-progress", "review", "done"]
const swimlanes = ["team-a", "team-b", "team-c", "team-d"]
const tags = ["frontend", "backend", "api", "ui/ux", "database", "security", "performance", "testing"]

export function generateSampleData(count: number): KanbanItem[] {
  const items: KanbanItem[] = []

  for (let i = 0; i < count; i++) {
    const randomTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)

    items.push({
      id: `item-${i}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: Math.random() > 0.3 ? descriptions[Math.floor(Math.random() * descriptions.length)] : undefined,
      assignee: Math.random() > 0.2 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as "low" | "medium" | "high",
      swimlane: swimlanes[Math.floor(Math.random() * swimlanes.length)],
      columnId: columns[Math.floor(Math.random() * columns.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      tags: randomTags,
    })
  }

  return items
}
