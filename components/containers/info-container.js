class InfoContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.resizeHandler = this.handleResize.bind(this)
        this.contentRendered = false
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
    renderResponsiveContent() {
        const textElement = this.shadowRoot.querySelector(".inner-1-text")

        const textContainer = document.createElement("div")
        textContainer.classList.add("inner-1-text-2")

        const prefixSpan = document.createElement("span")
        prefixSpan.textContent = "Only"
        textContainer.appendChild(prefixSpan)

        const freeSpan = document.createElement("span")
        freeSpan.classList.add("free-span")
        freeSpan.textContent = "11"
        textContainer.appendChild(freeSpan)

        const suffixSpan = document.createElement("span")
        suffixSpan.textContent = "spots available!"
        textContainer.appendChild(suffixSpan)

        textElement.parentNode.insertBefore(textContainer, textElement.nextSibling)

        this.contentRendered = true
    }
    removeResponsiveContent() {
        const responsiveContainer = this.shadowRoot.querySelector(".inner-1-text-2")
        responsiveContainer.parentNode.removeChild(responsiveContainer)

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
}

customElements.define("info-container", InfoContainer)
