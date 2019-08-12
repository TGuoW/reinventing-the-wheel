const FakeModel = {
    install: function (Vue) {
        Vue.directives('fakemodel', {
            bind (el, binding, vnode) {
                const self = vnode.context
                const { expression } = binding
                const { componentInstance } = vnode
                const target = binding.value.path || expression
                const setterValue = new Function('that', 'value', `that.${target}=value`)
                const getterValue = new Function('that', `return that.${target}`)

                const { event: eventName = 'input', prop: propName = 'value' } = componentInstance.$options.model || {}
                let v

                el.addEventListener('click', function () {
                    self.$nextTick(() => {
                    if (self.ruleForm.resource === v) {
                        self.$nextTick(() => {
                        setterValue(self, '')
                        })
                    }
                    v = getterValue(self)
                    })
                })
                const fns = (val) => {
                    setterValue(self, val)
                    const setter = Object.getOwnPropertyDescriptor(componentInstance._props, propName).set
                    Object.defineProperty(componentInstance._props, propName, {
                    enumerable: true,
                    configurable: true,
                    get: () => {
                        return getterValue(self)
                    },
                    set: () => {
                    }
                    })
                    componentInstance._props.value = getterValue(self)
                    componentInstance._watchers.forEach(item => {
                    item.update()
                    })
                    componentInstance.$children.forEach(item => {
                    item._watchers.forEach(ele => {
                        ele.update()
                    })
                    })
                    Object.defineProperty(componentInstance._props, propName, {
                    enumerable: true,
                    configurable: true,
                    get: () => {
                        return getterValue(self)
                    },
                    set: setter
                    })
                }
                fns()

                if (!componentInstance._events[eventName]) {
                    componentInstance._events.input = []
                }

                componentInstance._events[eventName].push(fns)

            }
        })
    }
}