/* 
 loading: 用于加载图片
 @images: 要加载的图片对象 必填参数
 @progress: 进度的回调      可选
 @complete: 完成的回调  可选
 */
function loading(obj) {

    // 用于存放加载完成的图片
    var loadedObj = {}
    // 用于存储已经加载完成的图片数量
    var loadedNum = 0
    var len = 0
    for (var i in obj.images) {
        len++
    }

    for (var i in obj.images) {
        var imgObj = new Image()
        imgObj.src = obj.images[i]
        imgObj.key = i
        imgObj.onload = function () {
            loadedObj[this.key] = this
            loadedNum++
            // 每次加载一张图片都会调用
            if (obj.progress) {
                obj.progress(parseInt((loadedNum / len).toFixed(2) * 100) + "%")
            }
            if (loadedNum >= len) {
                if (obj.complete) {
                    obj.complete(loadedObj)
                }
            }
        }
    }
}