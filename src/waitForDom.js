/**
 * 等待目標DOM存在
 * @module WaitForDom
 * @param {String} selector 目標DOM的CssSelectors
 * @param {String=} parentSelector 目標DOM的父節點的CssSelectors
 * @returns {Promise}
 * @example
 * import waitForDom from '../src/WaitForDom.js'
 *
 * waitForDom("#target").then(() => {
 *     console.log('DOM已存在')
 * })
 *
 * // 模擬延遲載入的DOM
 * setTimeout(() => {
 *     const div = document.createElement('div');
 *     div.id = 'target';
 *     document.body.appendChild(div);
 * }, 2000)
 */
export default function waitForDom (selector, parentSelector) {
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
