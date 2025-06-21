"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Badge,
} from "@mui/material"
import { ExpandMore, ExpandLess, Visibility, VisibilityOff, UnfoldMore, UnfoldLess } from "@mui/icons-material"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { FixedSizeList as List } from "react-window"
import type { KanbanItem, KanbanColumn, SwimLane, ColumnStats } from "../types/kanban"
import { KanbanCard } from "./kanban-card"
import { generateSampleData } from "../utils/sample-data"

const ITEM_HEIGHT = 120
const HEADER_HEIGHT = 60
const SWIMLANE_HEADER_HEIGHT = 48

export default function KanbanBoard() {
  const [items, setItems] = useState<KanbanItem[]>(generateSampleData(5000))
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "backlog", title: "Backlog", color: "#f44336", isVisible: true, isCollapsed: false, order: 0 },
    { id: "todo", title: "To Do", color: "#ff9800", isVisible: true, isCollapsed: false, order: 1 },
    { id: "in-progress", title: "In Progress", color: "#2196f3", isVisible: true, isCollapsed: false, order: 2 },
    { id: "review", title: "Review", color: "#9c27b0", isVisible: true, isCollapsed: false, order: 3 },
    { id: "done", title: "Done", color: "#4caf50", isVisible: true, isCollapsed: false, order: 4 },
  ])
  const [swimlanes, setSwimlanes] = useState<SwimLane[]>([
    { id: "team-a", title: "Team Alpha", isCollapsed: false },
    { id: "team-b", title: "Team Beta", isCollapsed: false },
    { id: "team-c", title: "Team Gamma", isCollapsed: false },
    { id: "team-d", title: "Team Delta", isCollapsed: false },
  ])

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.isVisible).sort((a, b) => a.order - b.order),
    [columns],
  )

  const columnStats = useMemo((): ColumnStats => {
    const stats: ColumnStats = {}
    columns.forEach((col) => {
      stats[col.id] = {}
      swimlanes.forEach((lane) => {
        stats[col.id][lane.id] = items.filter((item) => item.columnId === col.id && item.swimlane === lane.id).length
      })
    })
    return stats
  }, [items, columns, swimlanes])

  const groupedItems = useMemo(() => {
    const grouped: { [swimlaneId: string]: { [columnId: string]: KanbanItem[] } } = {}

    swimlanes.forEach((lane) => {
      grouped[lane.id] = {}
      visibleColumns.forEach((col) => {
        grouped[lane.id][col.id] = items.filter((item) => item.swimlane === lane.id && item.columnId === col.id)
      })
    })

    return grouped
  }, [items, swimlanes, visibleColumns])

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    setItems((prevItems) => {
      const newItems = [...prevItems]
      const itemIndex = newItems.findIndex((item) => item.id === draggableId)

      if (itemIndex === -1) return prevItems

      const [swimlaneId, columnId] = destination.droppableId.split("-")
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        columnId,
        swimlane: swimlaneId,
      }

      return newItems
    })
  }, [])

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)))
  }, [])

  const toggleColumnCollapse = useCallback((columnId: string) => {
    setColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isCollapsed: !col.isCollapsed } : col)))
  }, [])

  const toggleSwimlaneCollapse = useCallback((swimlaneId: string) => {
    setSwimlanes((prev) =>
      prev.map((lane) => (lane.id === swimlaneId ? { ...lane, isCollapsed: !lane.isCollapsed } : lane)),
    )
  }, [])

  const renderColumnHeader = (column: KanbanColumn) => {
    if (column.isCollapsed) {
      // Collapsed column header - vertical layout
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 1,
            height: "100%",
            minHeight: 200,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
          onClick={() => toggleColumnCollapse(column.id)}
        >
          {/* Expand button at top */}
          <IconButton size="small" sx={{ mb: 1 }}>
            <UnfoldMore />
          </IconButton>

          {/* Color indicator */}
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: column.color,
              mb: 2,
            }}
          />

          {/* Rotated title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              whiteSpace: "nowrap",
              mb: 2,
            }}
          >
            {column.title}
          </Typography>

          {/* Rotated count chip */}
          <Chip
            label={Object.values(columnStats[column.id] || {}).reduce((sum, count) => sum + count, 0)}
            size="small"
            sx={{
              transform: "rotate(90deg)",
              mb: 1,
            }}
          />
        </Box>
      )
    }

    // Expanded column header - horizontal layout
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: column.color,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {column.title}
          </Typography>
          <Chip
            label={Object.values(columnStats[column.id] || {}).reduce((sum, count) => sum + count, 0)}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <IconButton size="small" onClick={() => toggleColumnCollapse(column.id)}>
          <UnfoldLess />
        </IconButton>
      </Box>
    )
  }

  const renderSwimlaneHeader = (swimlane: SwimLane, columnId: string) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        bgcolor: "grey.50",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          {swimlane.title}
        </Typography>
        <Badge badgeContent={columnStats[columnId]?.[swimlane.id] || 0} color="primary" sx={{ ml: 1 }} />
      </Box>
      <IconButton size="small" onClick={() => toggleSwimlaneCollapse(swimlane.id)}>
        {swimlane.isCollapsed ? <ExpandMore /> : <ExpandLess />}
      </IconButton>
    </Box>
  )

  const renderVirtualizedItems = ({ index, style, data }: any) => {
    const item = data.items[index]
    return (
      <div style={style}>
        <Draggable draggableId={item.id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
                margin: "8px",
                opacity: snapshot.isDragging ? 0.8 : 1,
              }}
            >
              <KanbanCard item={item} />
            </div>
          )}
        </Draggable>
      </div>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Kanban Board
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Column Visibility</InputLabel>
            <Select
              multiple
              value={columns.filter((col) => col.isVisible).map((col) => col.id)}
              label="Column Visibility"
              renderValue={(selected) => `${selected.length} columns visible`}
            >
              {columns.map((column) => (
                <MenuItem key={column.id} value={column.id} onClick={() => toggleColumnVisibility(column.id)}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {column.isVisible ? <Visibility /> : <VisibilityOff />}
                    {column.title}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: "flex", gap: 2, overflow: "auto", flex: 1 }}>
          {visibleColumns.map((column) => (
            <Paper
              key={column.id}
              sx={{
                minWidth: column.isCollapsed ? 60 : 320,
                maxWidth: column.isCollapsed ? 60 : 320,
                display: "flex",
                flexDirection: "column",
                height: column.isCollapsed ? "600px" : "fit-content",
                maxHeight: column.isCollapsed ? "600px" : "100%",
                transition: "all 0.3s ease-in-out",
              }}
            >
              {renderColumnHeader(column)}

              {!column.isCollapsed && (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  {swimlanes.map((swimlane) => (
                    <Box key={swimlane.id}>
                      {renderSwimlaneHeader(swimlane, column.id)}

                      <Collapse in={!swimlane.isCollapsed}>
                        <Droppable droppableId={`${swimlane.id}-${column.id}`}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              sx={{
                                minHeight: 100,
                                maxHeight: 400,
                                bgcolor: snapshot.isDraggingOver ? "action.hover" : "transparent",
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              {groupedItems[swimlane.id]?.[column.id]?.length > 0 ? (
                                <List
                                  height={Math.min(400, groupedItems[swimlane.id][column.id].length * ITEM_HEIGHT)}
                                  itemCount={groupedItems[swimlane.id][column.id].length}
                                  itemSize={ITEM_HEIGHT}
                                  itemData={{ items: groupedItems[swimlane.id][column.id] }}
                                >
                                  {renderVirtualizedItems}
                                </List>
                              ) : (
                                <Box
                                  sx={{
                                    p: 2,
                                    textAlign: "center",
                                    color: "text.secondary",
                                    minHeight: 100,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Typography variant="body2">No items</Typography>
                                </Box>
                              )}
                              {provided.placeholder}
                            </Box>
                          )}
                        </Droppable>
                      </Collapse>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  )
}
