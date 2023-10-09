const faqsData = [
    {
        question: "Why is it free?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim dolor eveniet cum ratione est at.",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " Do I need this if I’ve had my yearly medical check? What is the difference? ",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident quae libero ipsum natus in. Distinctio vitae nihil quam laudantium facilis.",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " Can I bring another person to the appointment?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum iste culpa tenetur necessitatibus.",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " How long does it take?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, quos?",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " What if I have to cancel or if I’m not sure I’ll be able to make it?",
        answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex autem commodi debitis numquam! Corporis molestias magnam asperiores ad quas.",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " Do I need to bring anything with me?",
        answer: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis in non quam, corrupti dolorum veritatis iure delectus odio consequuntur eius sed debitis.",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
    {
        question: " What if I don’t have insurance?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus molestiae vitae incidunt eligendi, obcaecati repellendus? Reprehenderit?",
        dropdownLogo: "/assets/faq-Vector.svg",
    },
]

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
        const faqContainer = this.shadowRoot.querySelector(".inner-1-faqs-container")

        this.faqsData.forEach((faqEntry) => {
            const faqElement = document.createElement("div")
            faqElement.classList.add("faq-container")

            const questionElement = document.createElement("div")
            questionElement.classList.add("faq-question")
            questionElement.textContent = faqEntry.question

            const buttonElement = document.createElement("button")
            buttonElement.classList.add("faq-dropdown")

            const imgElement = document.createElement("img")
            imgElement.src = faqEntry.dropdownLogo
            imgElement.alt = "Faq Dropdown"
            imgElement.loading = "lazy"

            const answerElement = document.createElement("div")
            answerElement.classList.add("faq-answer")
            answerElement.textContent = faqEntry.answer

            buttonElement.appendChild(imgElement)

            faqElement.appendChild(questionElement)
            faqElement.appendChild(buttonElement)
            faqElement.appendChild(answerElement)

            faqContainer.appendChild(faqElement)
        })
    }
    toggleDropdown(dropdown) {
        if (this.faqMemoization) {
            this.faqMemoization.classList.remove("active")
        }
        const faqContainer = dropdown.closest(".faq-container")
        if (this.faqMemoization === faqContainer) {
            faqContainer.classList.remove("active")
            this.faqMemoization = undefined
        } else {
            faqContainer.classList.add("active")
            this.faqMemoization = faqContainer
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
