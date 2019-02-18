class Dep {
    constructor () {
        this.deps = []
    }
    getTarget () {
        if (Dep.Target && this.deps.indexOf(Dep.Target) === -1) {
            this.deps.push(Dep.Target)
        }
    }
    notify () {
        this.deps.forEach((dep) => {
            dep()
        })
    }
}

Dep.Target = null

class observable {
    constructor (obj) {
        Object.keys(obj).forEach(key => {
            const dep = new Dep()
            // this.defineReactive(obj, key, obj[key])
            let val = obj[key]
            Object.defineProperty(obj, key, {
                get () {
                    dep.getTarget()
                    return val
                },
                set (newVal) {
                    val = newVal
                    dep.notify()
                }
            })
        })
        return obj
    }
    defineReactive (obj, key, val) {
        const dep = new Dep()
        Object.defineProperty(obj, key, {
          get () {
            dep.getTarget()
            return val
          },
          set (newVal) {
            val = newVal
            dep.notify()
          }
        })
      }
}

class watcher {
    constructor (obj, type, cb, update) {
        this.obj = obj
        this.type = type
        this.cb = cb
        this.update = update
        this.defineProperty()
        obj[type]
    }
    defineProperty () {
        const self = this
        const updateCb = () => {
            const val = this.cb()
            this.update(val)
        }
        Object.defineProperty(self.obj, self.type, {
            get () {
                Dep.Target = updateCb
                const val = self.cb()
                Dep.Target = null
                return val
            },
            set () {
                console.error('aaa')
            }
        })
    }
}

const hero = new observable({
    health: 3000,
    IQ: 150
})

new watcher(hero, 'type', () => {
    return hero.health > 4000 ? '坦克' : '脆皮'
}, (val) => {
    console.log(`我的类型是：${val}`)
})

// console.log(`英雄初始类型：${hero.type}`)
// hero.health
hero.health = 5000
hero.health = 3000