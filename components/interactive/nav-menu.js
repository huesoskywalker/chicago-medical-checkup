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
        this.isNavBarScrolled = false
        this.toggleMenuHandler = this.toggleMenu.bind(this)
        this.buttonClass = undefined
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
        const navBar = this.shadowRoot.getElementById("navBar")

        const navMenu = document.createElement("ul")
        navMenu.classList.add("nav-ul")

        const fragment = new DocumentFragment()

        this.menuData.forEach((item) => {
            const listItem = document.createElement("li")
            listItem.classList.add("nav-li__item")

            const itemLink = document.createElement("a")
            itemLink.classList.add("nav-li__link")
            itemLink.href = item.link
            listItem.appendChild(itemLink)

            const itemTitle = document.createElement("span")
            itemTitle.classList.add("nav-li__title")
            itemTitle.textContent = item.title
            itemLink.appendChild(itemTitle)

            fragment.appendChild(listItem)
        })
        navMenu.appendChild(fragment)
        navBar.appendChild(navMenu)
    }
    initScroll() {
        const TABLET_WIDTH = 768
        const INFO_CONTAINER_THRESHOLD = 730
        const STATS_CONTAINER_THRESHOLD = 1300
        const STATS_CONTAINER_CLASS = "stats-color-change"
        const FAQS_CONTAINER_CLASS = "faqs-color-change"

        const innerWidth = window.innerWidth
        const isLargeDisplay = innerWidth > TABLET_WIDTH

        const scrollY = window.scrollY
        const isAtInfoContainer = scrollY <= INFO_CONTAINER_THRESHOLD
        const isAtStatsContainer =
            scrollY > INFO_CONTAINER_THRESHOLD && scrollY <= STATS_CONTAINER_THRESHOLD
        const isAtFaqsContainer = scrollY > STATS_CONTAINER_THRESHOLD

        const haveStatsContainerClass = this.buttonClass === STATS_CONTAINER_CLASS
        const haveFaqsContainerClass = this.buttonClass === FAQS_CONTAINER_CLASS

        const navBar = this.shadowRoot.querySelector(".nav-bar")

        if (isLargeDisplay) {
            if (scrollY > 100 && !this.isNavBarScrolled) {
                navBar.classList.add("scrolled")
                this.isNavBarScrolled = true
            } else if (scrollY === 0) {
                navBar.classList.remove("scrolled")
                this.isNavBarScrolled = false
            } else {
                return
            }
        } else {
            if (this.isNavBarScrolled) {
                navBar.classList.remove("scrolled")
                this.isNavBarScrolled = false
            }
            const menuLines = this.shadowRoot.getElementById("menuLines")
            if (isAtInfoContainer) {
                menuLines.classList.remove(STATS_CONTAINER_CLASS, FAQS_CONTAINER_CLASS)
                this.buttonClass = undefined
            } else if (isAtStatsContainer && !haveStatsContainerClass) {
                if (haveFaqsContainerClass) {
                    menuLines.classList.remove(FAQS_CONTAINER_CLASS)
                }
                menuLines.classList.add(STATS_CONTAINER_CLASS)
                this.buttonClass = STATS_CONTAINER_CLASS
            } else if (isAtFaqsContainer && !haveFaqsContainerClass) {
                if (haveStatsContainerClass) {
                    menuLines.classList.remove(STATS_CONTAINER_CLASS)
                }
                menuLines.classList.add(FAQS_CONTAINER_CLASS)
                this.buttonClass = FAQS_CONTAINER_CLASS
            } else {
                return
            }
        }
    }
    toggleMenu() {
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
        burgerMenu.addEventListener("click", () => this.toggleMenuHandler())
    }
    disconnectedCallback() {
        this.shadowRoot.removeEventListener("scroll", () => this.scrollHandler())
        this.shadowRoot.removeEventListener("click", this.toggleMenuHandler())
    }
}
customElements.define("nav-menu", NavMenu)
