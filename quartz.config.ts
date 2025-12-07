import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "📖 __dict__",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "en-US",
    baseUrl: "mutichung.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Funnel Display",
        body: "Funnel Sans",
        code: "Fira Code",
      },
      colors: {
        lightMode: {
          light: "#FAFAFA",
          lightgray: "#e5e5e5",
          gray: "#939393ff",
          darkgray: "#252525ff",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#738f88ff",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
          black: "#181a1f",
          bg: "#FAFAFA",
          fg: "#27292fff",
          purple: "#A626A4",
          green: "#50A14F",
          orange: "#986801",
          blue: "#4078F2",
          yellow: "#C18401",
          cyan: "#0184BC",
          red: "#E45649",
          grey: "#4d535eff",
        },
        darkMode: {
          light: "#1F2328",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#8c9da8",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
          black: "#181a1f",
          bg: "#282c34",
          fg: "#abb2bf",
          purple: "#c678dd",
          green: "#98c379",
          orange: "#d19a66",
          blue: "#61afef",
          yellow: "#e5c07b",
          cyan: "#56b6c2",
          red: "#e86671",
          grey: "#5c6370",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "one-light",
          dark: "one-dark-pro",
        },
        keepBackground: true,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
