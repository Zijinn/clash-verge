import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from '@dnd-kit/core'
import {
  alpha,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material'
import type { CSSProperties, ReactNode } from 'react'
import { useMatch, useNavigate, useResolvedPath } from 'react-router'

import { useVerge } from '@/hooks/use-verge'

interface SortableProps {
  setNodeRef?: (element: HTMLElement | null) => void
  attributes?: DraggableAttributes
  listeners?: DraggableSyntheticListeners
  style?: CSSProperties
  isDragging?: boolean
  disabled?: boolean
}

interface Props {
  to: string
  children: string
  icon: ReactNode[]
  sortable?: SortableProps
}
export const LayoutItem = (props: Props) => {
  const { to, children, icon, sortable } = props
  const { verge } = useVerge()
  const { menu_icon } = verge ?? {}
  const navCollapsed = verge?.collapse_navbar ?? false
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })
  const navigate = useNavigate()

  const effectiveMenuIcon =
    navCollapsed && menu_icon === 'disable' ? 'monochrome' : menu_icon

  const { setNodeRef, attributes, listeners, style, isDragging, disabled } =
    sortable ?? {}

  const draggable = Boolean(sortable) && !disabled
  const dragHandleProps = draggable
    ? { ...(attributes ?? {}), ...(listeners ?? {}) }
    : undefined

  const isSelected = !!match

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={[
        { py: 0.4, maxWidth: 250, mx: 'auto', padding: '3px 0px' },
        isDragging ? { opacity: 0.78 } : {},
      ]}
    >
      <ListItemButton
        selected={isSelected}
        {...(dragHandleProps ?? {})}
        sx={[
          {
            borderRadius: 2,
            marginLeft: 1.25,
            paddingLeft: 1,
            paddingRight: 1,
            marginRight: 1.25,
            cursor: draggable ? 'grab' : 'pointer',
            position: 'relative',
            transition: 'all 0.18s ease',
            '&:active': draggable ? { cursor: 'grabbing' } : {},
            '& .MuiListItemText-primary': {
              color: 'text.primary',
              fontWeight: '600',
              fontSize: '14px',
            },
            '&:hover:not(.Mui-selected)': {
              bgcolor: 'transparent',
            },
          },
          ({ palette: { mode, primary } }) => {
            const selectedBg =
              mode === 'light'
                ? alpha(primary.main, 0.12)
                : alpha(primary.main, 0.22)
            const selectedColor =
              mode === 'light' ? primary.main : primary.light
            return {
              '&.Mui-selected': {
                bgcolor: selectedBg,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: '60%',
                  borderRadius: '0 3px 3px 0',
                  backgroundColor: primary.main,
                },
              },
              '&.Mui-selected:hover': { bgcolor: selectedBg },
              '&.Mui-selected .MuiListItemText-primary': {
                color: selectedColor,
              },
              '&.Mui-selected .MuiListItemIcon-root': {
                color: selectedColor,
              },
            }
          },
        ]}
        title={navCollapsed ? children : undefined}
        aria-label={navCollapsed ? children : undefined}
        onClick={() => navigate(to)}
      >
        {/* Active selection indicator dot for icon-only mode */}
        {navCollapsed && isSelected && (
          <Box
            sx={{
              position: 'absolute',
              right: 6,
              top: 6,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
            }}
          />
        )}

        {(effectiveMenuIcon === 'monochrome' || !effectiveMenuIcon) && (
          <ListItemIcon
            sx={{
              color: isSelected ? 'primary.main' : 'text.secondary',
              marginLeft: '6px',
              cursor: draggable ? 'grab' : 'inherit',
              transition: 'color 0.18s ease',
              minWidth: 36,
            }}
          >
            {icon[0]}
          </ListItemIcon>
        )}
        {effectiveMenuIcon === 'colorful' && (
          <ListItemIcon
            sx={{
              cursor: draggable ? 'grab' : 'inherit',
              minWidth: 36,
            }}
          >
            {icon[1]}
          </ListItemIcon>
        )}
        <ListItemText
          sx={{
            textAlign: 'center',
            marginLeft: effectiveMenuIcon === 'disable' ? '' : '-35px',
          }}
          primary={children}
        />
      </ListItemButton>
    </ListItem>
  )
}
