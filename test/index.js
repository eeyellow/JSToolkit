import JSToolkit from '../src/main.js'

const LC = {}
LC.Toolkit = JSToolkit
LC.Store = LC.Store || {
    Username: '賣靠北',
    Password: '1234',
    Info: {
        Tel: 3345678,
        Email: 'rayhuang@test.cc',
        City: 'Kaohsiung',
        Address: 'aaaa'
    },
}
window.LC = window.LC || LC;

document.ready().then(async () => {
    LC.ObservableStore = new LC.Toolkit.ObservableStore(LC.Store)
    LC.ObservableStore.Binding()
    LC.ObservableStore.NotifyObserve()
})
