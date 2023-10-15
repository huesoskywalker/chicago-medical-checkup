import { countdownData } from "../../constants/interactive/countdown-data.js"
class CountDown extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.countdownData = countdownData
        this.endDate = "November 23, 2023, 23:59:59"
        this.countdownInterval
        this.itemValue = {}
    }

    async loadContent() {
        await Promise.all([
            fetch("/templates/interactive/count-down.html").then((response) => response.text()),
            fetch("/styles/interactive/count-down.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }
    renderCountdown() {
        const itemsContainer = this.shadowRoot.getElementById("itemsContainer")

        const fragment = new DocumentFragment()
        Object.keys(this.countdownData).forEach((key) => {
            const item = document.createElement("div")
            item.classList.add("items-container__item")

            const itemTitle = document.createElement("div")
            itemTitle.classList.add("item-title")
            itemTitle.textContent = key.toUpperCase()
            item.appendChild(itemTitle)

            this.itemValue[key] = document.createElement("div")
            this.itemValue[key].classList.add("item-value")
            this.itemValue[key].textContent = this.countdownData[key]
            item.appendChild(this.itemValue[key])

            fragment.appendChild(item)
        })
        itemsContainer.appendChild(fragment)
    }
    initCountdown() {
        const endDate = new Date(this.endDate).getTime()
        const updateCountdown = () => {
            const now = new Date().getTime()
            const distance = endDate - now
            if (distance < 0) {
                clearInterval(this.countdownInterval)
                return
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            const formattedDays = days.toString().padStart(2, 0)
            const formattedHours = hours.toString().padStart(2, 0)
            const formattedMinutes = minutes.toString().padStart(2, 0)
            const formattedSeconds = seconds.toString().padStart(2, 0)

            this.updateDisplay(formattedDays, formattedHours, formattedMinutes, formattedSeconds)
        }

        updateCountdown()
        this.countdownInterval = setInterval(updateCountdown, 1000)
    }

    updateDisplay(days, hours, minutes, seconds) {
        if (this.countdownData.days !== days) {
            this.itemValue.days.textContent = days
            this.countdownData.days = days
        }
        if (this.countdownData.hours !== hours) {
            this.itemValue.hours.textContent = hours
            this.countdownData.hours = hours
        }
        if (this.countdownData.minutes !== minutes) {
            this.itemValue.minutes.textContent = minutes
            this.countdownData.minutes = minutes
        }
        this.itemValue.seconds.textContent = seconds
    }
    async connectedCallback() {
        await this.loadContent()
        this.renderCountdown()
        this.initCountdown()
    }
    disconnectedCallback() {
        clearInterval(this.countdownInterval)
    }
}
customElements.define("count-down", CountDown)
