import { faqsData } from "../../constants/containers/faqs-data.js"
class FaqsContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.faqsData = faqsData
        this.faqMemoization = undefined
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/containers/faqs-container.html").then((response) => response.text()),
            fetch("/styles/containers/faqs-container.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }
    renderFAQS() {
        const faqContainer = this.shadowRoot.getElementById("faqsContainer")

        const fragment = new DocumentFragment()

        this.faqsData.forEach((faqEntry) => {
            const faqElement = document.createElement("div")
            faqElement.classList.add("faqs-container__faq")

            const questionElement = document.createElement("div")
            questionElement.classList.add("faq-question")
            questionElement.textContent = faqEntry.question
            faqElement.appendChild(questionElement)

            const buttonElement = document.createElement("button")
            buttonElement.classList.add("faq-dropdown")
            faqElement.appendChild(buttonElement)

            const buttonImage = document.createElement("img")
            buttonImage.src = faqEntry.dropdownLogo
            buttonImage.alt = "Faq Dropdown"
            buttonImage.loading = "lazy"
            buttonElement.appendChild(buttonImage)

            const answerElement = document.createElement("div")
            answerElement.classList.add("faq-answer")
            answerElement.textContent = faqEntry.answer
            faqElement.appendChild(answerElement)

            fragment.appendChild(faqElement)
        })
        faqContainer.appendChild(fragment)
    }
    toggleDropdown(dropdown) {
        const faqContainer = dropdown.closest(".faqs-container__faq")
        if (!this.faqMemoization) {
            faqContainer.classList.add("active")
            this.faqMemoization = faqContainer
        } else {
            this.faqMemoization.classList.remove("active")
            if (faqContainer !== this.faqMemoization) {
                const faqAnswer = this.faqMemoization.querySelector(".faq-answer")
                faqAnswer.addEventListener(
                    "transitionend",
                    () => {
                        faqContainer.classList.add("active")
                    },
                    { once: true }
                )
                this.faqMemoization = faqContainer
            } else {
                this.faqMemoization = undefined
            }
        }
    }

    async connectedCallback() {
        await this.loadContent()
        this.renderFAQS()
        const faqDropdowns = this.shadowRoot.querySelectorAll(".faq-dropdown")
        faqDropdowns.forEach((dropdown) => {
            dropdown.addEventListener("click", () => this.toggleDropdown(dropdown))
        })
    }
}
customElements.define("faqs-container", FaqsContainer)
