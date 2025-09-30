import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzPluginData } from "./quartz/plugins/vfile"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'mutichung/mutichung.github.io',
        // from data-repo-id
        repoId: 'R_kgDOMGmoGw',
        // from data-category
        category: 'Announcements',
        // from data-category-id
        categoryId: 'DIC_kwDOMGmoG84Cf9Iv',
      }
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/mutichung",
    },
  }),
}

const explorer = Component.Explorer({
  title: "Explorer", // title of the explorer component
  folderClickBehavior: "link",
  folderDefaultState: "collapsed",
  useSavedState: true,
})

const recentNotes = [
  Component.RecentNotes({
    title: "🌳 Recent Trees",
    limit: 3,
    linkToMore: "blog/" as SimpleSlug,
    showTags: false,
    filter: (f) =>
      f.slug!.startsWith("blog/") && f.slug! !== "blog/index" && !f.frontmatter?.noindex,
  }),
  Component.RecentNotes({
    title: "🌱 Recent Seedlings",
    limit: 2,
    linkToMore: "garden/" as SimpleSlug,
    showTags: false,
    filter: (f) =>
      f.slug!.startsWith("garden/") && !f.slug!.endsWith("index") &&!f.frontmatter?.noindex,
  })
]

const left = [
  Component.PageTitle(),
  Component.MobileOnly(Component.Spacer()),
  Component.Flex({
    components: [
      {
        Component: Component.Search(),
        grow: true,
      },
      { Component: Component.Darkmode() },
      { Component: Component.ReaderMode() },
    ],
  }),
  // Component.DesktopOnly(explorer),
  ...recentNotes.map((c) => Component.DesktopOnly(c)),
]

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: left,
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: left,
  right: [],
}
