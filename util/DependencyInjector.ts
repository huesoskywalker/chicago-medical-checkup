import { NavMenu } from "../components/interactive/NavMenu.js"
import { ContentLoader } from "./ContentLoader.js"

export class DependencyInjector extends NavMenu {
    constructor() {
        super("adfasdf")
        this.contentLoader = new ContentLoader()
    }

    getContentLoader() {
        return this.contentLoader
    }
}
