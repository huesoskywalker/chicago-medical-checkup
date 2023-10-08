class InfoContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/containers/info-container.html").then((response) => response.text()),
            fetch("/styles/containers/info-container.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }

    async connectedCallback() {
        await this.loadContent()
    }
}

customElements.define("info-container", InfoContainer)
