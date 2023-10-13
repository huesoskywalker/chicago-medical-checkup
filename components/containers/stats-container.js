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
        const mainContainer = this.shadowRoot.getElementById("innerContainer")

        const fragment = new DocumentFragment()

        this.statsData.forEach((stat) => {
            const itemContainer = document.createElement("div")
            itemContainer.classList.add("inner-1__item")

            const logoImg = document.createElement("img")
            logoImg.src = stat.logo.src
            logoImg.alt = stat.logo.alt
            logoImg.loading = "lazy"
            logoImg.classList.add("item__logo")
            itemContainer.appendChild(logoImg)

            const statsContainer = document.createElement("div")
            statsContainer.classList.add("item__stats-container")

            const value = document.createElement("div")
            value.classList.add("stats-container__value")
            value.textContent = stat.value
            statsContainer.appendChild(value)

            const symbol = document.createElement("div")
            symbol.classList.add("stats-container__symbol")
            symbol.textContent = stat.symbol
            statsContainer.appendChild(symbol)

            const descriptionContainer = document.createElement("div")
            descriptionContainer.classList.add("item__description")
            descriptionContainer.textContent = stat.description

            itemContainer.appendChild(statsContainer)
            itemContainer.appendChild(descriptionContainer)

            fragment.appendChild(itemContainer)
        })
        mainContainer.appendChild(fragment)
    }
    async connectedCallback() {
        await this.loadContent()
        this.renderStats()
    }
}

customElements.define("stats-container", StatsContainer)
