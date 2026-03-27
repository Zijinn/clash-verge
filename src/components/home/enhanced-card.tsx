import { Box, Typography, alpha, useTheme } from '@mui/material'
import React, { forwardRef, ReactNode } from 'react'

// 自定义卡片组件接口
interface EnhancedCardProps {
  title: ReactNode
  icon: ReactNode
  action?: ReactNode
  children: ReactNode
  iconColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  minHeight?: number | string
  noContentPadding?: boolean
}

// 自定义卡片组件 — macOS-inspired clean card design
export const EnhancedCard = forwardRef<HTMLElement, EnhancedCardProps>(
  (
    {
      title,
      icon,
      action,
      children,
      iconColor = 'primary',
      minHeight,
      noContentPadding = false,
    },
    ref,
  ) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'
    const accentColor = theme.palette[iconColor].main

    // 统一的标题截断样式
    const titleTruncateStyle = {
      minWidth: 0,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
    }

    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2.5,
          backgroundColor: isDark
            ? 'rgba(44, 44, 46, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.25)'
            : '0 2px 8px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'box-shadow 0.2s ease, transform 0.15s ease',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: isDark
              ? '0 4px 16px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)'
              : '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
          },
        }}
        ref={ref}
      >
        {/* Colored accent strip at top */}
        <Box
          sx={{
            height: 3,
            background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.5)})`,
            flexShrink: 0,
          }}
        />

        {/* Card header */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 0,
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                width: 34,
                height: 34,
                mr: 1.25,
                flexShrink: 0,
                backgroundColor: alpha(accentColor, isDark ? 0.18 : 0.12),
                color: accentColor,
              }}
            >
              {icon}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              {typeof title === 'string' ? (
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontSize={15}
                  sx={titleTruncateStyle}
                  title={title}
                >
                  {title}
                </Typography>
              ) : (
                <Box sx={titleTruncateStyle}>{title}</Box>
              )}
            </Box>
          </Box>
          {action && <Box sx={{ ml: 2, flexShrink: 0 }}>{action}</Box>}
        </Box>

        {/* Card content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: noContentPadding ? 0 : 2,
            ...(minHeight && { minHeight }),
          }}
        >
          {children}
        </Box>
      </Box>
    )
  },
)
