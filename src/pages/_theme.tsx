import getSystem from '@/utils/get-system'
const OS = getSystem()

// default theme setting — inspired by macOS/iOS design language
export const defaultTheme = {
  primary_color: '#007AFF',
  secondary_color: '#5856D6',
  primary_text: '#1C1C1E',
  secondary_text: '#3C3C4399',
  info_color: '#32ADE6',
  error_color: '#FF3B30',
  warning_color: '#FF9500',
  success_color: '#34C759',
  background_color: '#F2F2F7',
  font_family: `-apple-system, BlinkMacSystemFont,"Microsoft YaHei UI", "Microsoft YaHei", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji"${
    OS === 'windows' ? ', twemoji mozilla' : ''
  }`,
}

// dark mode — inspired by macOS dark appearance
export const defaultDarkTheme = {
  ...defaultTheme,
  primary_color: '#0A84FF',
  secondary_color: '#5E5CE6',
  primary_text: '#FFFFFF',
  background_color: '#1C1C1E',
  secondary_text: '#EBEBF599',
  info_color: '#64D2FF',
  error_color: '#FF453A',
  warning_color: '#FF9F0A',
  success_color: '#30D158',
}
