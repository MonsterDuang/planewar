    // 随机函数
    function rand(min, max) {
        return parseInt(Math.random() * (max - min) + min) + 1
    }
    // 碰撞函数
    function rectCrash(obj1, obj2) {
        var l1 = obj1.iX
        var r1 = obj1.iX + obj1.w * scale
        var t1 = obj1.iY
        var b1 = obj1.iY + obj1.h * scale

        var l2 = obj2.iX
        var r2 = obj2.iX + obj2.w * scale
        var t2 = obj2.iY
        var b2 = obj2.iY + obj2.h * scale

        if (r1 > l2 && b1 > t2 && l1 < r2 && t1 < b2) {
            return true
        } else {
            return false
        }
    }
    var loadingImg = document.querySelector("#loadingImg")
    var start = document.querySelector("#start")
    var startWrap = document.querySelector("#start-wrap")
    var gameLogo = document.querySelector("#gameLogo")

    // 游戏结束标签
    var gameOver = document.querySelector('#gameOver')

    // 炸弹图标
    var bomb = document.querySelector('#bomb')
    var canvas = document.querySelector("#myCanvas")
    var context = canvas.getContext('2d')

    //again
    var again = document.querySelector("#again")
    again.addEventListener("touchstart", function () {
        window.location.reload()
    })

    //audio
    var enemy1 = document.querySelector("#enemy1")
    var enemy2 = document.querySelector("#enemy2")
    var enemy3 = document.querySelector("#enemy3")
    var enemy3out = document.querySelector("#enemy3out")
    var go = document.querySelector("#go")

    // 获取屏幕的大小
    var windowW = document.body.clientWidth
    var windowH = document.body.clientHeight

    canvas.width = windowW
    canvas.height = windowH

    // 求出当前屏幕的比例
    var scale = windowW / 320

    // 帧数
    var frame = 0

    // 用于控制创建的是双排子弹还是单排
    var bulletBol = true

    // 用于存放页面中所有的子弹对象
    var bullets = []
    // 用于存放页面所有的敌机对象
    var enemies = []
    // 用于存放所有的道具对象
    var props = []
    // 游戏结束
    var gameOverBol = false

    // loading预加载
    loading({
        images: {
            bg1: 'img/bg_01.jpg',
            bg2: 'img/bg_02.jpg',
            bg3: 'img/bg_03.jpg',
            bg4: 'img/bg_04.jpg',
            bg5: 'img/bg_05.jpg',
            bomb: 'img/bomb.png',
            bullet1: 'img/bullet1.png',
            bullet2: 'img/bullet2.png',
            enemy1: 'img/enemy1.png',
            enemy2: 'img/enemy2.png',
            enemy3: 'img/enemy3.png',
            heroFly: 'img/heroFly.png',
            prop: 'img/prop.png',
            over: './img/over.jpg'
        },
        // 监听进度的
        progress: function (num) {
            console.log(num)
        },
        complete: function (images) {
            init(images)
        }
    })


    function init(images) {
        loadingImg.style.display = "none"
        start.style.display = "block"
        var imgArr = [images.bg1, images.bg2, images.bg3, images.bg4, images.bg5]

        // 背景图片对象
        var bgObj = {
            img: imgArr[rand(0, 4)],
            iY: 0
        }
        bgObj.move = function () {
            this.iY += 2
            if (this.iY >= windowH) {
                this.iY = 0
            }
        }
        bgObj.draw = function () {
            this.move()
            context.drawImage(this.img, 0, this.iY, windowW, windowH);
            context.drawImage(this.img, 0, -windowH + this.iY, windowW, windowH);
        }
        // 玩家对象
        var heroFly = {
            img: images.heroFly,
            w: 66,
            h: 82,
            //  截取的位置（会变的）
            x: 0,
            y: 0,
            endX: 66,
            iX: windowW / 2 - 66 / 2,
            iY: windowH - 132,
            imgNum: 4,
            bombBol: false,
            //  双排子弹的有效时间
            propTime: 0,
            propEndTime: 300,
            //  玩家拥有炸弹的数量
            bombNum: 0,
            //  玩家出子弹的速度
            bulletSpeed: 6,
            //  人头的有效时间
            headPropBol: false,
            headPropTime: 0,
            headPropEndTime: 400,
            score: 0
        }
        //  玩家飞机移动
        heroFly.move = function (x, y) {
            this.iX = x
            this.iY = y
        }
        //  绘制玩家飞机方法
        heroFly.draw = function () {
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale);

            if (this.bombBol) {
                if (frame % 10 === 0) {
                    this.bomb()
                }
            }
        }
        //  切换截取玩家飞机图片的开始位置
        heroFly.switchX = function () {
            this.x += this.w
            if (this.x > this.endX) {
                this.x = 0
            }
        }
        //  玩家爆炸方法
        heroFly.bomb = function () {
            this.x += this.w
            if (this.x >= this.w * this.imgNum) {
                gameOver.style.display = 'flex'
                gameOverBol = true
                //输出结果
                result.innerHTML = `你打了 <b style="font-size: 72px;color: darkgoldenrod;">${heroFly.score}</b> 次飞机`
            }
        }

        //  子弹类
        function Bullet(x, y) {
            //  子弹图片对象
            this.img = bulletBol ? images.bullet1 : images.bullet2
            //  子弹的宽高
            this.w = this.img.width
            this.h = this.img.height
            //  子弹出现的位置
            this.iX = x + (heroFly.w * scale) / 2 - (this.w * scale) / 2
            this.iY = y + 10
            //  子弹的攻击力
            this.atk = bulletBol ? 1 : 2
        }

        //  子弹移动
        Bullet.prototype.move = function () {
            this.iY -= this.h
        }
        //  绘制子弹的方法
        Bullet.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.iX, this.iY, this.w * scale, this.h * scale);
        }

        //  敌机类
        function Enemy() {

            // 几率的随机值
            var r = rand(0, 100)
            if (r >= 0 && r < 85) {
                // 小飞机
                this.img = images.enemy1
                this.w = 38
                this.h = 34
                // 图片的数量
                this.imgNum = 5
                // 飞机的血量
                this.hp = 1
                // 飞机移动的速度
                this.speed = rand(3, 5)
            } else if (r >= 85 && r < 97) {
                // 中号飞机
                this.img = images.enemy2
                this.w = 46
                this.h = 64
                this.imgNum = 6
                this.hp = 5
                this.speed = rand(2, 3)
            } else {
                // 大飞机
                this.img = images.enemy3
                this.w = 110
                this.h = 164
                this.imgNum = 10
                this.hp = 10
                this.speed = rand(1, 2)
            }
            this.x = 0
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            // 是否要执行爆炸的方法
            this.bombBol = false
        }

        // 敌机移动的方法
        Enemy.prototype.move = function () {
            if (this.hp > 0) {
                this.iY += this.speed
            }
        }
        // 敌机绘制的方法
        Enemy.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
            // 判断现在是不是要执行爆炸动画
            if (this.bombBol) {
                if (frame % 5 === 0) {
                    return this.bomb()
                }
            }
        }
        // 敌机扣血的方法
        // atk: 子弹的攻击力
        Enemy.prototype.downHp = function (atk) {
            this.hp -= atk
            if (this.hp <= 0) {
                // 没血啦，要死啦
                // 爆炸
                this.bombBol = true
            }
        }
        // 敌机爆炸的方法
        Enemy.prototype.bomb = function () {
            this.x += this.w
            if (this.x >= this.w * (this.imgNum - 1)) {
                // 真死啦->从enemy数组里移除
                for (var i = 0; i < enemies.length; i++) {
                    if (this === enemies[i]) {
                        enemies.splice(i, 1)
                        //玩家加分
                        heroFly.score++
                        // 是向主动函数中通知我已经将该敌机对象移除了
                        return true
                    }
                }
            }
        }

        // 双排子弹类
        function BulletTwo() {

            this.img = images.prop
            this.w = 39
            this.h = 68
            this.x = 39
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            this.speed = rand(3, 6)
            // 道具id
            this.propId = 0
        }

        BulletTwo.prototype.move = function () {
            this.iY += this.speed
        }
        BulletTwo.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
        }
        // 炸弹
        function Bomb() {
            this.img = images.prop
            this.w = 39
            this.h = 68
            this.x = 0
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            this.speed = rand(3, 6)
            // 道具id
            this.propId = 1
        }

        Bomb.prototype.move = function () {
            this.iY += this.speed
        }
        Bomb.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
        }
        // 鱼苗
        function yuProp() {
            this.img = images.prop
            this.w = 39
            this.h = 68
            this.x = 78
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            this.speed = rand(3, 6)
            // 道具id
            this.propId = 2
        }

        yuProp.prototype.move = function () {
            this.iY += this.speed
        }
        yuProp.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
        }
        // 小何
        function heProp() {
            this.img = images.prop
            this.w = 39
            this.h = 68
            this.x = 117
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            this.speed = rand(4, 8)
            // 道具id
            this.propId = 3
        }

        heProp.prototype.move = function () {
            this.iY += this.speed
        }
        heProp.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
        }
        // 无敌
        function youProp() {
            this.img = images.prop
            this.w = 39
            this.h = 68
            this.x = 156
            this.y = 0
            this.iX = rand(0, windowW - this.w * scale)
            this.iY = -this.h * scale
            this.speed = rand(3, 6)
            // 道具id
            this.propId = 4
        }

        youProp.prototype.move = function () {
            this.iY += this.speed
        }
        youProp.prototype.draw = function () {
            this.move()
            context.drawImage(this.img, this.x, this.y, this.w, this.h, this.iX, this.iY, this.w * scale, this.h * scale)
        }

        start.addEventListener('touchstart', function () {
            gameLogo.setAttribute("class", "animated bounceOutDown")
            setTimeout(function () {
                //  外框隐藏
                startWrap.style.display = "none"
            }, 800)


            document.addEventListener('touchstart', function () {
                // 获取手指按下的坐标
                var touchObj = event.touches[0]
                var touchX = touchObj.clientX
                var touchY = touchObj.clientY

                // 获取按下的位置跟飞机位置的距离
                var disX = heroFly.iX - touchX
                var disY = heroFly.iY - touchY

                // 判断手指是否按到玩家飞机
                if (touchY > heroFly.iY && touchY < heroFly.iY + heroFly.h && touchX > heroFly.iX && touchX < heroFly.iX + heroFly.w) {
                    function touchMove() {
                        var touchObj = event.touches[0]
                        var x = touchObj.clientX + disX
                        var y = touchObj.clientY + disY

                        heroFly.move(x, y)
                        // 阻止移动端的触屏默认事件
                        event.preventDefault()
                    }

                    document.addEventListener('touchmove', touchMove, false)
                    document.addEventListener('touchend', function () {

                        document.removeEventListener('touchmove', touchMove)
                    }, false)
                }
                event.preventDefault()
            }, false)

            function main() {

                // 绘制背景图片
                bgObj.draw()

                // 控制双排子弹的有效时间
                if (!bulletBol) {
                    heroFly.propTime++
                    if (heroFly.propTime > heroFly.propEndTime) {
                        heroFly.propTime = 0
                        bulletBol = true
                    }
                }
                // 控制人头的有效时间
                if (heroFly.headPropBol) {
                    heroFly.headPropTime++
                    if (heroFly.headPropTime > heroFly.headPropEndTime) {
                        heroFly.headPropTime = 0
                        heroFly.headPropTime = false
                        heroFly.bulletSpeed = 6
                    }
                }

                // 创建子弹对象
                if (frame % heroFly.bulletSpeed === 0) {
                    bulletObj = new Bullet(heroFly.iX, heroFly.iY)
                    bullets.push(bulletObj)
                }
                // 绘制子弹
                for (var i = 0; i < bullets.length; i++) {
                    if (bullets[i].iY < -bullets[i].h) {
                        // 出画布啦
                        bullets.splice(i, 1)
                        i--
                        continue
                    }
                    bullets[i].draw()
                }

                // 创建敌机对象
                if (frame % 20 === 0) {
                    var enemyObj = new Enemy()
                    enemies.push(enemyObj)
                }
                // 绘制敌机
                for (var i = 0; i < enemies.length; i++) {
                    if (enemies[i].iY > windowH + 50) {
                        enemies.splice(i, 1)
                        i--
                        continue
                    }
                    // 判断是不是从敌机数组中将对象移除了
                    var bol = enemies[i].draw()
                    if (bol) {
                        i--
                    }
                }

                // 子弹和敌机的碰撞
                for (var i = 0; i < enemies.length; i++) {
                    // 敌机的血量是否小于等于0，因为血量为0后还要执行爆炸的动画
                    if (enemies[i].hp <= 0) {
                        continue
                    }
                    for (var j = 0; j < bullets.length; j++) {
                        if (rectCrash(enemies[i], bullets[j])) {
                            // 敌机的处理-扣血
                            enemies[i].downHp(bullets[j].atk)
                            // 该子弹消失
                            bullets.splice(j, 1)
                            break
                        }
                    }
                }

                // 敌机和玩家飞机的碰撞
                for (var i = 0; i < enemies.length; i++) {
                    if (enemies[i].hp <= 0) {
                        continue
                    }
                    if (rectCrash(heroFly, enemies[i])) {
                        heroFly.bombBol = true
                    }
                }

                // 创建道具对象
                if (frame % 500 === 0) {
                    var r = rand(0, 100)
                    if (r >= 0 && r < 40) {
                        var propObj = new BulletTwo()
                    } else if (r >= 40 && r < 60) {
                        var propObj = new Bomb()
                    } else if (r >= 60 && r < 70) {
                        var propObj = new yuProp()
                    } else if (r >= 70 && r < 95) {
                        var propObj = new heProp()
                    } else {
                        var propObj = new youProp()
                    }
                    props.push(propObj)
                }
                // 绘制道具
                for (var i = 0; i < props.length; i++) {
                    props[i].draw()
                }
                // 玩家撞道具
                for (var i = 0; i < props.length; i++) {
                    if (rectCrash(heroFly, props[i])) {
                        switch (props[i].propId) {
                            case 0:
                                // 双排
                                heroFly.propTime = 0
                                bulletBol = false
                                break
                            case 1:
                                // 炸弹
//                                heroFly.propTime = 0
                                heroFly.bombNum++
                                break
                            case 2:
                                // 鱼苗
                                heroFly.headPropBol = true
                                heroFly.headPropTime = 0
                                heroFly.bulletSpeed = 12     //子弹速度减半
                                break
                            case 3:
                                //小何
                                gameOver.style.display = 'flex'
                                gameOverBol = true
                                //输出结果
                                result.innerHTML = `对不起.你死了...<br>小何有毒.哈哈哈...`
                                break
                            case 4:
                                //you
                                heroFly.headPropBol = true
                                heroFly.headPropTime = 0
                                heroFly.propTime = 0
                                bulletBol = false           // 双排
                                heroFly.bombNum += 3         //获得三个炸弹
                                heroFly.bulletSpeed = 3     //子弹速度加倍
                                break

                        }
                        props.splice(i, 1)
                        i--
                    }
                }
                // 是否显示
                if (heroFly.bombNum > 0) {
                    bomb.innerHTML = heroFly.bombNum
                    bomb.style.display = "block"
                } else {
                    bomb.style.display = "none"
                }

                // 绘制玩家飞机
                if (frame % 10 === 0 && !heroFly.bombBol) {
                    heroFly.switchX()
                }
                heroFly.draw()

                frame++
                if (frame > 10000) {
                    frame = 0
                }
                if (!gameOverBol) {
                    requestAnimationFrame(main)
                }
            }

            main()

            // 给炸弹按钮添加点击事件
            bomb.addEventListener('touchstart', function () {
                heroFly.bombNum--
                // 所有的敌机爆炸
                for (var i = 0; i < enemies.length; i++) {
                    enemies[i].downHp(10000)
                }
            }, false)
        }, false)
    }
