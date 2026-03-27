import {
  ComputerRounded,
  TroubleshootRounded,
  HelpOutlineRounded,
  SvgIconComponent,
} from '@mui/icons-material'
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  alpha,
  useTheme,
  Fade,
} from '@mui/material'
import { useState, useMemo, memo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import ProxyControlSwitches from '@/components/shared/proxy-control-switches'
import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useSystemState } from '@/hooks/use-system-state'
import { useVerge } from '@/hooks/use-verge'
import { showNotice } from '@/services/notice-service'

const LOCAL_STORAGE_TAB_KEY = 'clash-verge-proxy-active-tab'

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  icon: SvgIconComponent
  label: string
  hasIndicator?: boolean
}

// Tab组件 — iOS segmented control style
const TabButton: FC<TabButtonProps> = memo(
  ({ isActive, onClick, icon: Icon, label, hasIndicator = false }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    return (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          px: 1,
          py: 0.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          flex: 1,
          maxWidth: 160,
          transition: 'all 0.2s ease',
          borderRadius: 1.5,
          position: 'relative',
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
        <Icon
          fontSize="small"
          sx={{ color: 'inherit', transition: 'color 0.2s' }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: isActive ? 600 : 400,
            fontSize: '13px',
            color: 'inherit',
            lineHeight: 1,
          }}
        >
          {label}
        </Typography>
        {hasIndicator && (
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: isActive ? theme.palette.primary.main : 'success.main',
              position: 'absolute',
              top: 5,
              right: 5,
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            }}
          />
        )}
      </Box>
    )
  },
)

interface TabDescriptionProps {
  description: string
  tooltipTitle: string
}

// 描述文本组件
const TabDescription: FC<TabDescriptionProps> = memo(
  ({ description, tooltipTitle }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === 'dark'

    return (
      <Fade in={true} timeout={200}>
        <Typography
          variant="caption"
          component="div"
          sx={{
            width: '95%',
            textAlign: 'center',
            color: 'text.secondary',
            px: 1.5,
            py: 0.8,
            borderRadius: 1.5,
            backgroundColor: alpha(
              theme.palette.primary.main,
              isDark ? 0.1 : 0.06,
            ),
            border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            wordBreak: 'break-word',
            hyphens: 'auto',
            lineHeight: 1.5,
          }}
        >
          {description}
          <Tooltip title={tooltipTitle}>
            <HelpOutlineRounded
              sx={{ fontSize: 14, opacity: 0.7, flexShrink: 0 }}
            />
          </Tooltip>
        </Typography>
      </Fade>
    )
  },
)

export const ProxyTunCard: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const [activeTab, setActiveTab] = useState<string>(
    () => localStorage.getItem(LOCAL_STORAGE_TAB_KEY) || 'system',
  )

  const { verge } = useVerge()
  const { isTunModeAvailable } = useSystemState()
  const { configState: systemProxyConfigState } = useSystemProxyState()

  const { enable_tun_mode } = verge ?? {}

  const handleError = (err: unknown) => {
    showNotice.error(err)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    localStorage.setItem(LOCAL_STORAGE_TAB_KEY, tab)
  }

  const tabDescription = useMemo(() => {
    if (activeTab === 'system') {
      return {
        text: systemProxyConfigState
          ? t('home.components.proxyTun.status.systemProxyEnabled')
          : t('home.components.proxyTun.status.systemProxyDisabled'),
        tooltip: t('home.components.proxyTun.tooltips.systemProxy'),
      }
    } else {
      return {
        text: !isTunModeAvailable
          ? t('home.components.proxyTun.status.tunModeServiceRequired')
          : enable_tun_mode
            ? t('home.components.proxyTun.status.tunModeEnabled')
            : t('home.components.proxyTun.status.tunModeDisabled'),
        tooltip: t('home.components.proxyTun.tooltips.tunMode'),
      }
    }
  }, [
    activeTab,
    systemProxyConfigState,
    enable_tun_mode,
    isTunModeAvailable,
    t,
  ])

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1.5 }}
    >
      {/* iOS-style segmented control tabs */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          bgcolor: isDark
            ? 'rgba(118, 118, 128, 0.24)'
            : 'rgba(118, 118, 128, 0.12)',
          borderRadius: 2,
          p: 0.5,
        }}
      >
        <TabButton
          isActive={activeTab === 'system'}
          onClick={() => handleTabChange('system')}
          icon={ComputerRounded}
          label={t('settings.sections.system.toggles.systemProxy')}
          hasIndicator={systemProxyConfigState}
        />
        <TabButton
          isActive={activeTab === 'tun'}
          onClick={() => handleTabChange('tun')}
          icon={TroubleshootRounded}
          label={t('settings.sections.system.toggles.tunMode')}
          hasIndicator={enable_tun_mode && isTunModeAvailable}
        />
      </Stack>

      {/* Tab description */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TabDescription
          description={tabDescription.text}
          tooltipTitle={tabDescription.tooltip}
        />
      </Box>

      {/* Proxy control switches */}
      <Box
        sx={{
          p: 1.25,
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.06 : 0.04),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, isDark ? 0.1 : 0.06)}`,
        }}
      >
        <ProxyControlSwitches
          onError={handleError}
          label={
            activeTab === 'system'
              ? t('settings.sections.system.toggles.systemProxy')
              : t('settings.sections.system.toggles.tunMode')
          }
          noRightPadding={true}
        />
      </Box>
    </Box>
  )
}
