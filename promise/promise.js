function Promise (fun) {
  var promise = this
  promise._resolves = []
  promise._rejects = []
  promise._status = 'PENDING'

  if (typeof fun !== 'function') {
    throw new TypeError('typeError')
  }

  promise.then = function (onFulfilled) {
    if (promise._status === 'PENDING') {
      promise._resolves.push(onFulfilled)
    } else {
      onFulfilled(value)
    }
    return this
  }

  function resolve(value) {
    setTimeout(function() {
      promise._status = 'FULFILLED'
      promise._resolves.forEach(function (callback) {
        callback(value)
      })
    },0)
  }

  fun(resolve)
}


var getData300 = function(){
  return new Promise(function(resolve,reject){
    resolve('reject')
    setTimeout(function(){
      console.log(500)
    },2000)
  })
}
getData300().then(function(data){
  setTimeout(function(){
    console.log(5000)
  },0)
})