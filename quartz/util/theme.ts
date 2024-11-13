export interface ColorScheme {
  light: string
  lightgray: string
  gray: string
  darkgray: string
  dark: string
  secondary: string
  tertiary: string
  highlight: string
  textHighlight: string
  black: string
  bg: string
  fg: string
  purple: string
  green: string
  orange: string
  blue: string
  yellow: string
  cyan: string
  red: string
  grey: string
}

interface Colors {
  lightMode: ColorScheme
  darkMode: ColorScheme
}

export interface Theme {
  typography: {
    header: string
    body: string
    code: string
  }
  cdnCaching: boolean
  colors: Colors
  fontOrigin: "googleFonts" | "local"
}

export type ThemeKey = keyof Colors

const DEFAULT_SANS_SERIF =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
const DEFAULT_MONO = "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace"

export function googleFontHref(theme: Theme) {
  const { code, header, body } = theme.typography
  return `https://fonts.googleapis.com/css2?family=${code}&family=${header}:wght@400;700&family=${body}:ital,wght@0,400;0,600;1,400;1,600&display=swap`
}

export function joinStyles(theme: Theme, ...stylesheet: string[]) {
  return `
${stylesheet.join("\n\n")}

:root {
  --light: ${theme.colors.lightMode.light};
  --lightgray: ${theme.colors.lightMode.lightgray};
  --gray: ${theme.colors.lightMode.gray};
  --darkgray: ${theme.colors.lightMode.darkgray};
  --dark: ${theme.colors.lightMode.dark};
  --secondary: ${theme.colors.lightMode.secondary};
  --tertiary: ${theme.colors.lightMode.tertiary};
  --highlight: ${theme.colors.lightMode.highlight};
  --textHighlight: ${theme.colors.lightMode.textHighlight};
  --black: ${theme.colors.lightMode.black};
  --bg: ${theme.colors.lightMode.bg};
  --fg: ${theme.colors.lightMode.fg};
  --purple: ${theme.colors.lightMode.purple};
  --green: ${theme.colors.lightMode.green};
  --orange: ${theme.colors.lightMode.orange};
  --blue: ${theme.colors.lightMode.blue};
  --yellow: ${theme.colors.lightMode.yellow};
  --cyan: ${theme.colors.lightMode.cyan};
  --red: ${theme.colors.lightMode.red};
  --grey: ${theme.colors.lightMode.grey};

  --headerFont: "${theme.typography.header}", ${DEFAULT_SANS_SERIF};
  --bodyFont: "${theme.typography.body}", ${DEFAULT_SANS_SERIF};
  --codeFont: "${theme.typography.code}", ${DEFAULT_MONO};
}

:root[saved-theme="dark"] {
  --light: ${theme.colors.darkMode.light};
  --lightgray: ${theme.colors.darkMode.lightgray};
  --gray: ${theme.colors.darkMode.gray};
  --darkgray: ${theme.colors.darkMode.darkgray};
  --dark: ${theme.colors.darkMode.dark};
  --secondary: ${theme.colors.darkMode.secondary};
  --tertiary: ${theme.colors.darkMode.tertiary};
  --highlight: ${theme.colors.darkMode.highlight};
  --textHighlight: ${theme.colors.darkMode.textHighlight};
  --black: ${theme.colors.darkMode.black};
  --bg: ${theme.colors.darkMode.bg};
  --fg: ${theme.colors.darkMode.fg};
  --purple: ${theme.colors.darkMode.purple};
  --green: ${theme.colors.darkMode.green};
  --orange: ${theme.colors.darkMode.orange};
  --blue: ${theme.colors.darkMode.blue};
  --yellow: ${theme.colors.darkMode.yellow};
  --cyan: ${theme.colors.darkMode.cyan};
  --red: ${theme.colors.darkMode.red};
  --grey: ${theme.colors.darkMode.grey};
}
`
}
