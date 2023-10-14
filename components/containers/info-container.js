const spotsData = {
    prefix: "Only",
    value: "11",
    suffix: "spots available!",
}

class InfoContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.resizeHandler = this.handleResize.bind(this)
        this.contentRendered = false
        this.responsiveText = undefined
        this.spotsData = spotsData
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
}

customElements.define("info-container", InfoContainer)
