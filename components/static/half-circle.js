class HalfCircle extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.componentId = undefined
    }
    static get observedAttributes() {
        return ["class"]
    }

    attributeChangedCallback(props, oldValue, newValue) {
        if (props === "class") {
            this.componentId = newValue
        }
    }

    async loadContent() {
        await Promise.all([
            fetch("/templates/static/half-circle.html").then((response) => response.text()),
            fetch("/styles/static/half-circle.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }

    addClass(value) {
        const halfCircleContainer = this.shadowRoot.querySelector(".half-circle")
        halfCircleContainer.classList.add(value)
    }
    async connectedCallback() {
        await this.loadContent()
        if (this.componentId) {
            this.addClass(this.componentId)
        }
    }
}

customElements.define("half-circle", HalfCircle)
