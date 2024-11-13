import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout, GlobalConfiguration } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
  SimpleSlug,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import RecentNotes, { Options as RecentNotesOption } from "../../components/RecentNotes"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"
import { Node } from "hast"

interface RecentPostsOptions extends FullPageLayout {
  recentNotesOptions?: Partial<RecentNotesOption>,
}

export const RecentPosts: QuartzEmitterPlugin<Partial<RecentPostsOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: RecentNotes(userOpts?.recentNotesOptions),
    ...userOpts,
  }
  const recentPostsFilename = 'recent_posts'

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "RecentPosts",
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
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()
      const recentPostsPagePath = joinSegments(ctx.argv.output, recentPostsFilename) as FilePath

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!
        // Exclude files with "index" in their filename
        if (!sourcePath.includes('index')) {
          graph.addEdge(sourcePath, recentPostsPagePath)
        }
      }

      return graph
    },
    async emit(ctx, _content, resources): Promise<FilePath[]> {
      const cfg = ctx.cfg.configuration
      const slug = recentPostsFilename as FullSlug
      const externalResources = pageResources(pathToRoot(slug), resources)
      const vfileData = {
        slug,
        text: "",
        description: "",
        frontmatter: { title: "Recent Posts", tags: [] },
      }
      const [tree, _vfile] = defaultProcessedContent(vfileData)
      const componentData: QuartzComponentProps = {
        ctx,
        fileData: vfileData,
        externalResources,
        cfg,
        children: [],
        tree: tree,
        allFiles: [],
      }
      // console.log(pathToRoot(slug))
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
