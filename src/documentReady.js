/**
 * ES6 Document ready with Promise
 * @module DocumentReady
 * @returns {Promise}
 * @example
 * import documentReady from '../src/DocumentReady.js'
 *
 * Document.prototype.ready = documentReady
 *
 * document.ready().then(() => {
 *     // 主程式進入點
 * })
 */
export default function documentReady () {
    return new Promise((resolve, reject) => {
        if (document.readyState === 'complete') {
            resolve(document);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                resolve(document);
            });
        }
    });
}
