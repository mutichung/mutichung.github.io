import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import path from "path"

import style from "../styles/listPage.scss"
import { byDateAndAlphabetical, PageList, SortFn } from "../PageList"
import { stripSlashes, simplifySlug, joinSegments, FullSlug } from "../../util/path"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"

interface RecentContentOptions {
  showIndex: boolean
}

const defaultOptions: RecentContentOptions = {
  showIndex: false,
}

export default ((opts?: Partial<RecentContentOptions>) => {
  const options: RecentContentOptions = { ...defaultOptions, ...opts }



  const RecentContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    const allPagesToShow = allFiles.filter(
      (data, _idx, _arr) => options.showIndex ? true : !data.filePath?.includes("index.md")
    )
    const listProps = {
      ...props,
      sort: byDateAndAlphabetical,
      allFiles: allPagesToShow,
    }
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = ["popover-hint", ...cssClasses].join(" ")
    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)

    return (
      <div class={classes}>
        <article>{content}</article>
        <div class="page-listing">
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }

  RecentContent.css = style + PageList.css
  return RecentContent
}) satisfies QuartzComponentConstructor
