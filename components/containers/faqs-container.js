const faqsData = [
    {
        question: "Why is it free?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim dolor eveniet cum ratione est at.",
    },
    {
        question: " Do I need this if I’ve had my yearly medical check? What is the difference? ",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident quae libero ipsum natus in. Distinctio vitae nihil quam laudantium facilis.",
    },
    {
        question: " Can I bring another person to the appointment?",
        answer: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum iste culpa tenetur necessitatibus.",
    },
    {
        question: " How long does it take?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, quos?",
    },
    {
        question: " What if I have to cancel or if I’m not sure I’ll be able to make it?",
        answer: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex autem commodi debitis numquam! Corporis molestias magnam asperiores ad quas.",
    },
    {
        question: " Do I need to bring anything with me?",
        answer: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis in non quam, corrupti dolorum veritatis iure delectus odio consequuntur eius sed debitis.",
    },
    {
        question: " What if I don’t have insurance?",
        answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus molestiae vitae incidunt eligendi, obcaecati repellendus? Reprehenderit?",
    },
]

class FaqsContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.faqsData = faqsData
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
            imgElement.src = "/assets/faq-Vector.svg"
            imgElement.alt = "Faq Dropdown"
            imgElement.loading = "lazy"

            const answerElement = document.createElement("div")
            answerElement.classList.add("faq-answer")
            answerElement.textContent = faqEntry.answer

            buttonElement.appendChild(imgElement)
            buttonElement.appendChild(answerElement)

            faqElement.appendChild(questionElement)
            faqElement.appendChild(buttonElement)

            faqContainer.appendChild(faqElement)
        })
    }
    async connectedCallback() {
        await this.loadContent()
        this.renderFAQS()
    }
}
customElements.define("faqs-container", FaqsContainer)
