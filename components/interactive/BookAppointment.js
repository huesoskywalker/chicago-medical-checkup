import { ContentLoader } from "../../util/ContentLoader.js"
import { ContentLoaderInjector } from "../../util/ContentLoaderInjector.js"

class BookAppointment extends HTMLElement {
    /**
     * @param {ContentLoader} contentLoader
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
        const templatePath = "/templates/interactive/book-appointment.html"
        const stylePath = "/styles/interactive/book-appointment.css"
        const nonce = "book-appointment"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }
    addClass(value) {
        const appointmentContainer = this.shadowRoot.getElementById("bookAppointment")
        appointmentContainer.classList.add(value)
    }
    async connectedCallback() {
        await this.loadContent()
        if (this.componentClass) {
            this.addClass(this.componentClass)
        }
    }
}

const contentLoaderInstance = ContentLoaderInjector.getInstance()

customElements.define(
    "book-appointment",
    class extends BookAppointment {
        constructor() {
            super(contentLoaderInstance)
        }
    }
)
