class CountDown extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.countdownInterval
    }

    async loadContent() {
        await Promise.all([
            fetch("/templates/count-down.html").then((response) => response.text()),
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

    initCountdown() {
        const endDate = new Date("October 31, 2023, 23:59:59").getTime()
        const updateCountdown = () => {
            const now = new Date().getTime()
            const distance = endDate - now

            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)

            const formattedDays = days.toString().padStart(2, 0)
            const formattedHours = hours.toString().padStart(2, 0)
            const formattedMinutes = minutes.toString().padStart(2, 0)
            const formattedSeconds = seconds.toString().padStart(2, 0)

            this.updateDisplay(formattedDays, formattedHours, formattedMinutes, formattedSeconds)

            if (distance < 0) {
                clearInterval(this.countdownInterval)
                this.updateDisplay("00", "00", "00", "00")
                return
            }
        }

        updateCountdown()
        this.countdownInterval = setInterval(updateCountdown, 1000)
    }

    updateDisplay(days, hours, minutes, seconds) {
        let lastDays
        let lastHours
        let lastMinutes
        if (days !== lastDays) {
            this.shadowRoot.getElementById("days").textContent = days
            lastDays = days
        }
        if (hours !== lastHours) {
            this.shadowRoot.getElementById("hours").textContent = hours
            lastHours = hours
        }
        if (minutes !== lastMinutes) {
            this.shadowRoot.getElementById("minutes").textContent = minutes
            lastMinutes = minutes
        }
        this.shadowRoot.getElementById("seconds").textContent = seconds
    }
    async connectedCallback() {
        await this.loadContent()
        this.initCountdown()
    }
}
customElements.define("count-down", CountDown)
