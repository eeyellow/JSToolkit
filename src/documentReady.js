/**
 * ES6 Document ready with Promise
 * @returns Promise
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
