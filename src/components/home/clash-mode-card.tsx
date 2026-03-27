import {
  DirectionsRounded,
  LanguageRounded,
  MultipleStopRounded,
} from '@mui/icons-material'
import { Box, Typography, alpha, useTheme } from '@mui/material'
import { useLockFn } from 'ahooks'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { closeAllConnections } from 'tauri-plugin-mihomo-api'

import { useVerge } from '@/hooks/use-verge'
import { useAppData } from '@/providers/app-data-context'
import { patchClashMode } from '@/services/cmds'
import type { TranslationKey } from '@/types/generated/i18n-keys'

const CLASH_MODES = ['rule', 'global', 'direct'] as const
type ClashMode = (typeof CLASH_MODES)[number]

const isClashMode = (mode: string): mode is ClashMode =>
  (CLASH_MODES as readonly string[]).includes(mode)

const MODE_META: Record<
  ClashMode,
  { label: TranslationKey; description: TranslationKey }
> = {
  rule: {
    label: 'home.components.clashMode.labels.rule',
    description: 'home.components.clashMode.descriptions.rule',
  },
  global: {
    label: 'home.components.clashMode.labels.global',
    description: 'home.components.clashMode.descriptions.global',
  },
  direct: {
    label: 'home.components.clashMode.labels.direct',
    description: 'home.components.clashMode.descriptions.direct',
  },
}

export const ClashModeCard = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { verge } = useVerge()
  const { clashConfig, refreshClashConfig } = useAppData()
  const isDark = theme.palette.mode === 'dark'

  // 支持的模式列表
  const modeList = CLASH_MODES

  // 直接使用API返回的模式，不维护本地状态
  const currentMode = clashConfig?.mode?.toLowerCase()
  const currentModeKey =
    typeof currentMode === 'string' && isClashMode(currentMode)
      ? currentMode
      : undefined

  const modeDescription = useMemo(() => {
    if (currentModeKey) {
      return t(MODE_META[currentModeKey].description)
    }
    return t('home.components.clashMode.errors.communication')
  }, [currentModeKey, t])

  // 模式图标映射
  const modeIcons = useMemo(
    () => ({
      rule: <MultipleStopRounded fontSize="small" />,
      global: <LanguageRounded fontSize="small" />,
      direct: <DirectionsRounded fontSize="small" />,
    }),
    [],
  )

  // 切换模式的处理函数
  const onChangeMode = useLockFn(async (mode: ClashMode) => {
    if (mode === currentModeKey) return
    if (verge?.auto_close_connection) {
      closeAllConnections()
    }

    try {
      await patchClashMode(mode)
      // 使用共享的刷新方法
      refreshClashConfig()
    } catch (error) {
      console.error('Failed to change mode:', error)
    }
  })

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.5 }}
    >
      {/* iOS-style segmented control */}
      <Box
        sx={{
          display: 'flex',
          bgcolor: isDark
            ? 'rgba(118, 118, 128, 0.24)'
            : 'rgba(118, 118, 128, 0.12)',
          borderRadius: 2,
          p: 0.5,
          gap: 0.5,
        }}
      >
        {modeList.map((mode) => {
          const isActive = mode === currentModeKey
          return (
            <Box
              key={mode}
              onClick={() => onChangeMode(mode)}
              sx={{
                flex: 1,
                cursor: 'pointer',
                borderRadius: 1.5,
                px: 1,
                py: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                transition: 'all 0.2s ease',
                backgroundColor: isActive
                  ? isDark
                    ? 'rgba(255,255,255,0.15)'
                    : '#FFFFFF'
                  : 'transparent',
                boxShadow: isActive
                  ? isDark
                    ? '0 1px 4px rgba(0,0,0,0.4)'
                    : '0 1px 4px rgba(0,0,0,0.12), 0 0.5px 0 rgba(0,0,0,0.06)'
                  : 'none',
                color: isActive
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: isActive
                    ? isDark
                      ? 'rgba(255,255,255,0.15)'
                      : '#FFFFFF'
                    : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              {modeIcons[mode]}
              <Typography
                variant="body2"
                sx={{
                  textTransform: 'capitalize',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '13px',
                  lineHeight: 1,
                }}
              >
                {t(MODE_META[mode].label)}
              </Typography>
            </Box>
          )
        })}
      </Box>

      {/* 说明文本区域 */}
      <Box
        sx={{
          width: '100%',
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.1 : 0.06),
          borderRadius: 1.5,
          px: 1.5,
          py: 1,
          border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)}`,
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            wordBreak: 'break-word',
            hyphens: 'auto',
            lineHeight: 1.5,
          }}
        >
          {modeDescription}
        </Typography>
      </Box>
    </Box>
  )
}
