import { spotsData } from "../../constants/containers/info-data.js"
import { ContentLoader } from "../../util/ContentLoader.js"

class InfoContainer extends HTMLElement {
    /**
     * @param {ContentLoaderInterface} contentLoader
     */
    constructor(contentLoader) {
        super()
        this.attachShadow({ mode: "open" })
        this.contentLoader = contentLoader
        this.resizeHandler = this.handleResize.bind(this)
        this.contentRendered = false
        this.responsiveText
        this.spotsData = spotsData
    }
    async loadContent() {
        const templatePath = "/templates/containers/info-container.html"
        const stylePath = "/styles/containers/info-container.css"
        const nonce = "info-container"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }

    renderResponsiveContent() {
        const textElement = this.shadowRoot.getElementById("innerText")

        const fragment = new DocumentFragment()

        this.responsiveContainer = document.createElement("div")
        this.responsiveContainer.classList.add("inner-1__responsive-text")

        const prefixSpan = document.createElement("span")
        prefixSpan.textContent = this.spotsData.prefix
        fragment.appendChild(prefixSpan)

        const valueSpan = document.createElement("span")
        valueSpan.classList.add("value-span")
        valueSpan.textContent = this.spotsData.value
        fragment.appendChild(valueSpan)

        const suffixSpan = document.createElement("span")
        suffixSpan.textContent = this.spotsData.suffix
        fragment.appendChild(suffixSpan)

        this.responsiveContainer.appendChild(fragment)

        textElement.parentNode.insertBefore(this.responsiveContainer, textElement.nextSibling)

        this.contentRendered = true
    }
    removeResponsiveContent() {
        this.responsiveContainer.parentNode.removeChild(this.responsiveContainer)

        this.contentRendered = false
    }
    handleResize() {
        if (window.innerWidth <= 768 && !this.contentRendered) {
            this.renderResponsiveContent()
        } else if (window.innerWidth > 768 && this.contentRendered) {
            this.removeResponsiveContent()
        }
    }

    async connectedCallback() {
        await this.loadContent()
        if (window.innerWidth <= 768) {
            this.renderResponsiveContent()
        }
        window.addEventListener("resize", () => this.resizeHandler())
    }
    disconnectedCallback() {
        window.removeEventListener("resize", () => this.resizeHandler())
    }
}

const contentLoader = new ContentLoader()

customElements.define(
    "info-container",
    class extends InfoContainer {
        constructor() {
            super(contentLoader)
        }
    }
)
