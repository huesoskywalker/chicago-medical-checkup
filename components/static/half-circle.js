class HalfCircle extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.componentClass = undefined
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
        if (this.componentClass) {
            this.addClass(this.componentClass)
        }
    }
}

customElements.define("half-circle", HalfCircle)
