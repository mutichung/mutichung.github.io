import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        // from data-repo
        repo: "mutichung/mutichung.github.io",
        // from data-repo-id
        repoId: "R_kgDOMGmoGw",
        // from data-category
        category: "Announcements",
        // from data-category-id
        categoryId: "DIC_kwDOMGmoG84Cf9Iv",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/mutichung",
    },
  }),
}

const MyExplorer = (): any => {
  return Component.Explorer({
    title: "Explorer", // title of the explorer component
    folderClickBehavior: "link",
    folderDefaultState: "collapsed",
    useSavedState: true,
  })
}

const RecentNotesSidebar = (): any => {
  return Component.RecentNotes({
    title: "Recent Posts",
    limit: 3,
    showTags: false,
    linkToMore: "/recent" as SimpleSlug,
    filter: (f) => !f.slug?.includes("index"),
  })
}
// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    MyExplorer(),
    Component.DesktopOnly(RecentNotesSidebar()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    MyExplorer(),
    Component.DesktopOnly(RecentNotesSidebar()),
  ],
  right: [],
}
