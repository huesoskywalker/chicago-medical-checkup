class BookAppointment extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.componentId = undefined
    }

    static get observedAttributes() {
        return ["id"]
    }
    attributeChangedCallback(props, oldValue, newValue) {
        if (props === "id") {
            this.componentId = newValue
        }
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/interactive/book-appointment.html").then((response) =>
                response.text()
            ),
            fetch("/styles/interactive/book-appointment.css").then((response) => response.text()),
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
        const appointmentContainer = this.shadowRoot.querySelector(".book-appointment")
        appointmentContainer.classList.add(value)
    }
    async connectedCallback() {
        await this.loadContent()
        if (this.componentId) {
            this.addClass(this.componentId)
        }
    }
}

customElements.define("book-appointment", BookAppointment)
