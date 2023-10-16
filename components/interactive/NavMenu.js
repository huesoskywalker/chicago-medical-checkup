import { menuData } from "../../constants/interactive/menu-data.js"
import { ContentLoader } from "../../util/ContentLoader.js"
import { ContentLoaderInjector } from "../../util/ContentLoaderInjector.js"
export class NavMenu extends HTMLElement {
    /**
     * @param {ContentLoader} contentLoader
     */
    constructor(contentLoader) {
        super()
        this.attachShadow({ mode: "open" })
        this.contentLoader = contentLoader
        this.menuData = menuData
        this.scrollHandler = this.initScroll.bind(this)
        this.isNavBarScrolled = false
        this.toggleMenuHandler = this.toggleMenu.bind(this)
        this.buttonClass
        this.menuCheckbox
        this.navBar
        this.itemsTitle
        this.menuLines
        this.isColorChanged = false
    }

    async loadContent() {
        const templatePath = "/templates/interactive/nav-menu.html"
        const stylePath = "/styles/interactive/nav-menu.css"
        const nonce = "nav-menu"
        const { template, style } = await this.contentLoader.loadContent(
            templatePath,
            stylePath,
            nonce
        )
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.shadowRoot.appendChild(style)
    }
    populateMenu() {
        this.navBar = this.shadowRoot.getElementById("navBar")

        const navUl = document.createElement("ul")
        navUl.id = "navUl"
        navUl.classList.add("nav-ul")

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
        navUl.appendChild(fragment)
        this.navBar.appendChild(navUl)
    }
    initScroll() {
        const TABLET_WIDTH = 768
        const INFO_CONTAINER_THRESHOLD = 730
        const STATS_CONTAINER_THRESHOLD = 1300

        const innerWidth = window.innerWidth
        const isLargeDisplay = innerWidth > TABLET_WIDTH

        const scrollY = window.scrollY

        const isAtStatsContainer =
            scrollY > INFO_CONTAINER_THRESHOLD && scrollY <= STATS_CONTAINER_THRESHOLD

        if (isLargeDisplay) {
            if (scrollY > 100 && !this.isNavBarScrolled) {
                this.navBar.classList.add("scrolled")
                this.isNavBarScrolled = true
            } else if (scrollY === 0 && this.isNavBarScrolled) {
                this.navBar.classList.remove("scrolled")
                this.isNavBarScrolled = false
            } else {
                if (isAtStatsContainer && !this.isColorChanged) {
                    this.itemsTitle.forEach((title) => {
                        title.classList.add("title__color-change")
                    })
                    this.isColorChanged = true
                } else if (!isAtStatsContainer && this.isColorChanged) {
                    this.itemsTitle.forEach((title) => {
                        title.classList.remove("title__color-change")
                    })
                    this.isColorChanged = false
                }
            }
        } else {
            if (this.isNavBarScrolled) {
                this.navBar.classList.remove("scrolled")
                this.isNavBarScrolled = false
            }
            const isAtInfoContainer = scrollY <= INFO_CONTAINER_THRESHOLD
            const isAtFaqsContainer = scrollY > STATS_CONTAINER_THRESHOLD

            const STATS_CONTAINER_CLASS = "stats-color-change"
            const FAQS_CONTAINER_CLASS = "faqs-color-change"

            const haveStatsContainerClass = this.buttonClass === STATS_CONTAINER_CLASS
            const haveFaqsContainerClass = this.buttonClass === FAQS_CONTAINER_CLASS

            if (isAtInfoContainer) {
                this.menuLines.classList.remove(STATS_CONTAINER_CLASS, FAQS_CONTAINER_CLASS)
                this.buttonClass = undefined
            } else if (isAtStatsContainer && !haveStatsContainerClass) {
                if (haveFaqsContainerClass) {
                    this.menuLines.classList.remove(FAQS_CONTAINER_CLASS)
                }
                menuLines.classList.add(STATS_CONTAINER_CLASS)
                this.buttonClass = STATS_CONTAINER_CLASS
            } else if (isAtFaqsContainer && !haveFaqsContainerClass) {
                if (haveStatsContainerClass) {
                    this.menuLines.classList.remove(STATS_CONTAINER_CLASS)
                }
                this.menuLines.classList.add(FAQS_CONTAINER_CLASS)
                this.buttonClass = FAQS_CONTAINER_CLASS
            }
        }
    }
    toggleMenu() {
        this.navBar.classList.toggle("active")
        const navUl = this.navBar.querySelector("#navUl")
        navUl.classList.toggle("active")
    }
    async connectedCallback() {
        await this.loadContent()
        this.populateMenu()

        this.itemsTitle = this.navBar.querySelectorAll(".nav-li__title")
        this.menuLines = this.shadowRoot.getElementById("menuLines")
        window.addEventListener("scroll", () => this.scrollHandler())

        this.menuCheckbox = this.shadowRoot.getElementById("menuCheckbox")
        this.menuCheckbox.addEventListener("click", () => this.toggleMenuHandler())
    }
    disconnectedCallback() {
        window.removeEventListener("scroll", () => this.scrollHandler())
        this.menuCheckbox.removeEventListener("click", this.toggleMenuHandler())
    }
}

const contentLoaderInstance = ContentLoaderInjector.getInstance()

customElements.define(
    "nav-menu",
    class extends NavMenu {
        constructor() {
            super(contentLoaderInstance)
        }
    }
)
