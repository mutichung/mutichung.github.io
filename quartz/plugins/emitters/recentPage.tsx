import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import path from "path"
import {
  FilePath,
  FullSlug,
  SimpleSlug,
  stripSlashes,
  joinSegments,
  pathToRoot,
  simplifySlug,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { RecentContent, FolderContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

interface RecentPageOptions extends FullPageLayout {
  showIndex?: boolean
}

export const RecentPage: QuartzEmitterPlugin<Partial<RecentPageOptions>> = (userOpts) => {
  const recentPageFilename = "recent"
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: RecentContent({ showIndex: userOpts?.showIndex }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "RecentPage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const cfg = ctx.cfg.configuration
      const slug = recentPageFilename as FullSlug
      const vfileData = {
        slug,
        text: "",
        description: "",
        frontmatter: { title: "Recent", tags: [] },
      }
      const externalResources = pageResources(pathToRoot(slug), vfileData, resources)
      const [tree, _vfile] = defaultProcessedContent(vfileData)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfileData,
        externalResources,
        cfg,
        children: [],
        tree: tree,
        allFiles: content.map((contentData) => contentData[1].data),
      }

      const page_content = renderPage(cfg, slug, componentData, opts, externalResources)
      const fp = await write({
        ctx,
        slug,
        content: page_content,
        ext: ".html",
      })

      return [fp]
    },
  }
}
