import JSToolkit from '../src/main.js'

const LC = {}
LC.Toolkit = JSToolkit
window.LC = window.LC || LC;

document.ready().then(async () => {
    prepareWait()

    setTimeout(() => {
        const div = document.createElement('div');
        div.id = 'target';
        document.body.appendChild(div);
    }, 2000)
})

function prepareWait () {
    LC.Toolkit.waitForDom("#target").then(() => {
        console.log('GOT!')
    })
}

// document.addEventListener("DOMContentLoaded", async () => {
//     await LC.Toolkit.waitForDom("#target")
//     console.log('GOT!')
// });
