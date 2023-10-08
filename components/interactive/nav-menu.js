export const menuData = [
    {
        title: "About Us",
        link: "aboutus.html",
    },
    {
        title: "Book Online",
        link: "book.html",
    },
    {
        title: "Weight Loss Programs",
        link: "programs.html",
    },
    {
        title: "Real Patient Stories",
        link: "stories.html",
    },
    {
        title: "Location",
        link: "locations.html",
    },
    {
        title: "Blogs",
        link: "blogs.html",
    },
    {
        title: "Shop",
        link: "shop.html",
    },
    {
        title: "Subscriptions",
        link: "subscriptions.html",
    },
]

class NavMenu extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: "open" })
        this.initScrollHandler = this.initScroll.bind(this)
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/nav-menu.html").then((response) => response.text()),
            fetch("/styles/interactive/nav-menu.css").then((response) => response.text()),
        ]).then(([html, css]) => {
            const template = document.createElement("template")
            template.innerHTML = html
            this.shadowRoot.appendChild(template.content.cloneNode(true))

            const style = document.createElement("style")
            style.textContent = css
            this.shadowRoot.appendChild(style)
        })
    }
    populateMenu() {
        const ul = this.shadowRoot.querySelector(".nav-ul")
        menuData.forEach((item) => {
            const li = document.createElement("li")
            li.classList.add("nav-li__item")
            const anchor = document.createElement("a")
            anchor.classList.add("nav-li__anchor")
            anchor.href = item.link
            const span = document.createElement("span")
            span.classList.add("nav-li__title")
            span.textContent = item.title

            anchor.appendChild(span)
            li.appendChild(anchor)
            ul.appendChild(li)
        })
    }
    initScroll() {
        const navBar = this.shadowRoot.querySelector(".nav-bar")

        window.addEventListener("scroll", function () {
            if (window.scrollY > 100) {
                navBar.classList.add("scrolled")
            } else {
                navBar.classList.remove("scrolled")
            }
        })
    }

    async connectedCallback() {
        await this.loadContent()
        this.populateMenu()
        this.shadowRoot.addEventListener("DOMContentLoaded", this.initScrollHandler())
    }
    disconnectedCallback() {
        this.shadowRoot.removeEventListener("DOMContentLoaded", this.initScrollHandler())
    }
}
customElements.define("nav-menu", NavMenu)
