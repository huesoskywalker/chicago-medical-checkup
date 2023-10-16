import { statsData } from "../../constants/containers/stats-data.js"
import { ContentLoader } from "../../util/ContentLoader.js"
class StatsContainer extends HTMLElement {
    /**
     * @param {ContentLoaderInterface} contentLoader
     */
    constructor(contentLoader) {
        super()
        this.attachShadow({ mode: "open" })
        this.contentLoader = contentLoader
        this.statsData = statsData
    }
    async loadContent() {
        const templatePath = "/templates/containers/stats-container.html"
        const stylePath = "/styles/containers/stats-container.css"
        const nonce = "stats-container"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }
    renderStats() {
        const mainContainer = this.shadowRoot.getElementById("innerContainer")

        const fragment = new DocumentFragment()

        this.statsData.forEach((stat) => {
            const itemContainer = document.createElement("div")
            itemContainer.classList.add("inner-1__item")

            const logoImg = document.createElement("img")
            logoImg.src = stat.logo.src
            logoImg.alt = stat.logo.alt
            logoImg.loading = "lazy"
            logoImg.classList.add("item__logo")
            itemContainer.appendChild(logoImg)

            const statsContainer = document.createElement("div")
            statsContainer.classList.add("item__stats-container")

            const value = document.createElement("div")
            value.classList.add("stats-container__value")
            value.textContent = stat.value
            statsContainer.appendChild(value)

            const symbol = document.createElement("div")
            symbol.classList.add("stats-container__symbol")
            symbol.textContent = stat.symbol
            statsContainer.appendChild(symbol)

            const descriptionContainer = document.createElement("div")
            descriptionContainer.classList.add("item__description")
            descriptionContainer.textContent = stat.description

            itemContainer.appendChild(statsContainer)
            itemContainer.appendChild(descriptionContainer)

            fragment.appendChild(itemContainer)
        })
        mainContainer.appendChild(fragment)
    }
    async connectedCallback() {
        await this.loadContent()
        this.renderStats()
    }
}

const contentLoader = new ContentLoader()

customElements.define(
    "stats-container",
    class extends StatsContainer {
        constructor() {
            super(contentLoader)
        }
    }
)
