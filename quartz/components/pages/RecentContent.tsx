// RecentContent.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import path from "path"

import style from "../styles/listPage.scss"
import { byDateAndAlphabetical, PageList } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"

interface RecentContentOptions {
  showIndex: boolean
  postsPerPage: number
}

const defaultOptions: RecentContentOptions = {
  showIndex: false,
  postsPerPage: 10,
}

// Add styles for pagination controls
const paginationStyle = `
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-controls button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--lightgray);
  background: var(--light);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-controls button:hover {
  background: var(--lightgray);
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls .page-info {
  margin: 0 1rem;
}

.page-list[hidden] {
  display: none;
}
`

// Client-side pagination script
const paginationScript = `
document.addEventListener('DOMContentLoaded', () => {
  const pageContainer = document.querySelector('[data-paginated-container]')
  if (!pageContainer) return

  const pageLists = Array.from(pageContainer.querySelectorAll('[data-page]'))
  const totalPages = pageLists.length
  let currentPage = 1

  const prevButton = pageContainer.querySelector('[data-prev-page]')
  const nextButton = pageContainer.querySelector('[data-next-page]')
  const pageInfo = pageContainer.querySelector('[data-page-info]')

  function updatePage(page) {
    // Hide all pages
    pageLists.forEach(pageList => {
      pageList.hidden = true
    })
    // Show current page
    const currentPageElement = pageContainer.querySelector(\`[data-page="\${page}"]\`)
    if (currentPageElement) {
      currentPageElement.hidden = false
    }

    // Update buttons state
    if (prevButton) prevButton.disabled = page === 1
    if (nextButton) nextButton.disabled = page === totalPages
    
    // Update page info
    if (pageInfo) {
      pageInfo.textContent = \`Page \${page} of \${totalPages}\`
    }
  }

  prevButton?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--
      updatePage(currentPage)
    }
  })

  nextButton?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++
      updatePage(currentPage)
    }
  })

  // Initialize first page
  updatePage(currentPage)
})
`

export default ((opts?: Partial<RecentContentOptions>) => {
  const options: RecentContentOptions = { ...defaultOptions, ...opts }

  const RecentContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles } = props

    // Filter and sort all files
    const allPagesToShow = allFiles
      .filter((data) => (options.showIndex ? true : !data.filePath?.includes("index.md")))
      .sort(byDateAndAlphabetical(props.cfg))

    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = ["popover-hint", ...cssClasses].join(" ")
    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)

    // Calculate total pages
    const totalPages = Math.ceil(allPagesToShow.length / options.postsPerPage)

    // Create arrays of paginated content
    const paginatedContent = Array.from({ length: totalPages }, (_, pageIndex) => {
      const startIdx = pageIndex * options.postsPerPage
      const endIdx = startIdx + options.postsPerPage
      return allPagesToShow.slice(startIdx, endIdx)
    })

    return (
      <div class={classes}>
        <article>{content}</article>
        <div class="page-listing" data-paginated-container>
          {/* Render all pages but initially hide them */}
          {paginatedContent.map((pageFiles, pageIndex) => (
            <div data-page={pageIndex + 1} hidden={pageIndex !== 0}>
              <PageList {...props} allFiles={pageFiles} />
            </div>
          ))}

          <div class="pagination-controls">
            <button data-prev-page disabled>
              Previous
            </button>
            <span data-page-info>Page 1 of {totalPages}</span>
            <button data-next-page disabled={totalPages <= 1}>
              Next
            </button>
          </div>
        </div>

        {/* Add the pagination script */}
        <script dangerouslySetInnerHTML={{ __html: paginationScript }} />
      </div>
    )
  }

  RecentContent.css = style + PageList.css + paginationStyle
  return RecentContent
}) satisfies QuartzComponentConstructor
