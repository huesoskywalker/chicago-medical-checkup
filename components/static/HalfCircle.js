import { ContentLoader } from "/../../util/ContentLoader.js"

class HalfCircle extends HTMLElement {
    /**
     * @param {ContentLoaderInterface} contentLoader
     */
    constructor(contentLoader) {
        super()
        this.attachShadow({ mode: "open" })
        this.contentLoader = contentLoader
        this.componentClass
    }
    static get observedAttributes() {
        return ["class"]
    }

    attributeChangedCallback(props, oldValue, newValue) {
        if (props === "class") {
            this.componentClass = newValue
        }
    }

    async loadContent() {
        const templatePath = "/templates/static/half-circle.html"
        const stylePath = "/styles/static/half-circle.css"
        const nonce = "half-circle"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }

    addClass(value) {
        const halfCircleContainer = this.shadowRoot.getElementById("halfCircle")
        halfCircleContainer.classList.add(value)
    }
    async connectedCallback() {
        await this.loadContent()
        if (this.componentClass) {
            this.addClass(this.componentClass)
        }
    }
}

const contentLoader = new ContentLoader()

customElements.define(
    "half-circle",
    class extends HalfCircle {
        constructor() {
            super(contentLoader)
        }
    }
)
