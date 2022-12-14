import documentReady from './DocumentReady.js'
import waitForDom from './WaitForDom.js'

import ObservableStore from './ObservableStore.js'

Document.prototype.ready = documentReady

export default {
    waitForDom,
    ObservableStore
}
