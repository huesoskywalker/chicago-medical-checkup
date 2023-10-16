import { ContentLoader } from "/../../util/ContentLoader.js"

class FullCircle extends HTMLElement {
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
        const templatePath = "/templates/static/full-circle.html"
        const stylePath = "/styles/static/full-circle.css"
        const nonce = "full-circle"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }
    addClass(value) {
        const circleContainer = this.shadowRoot.getElementById("fullCircle")
        circleContainer.classList.add(value)
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
    "full-circle",
    class extends FullCircle {
        constructor() {
            super(contentLoader)
        }
    }
)
