import { ContentLoader } from "../../util/ContentLoader.js"
import { ContentLoaderInjector } from "../../util/ContentLoaderInjector.js"

class ContactContainer extends HTMLElement {
    /**
     * @param {ContentLoader} contentLoader
     */

    constructor(contentLoader) {
        super()
        this.attachShadow({ mode: "open" })
        this.contentLoader = contentLoader
    }
    async loadContent() {
        const templatePath = "/templates/containers/contact-container.html"
        const stylePath = "/styles/containers/contact-container.css"
        const nonce = "contact-container"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }

    async connectedCallback() {
        await this.loadContent()
    }
}

const contentLoaderInstance = ContentLoaderInjector.getInstance()

customElements.define(
    "contact-container",
    class extends ContactContainer {
        constructor() {
            super(contentLoaderInstance)
        }
    }
)
