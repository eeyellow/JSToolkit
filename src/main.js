import documentReady from './documentReady.js'
import waitForDom from './waitForDom.js'

Document.prototype.ready = documentReady

export default {
    waitForDom
}
