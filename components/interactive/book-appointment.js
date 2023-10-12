class BookAppointment extends HTMLElement {
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
        if (this.componentClass) {
            this.addClass(this.componentClass)
        }
    }
}

customElements.define("book-appointment", BookAppointment)
