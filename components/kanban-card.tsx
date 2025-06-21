import { Card, CardContent, Typography, Chip, Avatar, Box } from "@mui/material"
import { Flag, Schedule } from "@mui/icons-material"
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
        mb: 1,
        cursor: "grab",
        "&:hover": {
          boxShadow: 3,
        },
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
            {item.title}
          </Typography>
          {item.priority && (
            <Chip
              icon={getPriorityIcon(item.priority)}
              label={item.priority}
              size="small"
              color={getPriorityColor(item.priority) as any}
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        {item.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {item.tags?.slice(0, 2).map((tag, index) => (
              <Chip key={index} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.7rem", height: 20 }} />
            ))}
            {item.tags && item.tags.length > 2 && (
              <Chip
                label={`+${item.tags.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 20 }}
              />
            )}
          </Box>

          {item.assignee && (
            <Avatar sx={{ width: 24, height: 24, fontSize: "0.8rem" }}>{item.assignee.charAt(0).toUpperCase()}</Avatar>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1, color: "text.secondary" }}>
          <Schedule sx={{ fontSize: 14, mr: 0.5 }} />
          <Typography variant="caption">{item.createdAt.toLocaleDateString()}</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
