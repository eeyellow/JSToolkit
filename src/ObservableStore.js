const ObservableStore = (() => {
    let privateProps;
    return class ObservableStoreClass {
        /** 建構式 */
        constructor (store) {
            const o = this;
            privateProps = new Map();

            privateProps.set('store', store);

            /** 代理Store */
            privateProps.set('storeProxy', new Proxy(store, {
                set (target, key, value, receiver) {
                    const result = o.ReflectNestedSet(target, key.split('.'), value)
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
        }

        /**
         * 取得Proxy Store
         * @returns Proxy
         */
        GetInstance () {
            return privateProps.get('storeProxy')
        }

        GetObserver () {
            return privateProps.get('observerQueue')
        }

        /**
         * 綁定
         */
        Binding () {
            document.querySelectorAll(`[data-bind]`).forEach((e) => {
                const key = e.dataset.bind
                const setting = {
                    key,
                    element: e,
                }
                this.AddObserve(setting)

                const domEventDict = privateProps.get('domEvent')[e.nodeName]
                if (domEventDict) {
                    e.addEventListener(domEventDict.EventType, domEventDict.Callback.bind(null, key))
                }
            })
        }

        /**
         * 加入觀察者
         * @param {*} observeSetting
         */
        AddObserve (observeSetting) {
            privateProps.get('observerQueue').add(observeSetting)
        }

        /**
         * 使用Reflect設置目標物件的值
         * @param {object} target
         * @param {string} keys
         * @param {*} value
         * @returns
         */
        ReflectNestedSet (target, keys, value) {
            if (keys.length === 1) {
                Reflect.set(target, keys, value)
                return
            }
            return this.ReflectNestedSet(target[keys[0]], keys.slice(1), value)
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
                        valueClone = this.FindNestedValueByProperty(privateProps.get('store'), key)
                    }
                    if (valueClone) {
                        observe.element.value = valueClone
                    }
                })
            })
        }

        /**
         * 找出目標屬性值，支援深層物件
         * @param {*} target
         * @param {*} prop
         * @returns
         */
        FindNestedValueByProperty (target, prop) {
            let result
            const keys = Object.keys(target)
            for (let i = 0; i < keys.length; i++) {
                if (typeof target[keys[i]] === 'object' && prop.split('.')[0] == keys[i]) {
                    return this.FindNestedValueByProperty(target[keys[i]], prop.split('.').slice(1).join('.'))
                }
                if (keys[i] === prop) {
                    result = target[keys[i]]
                    break
                }
            }

            return result
        }
    }
})();

export default ObservableStore
