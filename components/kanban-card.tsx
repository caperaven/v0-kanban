import { Card, CardContent, Typography, Chip, Avatar, Box } from "@mui/material"
import { Flag } from "@mui/icons-material"
import type { KanbanItem } from "../types/kanban"

interface KanbanCardProps {
  item: KanbanItem
}

export function KanbanCard({ item }: KanbanCardProps) {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "default"
    }
  }

  const getPriorityIcon = (priority?: string) => {
    return <Flag sx={{ fontSize: 16 }} />
  }

  return (
    <Card
      sx={{
        height: 100, // Fixed height
        cursor: "grab",
        "&:hover": {
          boxShadow: 3,
        },
        "&:active": {
          cursor: "grabbing",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column", "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: "0.875rem",
            }}
          >
            {item.title}
          </Typography>
          {item.priority && (
            <Chip
              icon={getPriorityIcon(item.priority)}
              label={item.priority}
              size="small"
              color={getPriorityColor(item.priority) as any}
              sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
            />
          )}
        </Box>

        {item.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1, // Reduced to 1 line
              WebkitBoxOrient: "vertical",
              fontSize: "0.75rem",
              flex: 1,
            }}
          >
            {item.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Box sx={{ display: "flex", gap: 0.5, flex: 1, overflow: "hidden" }}>
            {item.tags?.slice(0, 2).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.65rem", height: 18 }} />
            ))}
            {item.tags && item.tags.length > 2 && (
              <Chip
                label={`+${item.tags.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.65rem", height: 18 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}>
            <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
              {item.createdAt.toLocaleDateString()}
            </Typography>
            {item.assignee && (
              <Avatar sx={{ width: 20, height: 20, fontSize: "0.7rem" }}>
                {item.assignee.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
