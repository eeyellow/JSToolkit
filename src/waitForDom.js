/**
 * 等待DOM變化
 * @param {String} selector 目標DOM的CssSelectors
 * @param {String=} parentSelector 目標DOM的父節點的CssSelectors
 * @returns {Promise}
 */
export default function waitForDomExist (selector, parentSelector) {
    return new Promise((resolve) => {
        if (document.querySelectorAll(selector).length > 0) {
            return resolve(document.querySelectorAll(selector))
        }

        const observer = new MutationObserver((mutations, owner) => {
            if (document.querySelectorAll(selector).length > 0) {
                resolve(document.querySelectorAll(selector))
                observer.disconnect()
            }
        });

        const parent = parentSelector
            ? document.querySelector(parentSelector)
            : document.body
        observer.observe(parent, {
            childList: true,
            subtree: true
        })
    })
}
