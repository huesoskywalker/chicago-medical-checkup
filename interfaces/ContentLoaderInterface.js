/**
 * @interface
 */

export class ContentLoaderInterface {
    /**
     * @param {string} templatePath
     * @param {string} stylePath
     * @param {string} styleNonce
     * @returns {Promise<{template: HTMLTemplateElement, style: HTMLStyleElement}>}
     */

    static async loadContent(templatePath, stylePath, styleNonce) {}
}
