import JSToolkit from '../src/main.js'

const LC = {}
LC.Toolkit = JSToolkit
window.LC = window.LC || LC

document.addEventListener("DOMContentLoaded", async () => {
    await LC.Toolkit.waitForDom("#target")
    console.log('GOT!')
});
