const statsData = [
    {
        logo: {
            src: "/assets/briefcase.svg",
            alt: "Briefcase Logo",
        },
        value: "10",
        symbol: "+",
        description: "years in business",
    },
    {
        logo: {
            src: "/assets/smile.svg",
            alt: "Smiley face Logo",
        },
        value: "2.000",
        symbol: "+",
        description: "positive reviews",
    },
    {
        logo: {
            src: "/assets/message-circle.svg",
            alt: "Message Logo",
        },
        value: "15.000",
        symbol: "+",
        description: "satisfied clients",
    },
    {
        logo: {
            src: "/assets/activity.svg",
            alt: "Activity Logo",
        },
        value: "Many",
        symbol: "+",
        description: "nurses and physician assistants on staff",
    },
]
class StatsContainer extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.statsData = statsData
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/containers/stats-container.html").then((response) =>
                response.text()
            ),
            fetch("/styles/containers/stats-container.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }
    renderStats() {
        const mainContainer = this.shadowRoot.querySelector(".inner-1")
        this.statsData.forEach((stat) => {
            const itemContainer = document.createElement("div")
            itemContainer.classList.add("inner-1-item-container")

            const logoContainer = document.createElement("div")
            logoContainer.classList.add("inner-1-logo-container")

            const logoImg = document.createElement("img")
            logoImg.src = stat.logo.src
            logoImg.alt = stat.logo.alt
            logoImg.loading = "lazy"
            logoContainer.appendChild(logoImg)

            const valueContainer = document.createElement("div")
            valueContainer.classList.add("inner-1-value-container")

            const value = document.createElement("div")
            value.classList.add("inner-1-value")
            value.textContent = stat.value
            valueContainer.appendChild(value)

            const symbol = document.createElement("div")
            symbol.classList.add("inner-1-value", "symbol")
            symbol.textContent = stat.symbol
            valueContainer.appendChild(symbol)

            const descriptionContainer = document.createElement("div")
            descriptionContainer.classList.add("inner-1-description")
            descriptionContainer.textContent = stat.description

            itemContainer.appendChild(logoContainer)
            itemContainer.appendChild(valueContainer)
            itemContainer.appendChild(descriptionContainer)

            mainContainer.appendChild(itemContainer)
        })
    }
    async connectedCallback() {
        await this.loadContent()
        this.renderStats()
    }
}

customElements.define("stats-container", StatsContainer)
