/**
 * 簡易資料綁定
 * @module ObservableStore
 * @example
 * ## html
 * <input data-bind="Username" />
 * <input data-bind="Info.Email" />
 * @example
 * ## javascript
 * import ObservableStore from '../src/ObservableStore.js'
 *
 * const LC = {}
 * LC.Store = LC.Store || {
 *     Username: '你的名字',
 *     Password: '1234',
 *     Info: {
 *         Tel: 3345678,
 *         Email: 'test@linkchain.tw',
 *         City: 'Kaohsiung',
 *         Address: '10樓'
 *     },
 * }
 * window.LC = window.LC || LC;
 *
 * LC.ObservableStore = new ObservableStore(LC.Store)
 * LC.ObservableStore.Binding()
 */
const ObservableStore = (() => {
    let privateProps;
    let privateMethods;
    return class ObservableStoreClass {
        /** 建構式 */
        constructor (store) {
            const o = this;

            privateProps = new Map();
            privateMethods = new Map();

            privateProps.set('store', store);

            /** 代理Store */
            privateProps.set('storeProxy', new Proxy(store, {
                set (target, key, value, receiver) {
                    const result = privateMethods.get('ReflectNestedSet')(target, key.split('.'), value)
                    o.NotifyObserve([key], value)
                    return result
                }
            }));

            /** 觀察者 */
            privateProps.set('observerQueue', new Set());

            /**
             * 定義事件類型與回調（策略模式）
             */
            privateProps.set('domEvent', {
                INPUT: {
                    EventType: 'input',
                    Callback (key, event) {
                        Reflect.set(o.GetInstance(), key, event.currentTarget.value)
                    }
                },
                TEXTAREA: {
                    EventType: 'input',
                    Callback (key, event) {
                        Reflect.set(o.GetInstance(), key, event.currentTarget.value)
                    }
                },
                SELECT: {
                    EventType: 'change',
                    Callback (key, event) {
                        Reflect.set(o.GetInstance(), key, event.currentTarget.value)
                    }
                },
            });

            /**
             * 加入觀察者
             * @param {*} observeSetting
             */
            privateMethods.set('AddObserve', (observeSetting) => {
                privateProps.get('observerQueue').add(observeSetting)
            })

            /**
             * 使用Reflect設置目標物件的值
             * @param {object} target
             * @param {string} keys
             * @param {*} value
             * @returns
             */
            privateMethods.set('ReflectNestedSet', (target, keys, value) => {
                if (keys.length === 1) {
                    Reflect.set(target, keys, value)
                    return
                }
                return privateMethods.get('ReflectNestedSet')(target[keys[0]], keys.slice(1), value)
            })

            /**
             * 找出目標屬性值，支援深層物件
             * @param {*} target
             * @param {*} prop
             * @returns
             */
            privateMethods.set('FindNestedValueByProperty', (target, prop) => {
                let result
                const keys = Object.keys(target)
                for (let i = 0; i < keys.length; i++) {
                    if (typeof target[keys[i]] === 'object' && prop.split('.')[0] == keys[i]) {
                        return privateMethods.get('FindNestedValueByProperty')(target[keys[i]], prop.split('.').slice(1).join('.'))
                    }
                    if (keys[i] === prop) {
                        result = target[keys[i]]
                        break
                    }
                }

                return result
            })
        }

        /**
         * 取得Proxy Store
         * @returns {Proxy}
         */
        GetInstance () {
            return privateProps.get('storeProxy')
        }

        /**
         * 取得觀察者清單
         * @returns {Set}
         */
        GetObserver () {
            return privateProps.get('observerQueue')
        }

        /**
         * 綁定
         */
        Binding () {
            document.querySelectorAll(`[data-bind]`).forEach((e) => {
                const key = e.dataset.bind
                const bindType = e.dataset.bindtype || 'TwoWay'

                const setting = {
                    key,
                    element: e,
                }
                privateMethods.get('AddObserve')(setting)

                if (bindType === 'TwoWay') {
                    const domEventDict = privateProps.get('domEvent')[e.nodeName]
                    if (domEventDict) {
                        e.addEventListener(domEventDict.EventType, domEventDict.Callback.bind(null, key))
                    }
                }
            })

            this.NotifyObserve()
        }

        /**
         * 發送通知給觀察者
         * @param {*} keys
         * @param {*} value
         */
        NotifyObserve (keys, value) {
            let ObserveArr = Array.from(privateProps.get('observerQueue'))
            if (keys) {
                ObserveArr = ObserveArr.filter((a) => keys.includes(a.key))
            } else {
                keys = ObserveArr.map((a) => a.key)
            }

            keys.forEach((key) => {
                ObserveArr.filter((a) => a.key === key).forEach((observe) => {
                    let valueClone = (` ${value || ''}`).slice(1);
                    if (valueClone === '') {
                        valueClone = privateMethods.get('FindNestedValueByProperty')(privateProps.get('store'), key)
                    }
                    if (valueClone) {
                        observe.element.value = valueClone
                    }
                })
            })
        }
    }
})();

export default ObservableStore
