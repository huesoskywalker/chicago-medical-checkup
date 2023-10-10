const menuData = [
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
        this.menuData = menuData
        this.scrollHandler = this.initScroll.bind(this)
        this.toggleMenuHandler = this.toggleMenu.bind(this)
    }
    async loadContent() {
        await Promise.all([
            fetch("/templates/interactive/nav-menu.html").then((response) => response.text()),
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
        this.menuData.forEach((item) => {
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

        if (window.innerWidth > 768 && window.scrollY > 100) {
            navBar.classList.add("scrolled")
        } else {
            navBar.classList.remove("scrolled")
        }
    }
    toggleMenu(burgerMenu) {
        burgerMenu.classList.toggle("active")
        const navMenu = this.shadowRoot.querySelector(".nav-bar")
        navMenu.classList.toggle("active")
        const navUl = this.shadowRoot.querySelector(".nav-ul")
        navUl.classList.toggle("active")
    }
    async connectedCallback() {
        await this.loadContent()
        this.populateMenu()

        window.addEventListener("scroll", () => this.scrollHandler())

        const burgerMenu = this.shadowRoot.querySelector(".menu-btn")
        burgerMenu.addEventListener("click", () => this.toggleMenuHandler(burgerMenu))
    }
    disconnectedCallback() {
        this.shadowRoot.removeEventListener("DOMContentLoaded", this.scrollHandler())
        this.shadowRoot.removeEventListener("click", this.toggleMenuHandler())
    }
}
customElements.define("nav-menu", NavMenu)
