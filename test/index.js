import ObservableStore from '../src/ObservableStore.js'

const LC = {}
LC.Store = LC.Store || {
    Username: '你的名字',
    Password: '1234',
    Info: {
        Tel: 3345678,
        Email: 'test@linkchain.tw',
        City: 'Kaohsiung',
        Address: '10樓'
    },
}
window.LC = window.LC || LC;
LC.ObservableStore = new ObservableStore(LC.Store)
LC.ObservableStore.Binding()
