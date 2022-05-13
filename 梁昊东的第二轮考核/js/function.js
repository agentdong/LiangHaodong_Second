const IP = 'http://175.178.193.182:8080';//ip地址


// ajax函数
function ajax(options) {
    //设置默认参数
    let ajaxDefault = {
        type: 'get',
        url: '',
        urlParams: {},
        headers: {},
        headerProperty: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {},
        success() { },
        error() { },
    }

    //使用ajaxDefault对象的属性覆盖ajaxDefault对象的属性
    Object.assign(ajaxDefault, options);

    ajaxDefault.url = `${IP}${ajaxDefault.url}`;

    //处理参数的函数
    function params(info) {

        // 拼接参数的字符串
        let infoParams = '';

        //拼接参数
        for (let k in info) {
            infoParams += `${k}=${info[k]}&`;
        }

        //截取字符串，去掉最后的&
        infoParams = infoParams.substr(0, infoParams.length - 1);

        return infoParams;
    }

    // 判断是否传入ajaxDefault.urlParams
    if (Object.keys(ajaxDefault.urlParams).length != 0) {
        //拼接到url路径上
        ajaxDefault.url += `?${params(ajaxDefault.urlParams)}`;
    }


    //创建ajax对象
    let xhr = new XMLHttpRequest();

    // 初始化，配置信息
    xhr.open(ajaxDefault.type, ajaxDefault.url);


    //设置自定义请求头
    if (ajaxDefault.headers) {
        for (k in ajaxDefault.headers) {
            xhr.setRequestHeader(k, ajaxDefault.headers[k]);
        }
    }

    //判断是否传入ajaxDefault.body且请求类型为post
    if ((ajaxDefault.type === 'POST' || ajaxDefault.type === 'post') && ajaxDefault.body) {
        //接收Content-Type属性值
        let contentType = ajaxDefault.headerProperty['Content-Type'];

        //设置请求头
        if (contentType !== '') {
            xhr.setRequestHeader('Content-Type', contentType);
        }

        //判断Content-Type的属性值
        if (contentType === 'application/json') {
            //发送json对象（转为字符串形式）
            xhr.send(JSON.stringify(ajaxDefault.body));
        } else if (contentType === 'application/x-www-form-urlencoded') {
            //发送拼接字符串
            xhr.send(params(ajaxDefault.body));
        } else if (ajaxDefault.body.formData) {
            xhr.send(ajaxDefault.body.formData);
        } else if (options.body.image) {
            xhr.send(options.body.image);
        }

    } else {
        // 发送
        xhr.send();
    }


    // 响应后处理响应数据
    xhr.onload = function () {
        //获取响应头的数据
        let resContentType = xhr.getResponseHeader('Content-Type');

        //服务器端返回的数据
        let response = xhr.response;

        //如果响应头的Content-Type的属性值包含application/json
        if (resContentType.includes('application/json')) {
            //将json字符串转换为json对象
            response = JSON.parse(response);
        }

        // 判断请求是否成功
        if (/^2\d{2}$/.test(xhr.status)) {

            ajaxDefault.success(response, xhr);
        } else {
            ajaxDefault.error(response, xhr);
        }
    }
}

var isLikeArticle = 0;//判断是否喜欢该文章变量
var likePages = [];//保存我喜欢的文章

// 判断是否喜欢该文章（文章ID，回调函数）
function isLikingArticle(articleId, callback) {
    isLikeArticle = 0;

    // 与当前的文章id比对
    likePages.forEach(likedArticle => {
        if (likedArticle.articleId == articleId) {
            isLikeArticle = 1;
        }
    });

    // 执行回调函数
    callback();
}

var likePageTh = true;
//喜欢文章（事件对象，喜欢的按钮）
function liking(e, likeBtn) {
    likePages = [];
    e.stopPropagation();//阻止事件冒泡，防止进入文章详情页
    let userId = localStorage.getItem('userId');//拿到自己的Id
    let articleId = likeBtn.getAttribute('articleId');//拿到文章的Id
    let isLikeArticle = Number(likeBtn.getAttribute('isLikeArticle'));//拿到判断自己是否已经喜欢的自定义属性
    const outLikeBtn = document.querySelector(`.like${articleId}`);//文章瀑布流展示时的爱心按钮

    //若已经喜欢该文章，则点击按钮取消喜欢
    if (isLikeArticle) {
        if (likePageTh) {
            likePageTh = false;
            ajax({
                type: 'post',
                url: '/article/unlike',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    articleId
                },
                success(data) {
                    likePageTh = true;
                    //取消喜欢成功
                    if (data.status == 200) {
                        // 修改自定义属性
                        likeBtn.setAttribute('isLikeArticle', 0);
                        likeBtn.querySelector('span').textContent--;//喜欢的人数减少

                        //喜欢的图标发生变化
                        let likeIcon = likeBtn.querySelector('i');
                        likeIcon.classList.add('icon-xihuan-xianxing');
                        likeIcon.classList.remove('icon-xihuan');

                        // 两按钮不相等
                        if (outLikeBtn != likeBtn) {
                            // 给外面的按钮设置样式
                            outLikeBtn.setAttribute('isLikeArticle', 0);
                            outLikeBtn.querySelector('span').textContent--;

                            let outLikeIcon = outLikeBtn.querySelector('i');
                            outLikeIcon.classList.add('icon-xihuan-xianxing');
                            outLikeIcon.classList.remove('icon-xihuan');
                        }
                    }
                }
            });

        }
    } else {
        //若还未喜欢该文章，点击按钮喜欢文章
        if (likePageTh) {
            likePageTh = false;
            ajax({
                type: 'post',
                url: '/article/like',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    articleId
                },
                success(data) {
                    likePageTh = true;
                    // 请求成功
                    if (data.status == 200) {
                        likeBtn.setAttribute('isLikeArticle', 1);//将自定义样式的值设置为代表喜欢
                        likeBtn.querySelector('span').textContent++;//喜欢的人数增加

                        // 爱心图标样式改变
                        let likeIcon = likeBtn.querySelector('i');
                        likeIcon.classList.remove('icon-xihuan-xianxing');
                        likeIcon.classList.add('icon-xihuan');

                        // 外面的按钮与里面的按钮不一致，修改外面按钮的样式
                        if (outLikeBtn != likeBtn) {
                            outLikeBtn.setAttribute('isLikeArticle', 1);
                            outLikeBtn.querySelector('span').textContent++;

                            let outLikeIcon = outLikeBtn.querySelector('i');
                            outLikeIcon.classList.remove('icon-xihuan-xianxing');
                            outLikeIcon.classList.add('icon-xihuan');
                        }

                    }
                }
            });

        }
    }
}

// 获取文章
var pageType;  //文章的类型
var fragment;//文档片段，一次插入

function getPage(type, box) {
    pageType = type;//文章的类型，扩展到全局作用域
    // 发送请求，拿到首页的文章
    ajax({
        url: '/article/getHomePage',
        success(data) {
            console.log(data);
            let subject = '.subject';
            //生成文章
            productPage(data, subject, box);
        }
    });

}

// 生成文章函数，（首页文章响应的数据，文章所处的页面，插入的目标位置）
function productPage(data, pageLocation, targetBox) {
    let topicPage
    // 拿到不同响应数据中的文章数据
    if (data.pages) {
        topicPage = data.pages[pageType];
    } else if (data.articles) {
        topicPage = data.articles;
    } else if (data.staredArticles) {
        topicPage = data.staredArticles;
    } else if (data.likedArticles) {
        topicPage = data.likedArticles;
    } else {
        topicPage = data
    };

    //如果没有文章，生成提示信息，并终止函数执行
    if (topicPage.length == 0) {
        let noInfo = document.createElement('p');
        noInfo.className = 'endInfo pa';
        noInfo.textContent = '没有更多了~';
        targetBox.appendChild(noInfo);

        targetBox.style.opacity = '1';
        const loading = document.querySelector('.loading');
        loading.classList.remove('show');
        return;
    }

    //创建文档片段
    fragment = document.createDocumentFragment();
    let pageCount = 0;//已经生成的文章的数量
    let pageNum = topicPage.length;//拿到的文章数量

    new Promise(function (resolve, reject) {
        let userId = localStorage.getItem('userId');

        // 发送请求，获得自己喜欢的文章
        ajax({
            url: '/article/getLike',
            urlParams: {
                userId
            },
            success(data) {
                let { likedArticles } = data;
                likePages = likedArticles;
                resolve();
            }
        });
    }).then(function () {
        console.log(1);
        //遍历拿到的每个文章
        topicPage.forEach(page => {
            // 如果没被删除，就执行插入程序
            if (page.available == true) {
                //调用判断是否喜欢该文章的函数（文章的ID，回调函数）
                isLikingArticle(page.articleId, inputPageCallback)

                function inputPageCallback() {
                    // 插入文章函数（文章的数据，文章所处的页面）
                    inputPage(page, pageLocation);
                    console.log(pageCount);
                    pageCount++;

                }

            } else {
                pageCount++;
            }

            if (pageCount == pageNum) {
                // 到底部的提示信息
                let p = document.createElement('p');
                p.className = `pa endInfo endInfo-${targetBox.id}`;
                fragment.appendChild(p);

                targetBox.appendChild(fragment);

                let items = targetBox.querySelectorAll('.item');//所有文章
                let imgs = targetBox.querySelectorAll('#pic');//所有显示的图片

                // 判断所有图片是否成功加载（所有显示的图片，瀑布流函数，目标插入盒子）
                isImgLoad(imgs, waterFall, targetBox, items);
            }

        });

    });
}


//创建标签插入文章
function inputPage(page, pageLocation) {
    //解构获得数据
    let { images, likes, title, authorName, avatar, articleId, authorId } = page;

    // 创建文章盒子
    let item = document.createElement('div');
    item.className = 'item';
    // 添加自定义属性
    item.setAttribute('articleId', articleId);
    item.setAttribute('authorId', authorId);
    item.setAttribute('pageLocation', pageLocation);
    item.onclick = showingDetails;

    // 图片
    let img = document.createElement('img');
    if (images.length !== 0) {
        img.src = images[0];
    } else {
        img.src = 'https://i2.hdslb.com/bfs/archive/166171cce61903ecd7b3fe3b61a01781353d113a.jpg@672w_378h_1c.webp';
    }
    img.id = 'pic';
    // 加载错误时执行的回调函数
    img.onerror = function () {
        img.src = 'https://i2.hdslb.com/bfs/archive/166171cce61903ecd7b3fe3b61a01781353d113a.jpg@672w_378h_1c.webp';
    }
    item.appendChild(img);

    // 标题
    let h5 = document.createElement('h5');
    h5.textContent = title;
    item.appendChild(h5);

    // 信息盒子
    let itemInfo = document.createElement('div');
    itemInfo.className = 'item-info';
    item.appendChild(itemInfo);

    //用户的头像和姓名
    let author = document.createElement('div');
    // 如果解构数据没有authorName，发送请求获得
    if (!authorName) {
        ajax({
            url: '/user/baseInfo',
            urlParams: {
                userId: authorId
            },
            success(data) {
                authorName = data.user.nickname;
                avatar = data.user.avatar;
                author.innerHTML = `<img src=${avatar}>${authorName}`;
                author.querySelector('img').onerror = function () {
                    this.src = 'https://i2.hdslb.com/bfs/archive/166171cce61903ecd7b3fe3b61a01781353d113a.jpg@672w_378h_1c.webp';
                }
            }
        });
    } else {
        author.innerHTML = `<img src=${avatar}>${authorName}`;
        author.querySelector('img').onerror = function () {
            this.src = 'https://i2.hdslb.com/bfs/archive/166171cce61903ecd7b3fe3b61a01781353d113a.jpg@672w_378h_1c.webp';
        }
    }
    author.className = 'author';
    itemInfo.appendChild(author);

    // 喜欢部分
    let likesBox = document.createElement('div');
    // 添加自定义属性
    likesBox.setAttribute('articleId', articleId);
    likesBox.setAttribute('isLikeArticle', isLikeArticle);
    likesBox.className = 'likes';
    likesBox.classList.add(`like${articleId}`);
    likesBox.innerHTML = `<i class="icon-xihuan-xianxing iconfont"></i> <span>${likes}</span>`;//插入HTML标签
    // 给喜欢按钮绑定点击事件
    likesBox.onclick = function (e) {
        // 喜欢文章函数（事件对象，点击的盒子）
        liking(e, likesBox);
    };
    itemInfo.appendChild(likesBox);

    // 喜欢图标
    let likeIcon = likesBox.querySelector('i');
    // 如果喜欢该文章，就设置相应的样式
    if (isLikeArticle) {
        likeIcon.classList.remove('icon-xihuan-xianxing');
        likeIcon.classList.add('icon-xihuan');
    }

    // 将生成好的标签插入文本片段中
    fragment.appendChild(item);

}

//图片是否加载完成（所有图片，回调函数，所有文章盒子，图片是否加载完成的判断标志（可选））
function isImgLoad(imgs, callback, box, items, isLoad = true) {
    console.log(1);
    // const subject = document.querySelector('.subject');
    // 遍历所有图片
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].clientHeight === 0) {
            isLoad = false;
            break;
        }
    }

    // 如果图片加载完成
    if (isLoad) {
        const loading = document.querySelector('.loading');
        // 关闭用于重调用isImgLoad的定时器
        clearTimeout(timer);

        // 调用回调函数
        callback(items, box);
        loading.classList.remove('show');
        box.style.opacity = '1';
        refreshTrt = true;


        // 当页面缩放时，调用回调函数
        document.body.onresize = function () {
            let showMain;//现在显示的瀑布流的盒子
            //如果搜索页面显示
            if (document.querySelector('.search').className.includes('show')) {
                // 拿到搜索页面下的瀑布流盒子
                showMain = document.querySelector('.search-result').querySelector('.show');
            } else if (document.querySelector('.home').querySelector('.show')) {
                // 如果主页显示，拿到主页下显示的瀑布流盒子
                showMain = document.querySelector('.home').querySelector('.show');
            } else if (document.querySelector('.person-show').querySelector('.show')) {
                //如果个人中心显示，拿到个人中心下显示的瀑布流盒子
                showMain = document.querySelector('.person-show').querySelector('.show');
            }

            // 如果显示的瀑布流盒子的宽度不为零
            if (showMain.clientWidth !== 0) {
                // 拿到该瀑布流盒子下的所有文章盒子
                let items = showMain.querySelectorAll('.item');

                // 重新进行瀑布流布局
                //瀑布流函数（要布局的所有盒子，展示瀑布流的盒子）
                waterFall(items, showMain);
            }
        };
    } else {
        //如果图片尚未加载完成
        //重置判断标志
        isLoad = true;

        // 开启定时器，每隔0.1秒检查一次图片有没有加载完成
        var timer = setTimeout(() => {
            isImgLoad(imgs, callback, box, items, isLoad = true);
        }, 100);
    }
}

//瀑布流（要布局的所有盒子，展示瀑布流的盒子）
function waterFall(items, box) {
    // 如果没有传入展示瀑布流的盒子，则默认为body
    box = box || document.body;
    // 拿到展示瀑布流的盒子的宽度
    let boxWidth = box.clientWidth;
    //拿到文章盒子的宽度加上外边距
    let itemWidth = items[0].clientWidth + parseInt(getComputedStyle(items[0]).marginLeft) * 2;

    //计算出要布局几列
    let colum = parseInt(boxWidth / itemWidth);

    //准备一个存放每一列高度的盒子
    let arr = [];

    // 遍历每一个文章盒子
    items.forEach((item, index) => {
        // 拿到当前文章盒子的高度，包括外边距
        let itemHeight = item.clientHeight + parseInt(getComputedStyle(item).marginTop);
        // 如果文章的索引小于列数
        if (index < colum) {
            // 将文章高度存到数组
            arr.push(itemHeight);
            // 让文章变为行内块元素一行排列
            item.classList.add('ilb');
        } else {
            // 如果文章索引不小于列数
            // 给文章加上绝对定位
            item.classList.add('pa');

            // 拿到数组中的最小高度
            let minHeight = Math.min(...arr);

            //拿到最小高度的索引
            let minIndex = arr.indexOf(minHeight);

            // 将当前文章的top值设为最小高度
            item.style.top = minHeight + 'px';

            //设置文章距离左边的距离，索引乘以文章的宽度
            item.style.left = minIndex * itemWidth + 'px';

            // 更新数组内的高度
            arr[minIndex] += itemHeight;
        }
    });

    // 拿到当前瀑布流页面的底部提示盒子
    let endInfo = document.querySelector(`.endInfo-${box.id}`);
    let pHeight = Math.max(...arr);//拿到底部距离顶部的距离

    // 给底部提示盒子设置top值，使其位于最底端
    endInfo.style.top = pHeight + 'px';
    endInfo.textContent = '已经到底了~';

    if (document.querySelector('.subject').className.includes('show')) {
        window.removeEventListener('scroll', refresh);
        window.addEventListener('scroll', refresh);
    }
}

//分页
var pages = 1;
var refreshTrt = true
function refresh() {
    let realHeight = document.documentElement.scrollHeight;
    let visionHeight = window.innerHeight;
    let scrollHeight = window.scrollY;

    if (visionHeight + scrollHeight == realHeight && document.querySelector('.subject').className.includes('show') && refreshTrt && document.querySelector('.home').className.includes('show')) {
        refreshTrt = false;
        console.log('到底了');

        const selected = document.querySelector('.tab-nav').querySelector('.tab-nav-selected');
        const showPage = document.querySelector('.home').querySelector('.show');
        const loading = document.querySelector('.loading');
        loading.classList.add('show');
        let tag = selected.textContent;

        ajax({
            url: '/article/getHomePageTag',
            urlParams: {
                tag,
                pages
            },
            success(data) {
                let articles = data.articles
                pages++;
                if (articles.length == 0) {
                    loading.classList.remove('show');
                    return;
                }
                showPage.style.opacity = '0';
                productPage(articles, '.subject', showPage);
            }
        });
    }
}
//获得文章的搜索结果（存放结果的盒子，关键词）
function getResultPage(box, keyWord) {

    // 请求搜索结果
    ajax({
        url: '/search/byArticle',
        urlParams: {
            keyWord
        },
        success(data) {
            // 展示搜索结果的页面
            let search = '.search';
            // 启用生成文章盒子的程序
            productPage(data, search, box);
        }
    });

}

var userFragment;//插入搜索用户结果的文档片段
var isFan;//判断自己有没有关注他
var userNum;//搜索用户结果的数量
var beFollow;//判断有没有被该用户关注

//发送请求，获取用户搜索结果（插入到哪个位置，关键词）
function getResultUser(box, keyWord) {

    //根据关键词搜索用户
    ajax({
        url: '/search/byUser',
        urlParams: {
            keyWord
        },
        success(data) {
            //创建装用户信息的盒子（插入的位置，响应的数据）
            produceUser(box, data.users, '.search');
        }
    });
}

//创建装用户信息的盒子（插入的位置，响应的数据，当前所在的页面）
function produceUser(box, users, pageLocation) {

    //如果没有搜索到
    if (users.length == 0) {
        // 创建p标签，显示提示信息
        let noInfo = document.createElement('p');
        noInfo.className = 'endInfo pa';
        noInfo.textContent = '没有更多了~';
        box.appendChild(noInfo);
        // 结束函数调用
        return;
    }

    // 拿到搜索结果的数量
    userNum = users.length;
    //创建文档片段
    userFragment = document.createDocumentFragment();
    // 创建计数器，控制将文档片段一次性插入的时机
    let count = 0;

    // 遍历搜索结果数组,开始处理程序
    users.forEach(user => {
        //判断是否互相关注的函数（对方的userId，回调函数）
        isFanOrBothFan(user.userId, showUser)

        // 插入搜索到的用户
        function showUser() {
            //  创建HTML标签并插入文档片段中（搜索结果信息的对象， 文档片段）
            inputUser(user, userFragment, pageLocation);
            count++;//计数器当没个搜索结果都进行完处理后，控制文档片段插入

            // 当搜索结果均已完成处理程序，进入插入程序
            if (count == userNum) {
                // 创建底部的提示信息
                let p = document.createElement('p');
                p.className = `endUserInfo`;
                p.textContent = '已经到底了~';
                userFragment.appendChild(p);

                // 将文档片段插入
                box.appendChild(userFragment);
            }
        }
    });
}

// 判断是否互相关注的函数（对方的userId，回调函数）
function isFanOrBothFan(userId, callback) {
    // 发送请求，获取该用户的粉丝列表，用于判断自己是否关注了他
    ajax({
        url: '/user/fanList',
        urlParams: {
            userId
        },
        success(data) {
            //拿到粉丝列表
            let fans = data.fansList;
            // 拿到自己的用户ID
            let ownUserId = localStorage.getItem('userId');

            // 发送请求，获取该用户的关注列表，用于判断被该用户关注
            ajax({
                url: '/user/followerList',
                urlParams: {
                    userId
                },
                success(data) {
                    //拿到该用户的关注列表
                    let followers = data.followsList;
                    // 初始化判断标量
                    beFollow = 0;
                    isFan = 0;

                    // 遍历该用户粉丝列表，比对ID，判断自己是否关注了他
                    fans.forEach(fan => {
                        if (fan.userId == ownUserId) {
                            isFan = 1;
                        }
                    });

                    //遍历该用户的关注列表，比对ID，判断自己是否被该用户关注
                    followers.forEach(follow => {
                        if (follow.userId == ownUserId) {
                            beFollow = 1;
                        }
                    });

                    // 调用回调函数
                    callback();
                }
            });

        }
    });

}

// 插入用户盒子的函数（用户id，插入用户的文档片段，回退到哪个页面）
function inputUser(user, userFragment, backPlace) {
    // 解构拿到相关信息
    let { avatar, description, nickname, userId } = user;

    // 最大的盒子
    let userItem = document.createElement('div');
    userItem.className = 'user-item';

    // 用户信息盒子
    let userInfo = document.createElement('div');
    userItem.appendChild(userInfo);

    // 用户头像
    let img = document.createElement('img');
    img.src = avatar;
    img.setAttribute('backPlace', backPlace);
    img.setAttribute('userId', userId);
    img.onclick = userClick;
    userInfo.appendChild(img);

    // 装文字的盒子
    let span = document.createElement('span');
    userInfo.appendChild(span);

    // 名字
    let h4 = document.createElement('h4');
    h4.textContent = nickname;
    span.appendChild(h4);

    // 个性签名
    let p = document.createElement('p');
    if (description == '') {
        description += '这个人很懒什么都没写';
    }
    p.textContent = description;
    span.appendChild(p);

    // 关注的按钮
    let btn = document.createElement('button');
    const search = document.querySelector('.search');
    btn.setAttribute('userId', userId);//设置自定义属性，存储该用户的ID，为了点击事件
    btn.onclick = following.bind(btn, search);
    //绑定点击事件
    btn.className = 'follow';

    // 判断自己是否关注了该用户
    if (isFan) {
        // 自定义属性，存储判断结果，便于编写点击事件
        btn.setAttribute('isFan', 1);
        // 若关注了，则判断有没有被用户关注
        if (beFollow) {
            // 若也被用户关注，则设置互相关注的样式
            btn.textContent = '互相关注';
            // 自定义属性，存储判断结果，便于编写点击事件
            btn.setAttribute('beFollow', 1);
            btn.classList.add('btn-both-fan');
        } else {
            // 若没被该用户关注，则设置已关注的样式
            btn.textContent = '已关注';
            btn.classList.add('btn-fan');
            // 自定义属性，存储判断结果，便于编写点击事件
            btn.setAttribute('beFollow', 0);
        }
    } else {
        // 若未关注该用户，则设置未关注的的样式
        btn.textContent = '未关注';
        // 自定义属性，存储判断结果，便于编写点击事件
        btn.setAttribute('isFan', 0);
        if (beFollow) {
            btn.setAttribute('beFollow', 1);
        } else {
            btn.setAttribute('beFollow', 0);
        }
    }

    // 按钮插入item盒子
    userItem.appendChild(btn);

    // item盒子插入文本片段
    userFragment.appendChild(userItem);

}

var followTh = true;
// 关注按钮点击事件
function following(box) {
    let followerId = this.getAttribute('userId');//拿到该用户的ID
    let userId = localStorage.getItem('userId');//拿到自己的ID
    let isFan = this.getAttribute('isFan');//拿到是否关注了该用户的判断标志
    let beFollow = this.getAttribute('beFollow');//拿到了是否被该用户关注的判断标志
    let follow = this;//拿到该按钮

    //关注或取消关注失败的处理函数
    function error(data, box) {
        // 取消关注失败
        // 创建显示错误信息的盒子
        let followError = document.createElement('div');
        // 拿到要放置示错误信息盒子的盒子
        // let search = document.querySelector('.search');
        //设置样式
        followError.className = 'follow-error';
        followError.textContent = data.msg;
        // 插入
        box.appendChild(followError);

        // 一秒后销毁
        setTimeout(() => {
            box.removeChild(followError);
        }, 1000);

    }
    // 关注了,点击就取消关注
    if (isFan == '1') {
        if (followTh) {
            followTh = false;
            //发送请求，取消关注
            ajax({
                type: 'post',
                url: '/user/cancelFollow',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    followerId
                },
                success(data) {
                    followTh = true;
                    // 取消关注成功
                    if (data.status == 200) {
                        // 更改自定义样式，用于下次点击时判断
                        follow.setAttribute('isFan', 0);
                        // 设置为关注的样式
                        follow.textContent = '未关注';
                        follow.classList.remove('btn-fan');
                        follow.classList.remove('btn-both-fan');

                    }
                    else {
                        error(data, box);
                    }
                },
            });

        }
    } else {
        if (followTh) {
            followTh = false;
            // 若没有关注，则点击就关注
            //发送请求，关注该用户
            ajax({
                type: 'post',
                url: '/user/follow',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    followerId
                },
                success(data) {
                    followTh = true;
                    // 关注成功
                    if (data.status == 200) {
                        //设置自定义样式，用于下次点击时判断
                        follow.setAttribute('isFan', 1);
                        //如果被该用户关注，则是互相关注
                        if (beFollow == '1') {
                            follow.textContent = '互相关注';
                            follow.classList.add('btn-both-fan');
                        } else {
                            //如果没被该用户关注，则设为已关注
                            follow.textContent = '已关注';
                            follow.classList.add('btn-fan');
                        }

                    } else {
                        // 关注失败
                        error(data, box);
                    }
                },
            });

        }
    }
}

var index = 0;//索引,用于自动播放轮播图
var automovePublic;//自动播放轮播图的函数
var w;//图片的宽度
function slideShowBtn(ul, ol) {

    // 用循环给按钮绑定事件
    for (let i = 0; i < ol.children.length; i++) {
        // 每个按钮都设置用于标明序号的自定义属性
        ol.children[i].setAttribute('index', i);
        // 给按钮绑定点击事件
        ol.children[i].onclick = function () {
            // 拿到这个按钮的编号
            index = this.getAttribute('index');

            // 计算出要移动的距离
            let translatex = -index * w;

            //添加过渡效果
            ul.classList.add('ul-transition');
            ul.style.transform = `translateX(${translatex}px)`;//通过translateX实现移动

            // 清除定时器
            clearInterval(ul.timer);

            // 重新添加定时器
            ul.timer = setInterval(automovePublic, 5000);
        }
    }

}

//轮播图的事件绑定（装图片的盒子，装按钮的盒子）
function slideShowEvent(box, ol) {
    let ul = box.querySelector('ul');//获取ul


    // 自动播放轮播图的函数
    automovePublic = function () {
        index++;//索引号加一
        let translatex = -index * w;//计算出移动的距离

        ul.classList.add('ul-transition');//添加过渡效果
        ul.style.transform = `translateX(${translatex}px)`;//移动
    }

    // 监听过渡完成事件
    ul.addEventListener('transitionend', tranFn, false);

    function tranFn() {
        // 如果到了倒数第一张图
        if (index >= ul.children.length - 2) {
            // 重置index
            index = 0;

            // 移除过渡效果
            ul.classList.remove('ul-transition');

            //返回初始位置
            let translatex = -index * w;
            ul.style.transform = `translateX(${translatex}px)`;//移动
        } else if (index < 0) {
            //如果到了第一张图
            index = ul.children.length - 3;//将序号置为倒数第二张图
            ul.classList.remove('ul-transition');//取消过渡效果

            // 计算出移动的距离
            let translatex = -index * w;
            console.log('tran');
            ul.style.transform = `translateX(${translatex}px)`;
        }

        ol.querySelector('.slide-show-selected').classList.remove('slide-show-selected');
        ol.children[index].classList.add('slide-show-selected');
    }

    let startX = 0;
    let moveX = 0;
    let flag = false;

    //监听手指触碰屏幕事件
    ul.addEventListener('touchstart', tsFn, false);

    function tsFn(e) {
        clearInterval(ul.timer);

        startX = e.targetTouches[0].pageX

        e.preventDefault();

        ul.addEventListener('touchmove', move, false);
        if (ul.children.length == 1) {
            ul.removeEventListener('touchmove', move, false);
        }

    }

    // 跟随手指移动事件
    function move(e) {

        moveX = e.targetTouches[0].pageX - startX;

        let translatex = -index * w + moveX;

        ul.classList.remove('ul-transition');
        ul.style.transform = `translateX(${translatex}px)`;

        flag = true;
    }

    //监听手指离开屏幕事件
    ul.addEventListener('touchend', teFn, false);

    function teFn() {
        if (flag) {
            if (Math.abs(moveX) > 100) {
                if (moveX > 0) {
                    index--;
                } else {
                    index++;
                }

                let translatex = -index * w;
                console.log('touchmove');

                ul.classList.add('ul-transition');
                ul.style.transform = `translateX(${translatex}px)`;
            } else {
                let translatex = -index * w;
                console.log('touchmove');

                ul.classList.add('ul-transition');
                ul.style.transform = `translateX(${translatex}px)`;

            }
        }

        flag = false;
        ul.removeEventListener('touchmove', move);

        clearInterval(ul.timer);
        if (ul.children.length > 1) {
            ul.timer = setInterval(automovePublic, 5000);
        }
    }

}

var isStar = 0;
// 判断是否收藏
function isStaring(articleId, callback) {
    let userId = localStorage.getItem('userId');
    ajax({
        url: '/article/getStar',
        urlParams: {
            userId
        },
        success(data) {
            isStar = 0;
            let { staredArticles } = data;

            staredArticles.forEach(star => {
                if (star.articleId == articleId) {
                    isStar = 1;
                }
            });

            callback();
        }
    });
}

var starTh = true;
// 收藏文章
function staring() {
    let userId = localStorage.getItem('userId');//拿到自己的Id
    let articleId = this.getAttribute('articleId');//拿到文章的Id
    let isStar = Number(this.getAttribute('isStar'));
    let starBtn = this;

    //若已经收藏该文章，则点击按钮取消收藏
    if (isStar) {
        if (starTh) {
            starTh = false;
            ajax({
                type: 'post',
                url: '/article/unstar',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    articleId
                },
                success(data) {
                    starTh = true;
                    if (data.status == 200) {
                        starBtn.setAttribute('isStar', 0);
                        starBtn.querySelector('span').textContent--;

                        let starIcon = starBtn.querySelector('i');
                        starIcon.classList.add('icon-shoucang');
                        starIcon.classList.remove('icon-shoucang1');

                    }
                }
            });

        }
    } else {
        if (starTh) {
            starTh = false;
            //若还未收藏该文章，点击按钮收藏文章
            ajax({
                type: 'post',
                url: '/article/star',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    articleId
                },
                success(data) {
                    starTh = true;
                    if (data.status == 200) {
                        starBtn.setAttribute('isStar', 1);
                        starBtn.querySelector('span').textContent++;

                        let starIcon = starBtn.querySelector('i');
                        starIcon.classList.remove('icon-shoucang');
                        starIcon.classList.add('icon-shoucang1');

                    }
                }
            });

        }
    }

}

// 渲染文章详细信息
function showingDetails() {
    const detailsBack = document.querySelector('.details-back');//文章详情页返回按钮
    let pageLocation = this.getAttribute('pageLocation');//原来文章在的位置
    const page = document.querySelector(pageLocation);//拿到原来文章在的位置
    const detailsPage = document.querySelector('.detailsPage');//文章详情页
    const loading = document.querySelector('.loading');//加载页面
    page.classList.remove('show');
    loading.classList.add('show');
    detailsPage.classList.add('show');
    detailsPage.style.opacity = '0';
    w = detailsPage.querySelector('.slide-show').clientWidth;

    index = 0;
    reviewPages = 0;
    const ul = detailsPage.querySelector('.slide-show').querySelector('ul');//轮播图的ul
    const ol = detailsPage.querySelector('.slide-show-btn-box');//轮播图切换按钮
    const articleTags = detailsPage.querySelector('.article-tags');//显示话题的区域
    const reviewContent = document.querySelector('.review-content');//显示评论的区域
    const followBtn = detailsPage.querySelector('.follow');//关注按钮

    ul.textContent = '';
    ol.textContent = '';
    articleTags.textContent = '';
    clearInterval(ul.timer);
    ul.classList.remove('ul-margin');
    ul.classList.remove('ul-transition');
    ul.classList.add('ul-width');
    ul.style.transform = `translateX(0)`;
    reviewContent.textContent = '';
    followBtn.className = 'follow';


    detailsBack.onclick = fn;

    function fn() {
        clearInterval(ul.timer);
        reviewTh = false;
        detailsPage.classList.remove('show');
        page.classList.add('show');
    }

    let articleId = Number(this.getAttribute('articleId'));
    detailsPage.setAttribute('articleId', articleId);
    let authorId = Number(this.getAttribute('authorId'));
    let userId = Number(localStorage.getItem('userId'));
    const sendReviewBtn = document.querySelector('.send-review-btn');//发送评论的按钮
    const writeReviewInput = document.querySelector('.write-review-input').querySelector('input');//书写评论的输入框
    const writeReview = document.querySelector('.write-review');//评论输入区
    const reviewMask = document.querySelector('.review-mask');//评论输入区显示时的遮罩层

    sendReviewBtn.onclick = function () {
        let content = writeReviewInput.value;
        let parentReviewId = Number(writeReviewInput.getAttribute('reviewId'));
        console.log(parentReviewId);

        if (!parentReviewId) {
            ajax({
                type: 'post',
                url: '/review',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    replyToUserId: authorId,
                    replyToArticleId: articleId,
                    authorId: userId,
                    content
                },
                success(data) {
                    console.log(1);
                    console.log(data);
                    writeReview.classList.remove('flex');
                    reviewMask.classList.remove('show');
                    writeReviewInput.value = '';
                    reviewPages = 0
                    updateReview();
                }
            });
        } else {
            ajax({
                type: 'post',
                url: '/review',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    replyToUserId: authorId,
                    replyToArticleId: articleId,
                    authorId: userId,
                    content,
                    parentReviewId
                },
                success(data) {
                    console.log(2);
                    console.log(data);
                    writeReview.classList.remove('flex');
                    reviewMask.classList.remove('show');
                    writeReviewInput.value = '';
                    if (writeReviewInput.placeholder != '快说点什么~') {
                        writeReviewInput.placeholder = '快说点什么~';
                    }
                    reviewPages = 0;
                    updateReview();
                }
            });

        }


    }




    ajax({
        url: '/article/byId',
        urlParams: {
            articleId
        },
        success(data) {
            let article = data.article;

            ajax({
                url: '/user/fullInfo',
                urlParams: {
                    userId: authorId
                },
                success(data) {
                    let user = data.user
                    ajax({
                        url: '/review/byArticle',
                        urlParams: {
                            articleId,
                            pages: '0'
                        },
                        success(data) {
                            isFanOrBothFan(user.userId, showPageDetails)

                            function showPageDetails() {
                                let review = data.reviews;
                                // 发送请求，获得自己喜欢的文章
                                ajax({
                                    url: '/article/getLike',
                                    urlParams: {
                                        userId
                                    },
                                    success(data) {
                                        isLikeArticle = 0;
                                        let { likedArticles } = data;
                                        likePages = likedArticles;
                                        isLikingArticle(articleId, pageDetailsCallback);
                                    }
                                });


                                function pageDetailsCallback() {
                                    inputPageDetails(article, user, review);

                                    let ul = detailsPage.querySelector('ul');
                                    ul.classList.remove('ul-width');
                                    ul.style.width = ul.children.length * 100 + '%';

                                    const loading = document.querySelector('.loading');
                                    loading.classList.remove('show');
                                    detailsPage.style.opacity = '1';

                                }
                            }
                        }
                    });
                }
            });
        }
    });

}


var reviewPages = 0;
var reviewTh = true;//评论节流阀
// 刷新评论
function updateReview(reset = true) {
    reviewTh = false;
    let articleId = document.querySelector('.detailsPage').getAttribute('articleId');
    const loading = document.querySelector('.loading');
    loading.classList.add('show');

    // if (reviewPages == -1) {
    //     return;
    // }

    ajax({
        url: '/review/byArticle',
        urlParams: {
            articleId,
            pages: reviewPages
        },
        success(data) {
            console.log(data);
            let reviews = data.reviews;
            if (reviews.length == 0) {
                // reviewPages = -1;
                loading.classList.remove('show');
                return;
            }


            const reviewContent = document.querySelector('.review-content');//评论显示区域
            const reviewEndInfo = document.querySelector('.review-endInfo');//没有更多评论的提示盒子

            if (reviewEndInfo) {
                reviewContent.removeChild(reviewEndInfo);
            }


            if (reset) {
                reviewContent.textContent = '';
            }

            let reviewsNum = reviews.length;
            let reviewCount = 0;
            let reviewFragment = document.createDocumentFragment();

            reviews.forEach(review => {
                let authorId = review.authorId

                ajax({
                    url: '/user/baseInfo',
                    urlParams: {
                        userId: authorId
                    },
                    success(data) {
                        reviewCount++;
                        let user = data.user;
                        let secondReview = review.reviewList;


                        createReview(review, user, reviewFragment, secondReview, 1);

                        if (reviewCount == reviewsNum) {
                            const loading = document.querySelector('.loading');
                            reviewTh = true;
                            loading.classList.remove('show');
                            let reviewEndInfo = document.createElement('div');
                            reviewEndInfo.className = 'review-endInfo';
                            reviewEndInfo.textContent = '已经到底了~';
                            reviewFragment.appendChild(reviewEndInfo);

                            reviewContent.appendChild(reviewFragment);

                            window.addEventListener('scroll', refreshReview);
                        };
                    }
                });
            });

        }
    });

}

var detailsPage = null;//文章详情页面结点

// 刷新评论
function refreshReview() {
    let realHeight = document.documentElement.scrollHeight;
    let visionHeight = window.innerHeight;
    let scrollHeight = window.scrollY;
    if (!detailsPage) {
        detailsPage = document.querySelector('.detailsPage');
    }
    console.log(reviewTh);

    if (visionHeight + scrollHeight == realHeight && detailsPage.className.includes('show') && reviewTh) {
        console.log('到底了');
        reviewPages++;
        updateReview(false);
    }
}



// 渲染文章详情信息
function inputPageDetails(article, user, reviews) {
    let { images, title, content, tags, postDate, likes, stars, articleId } = article;
    let { avatar, nickname, userId } = user
    const detailsPage = document.querySelector('.detailsPage');

    // 置顶栏用户信息中的头像
    const userInfoImg = detailsPage.querySelector('.details-user-info').querySelector('img');
    userInfoImg.src = avatar;
    userInfoImg.setAttribute('userId', userId);
    userInfoImg.setAttribute('backPlace', '.detailsPage');
    userInfoImg.onclick = userClick;

    //置顶栏用户信息中昵称
    const userInfoName = detailsPage.querySelector('.details-user-info').querySelector('span');
    userInfoName.textContent = nickname;

    //置顶栏中的关注按钮
    const followBtn = detailsPage.querySelector('.follow');
    followBtn.setAttribute('userId', user.userId);
    followBtn.setAttribute('isFan', isFan);
    followBtn.setAttribute('beFollow', beFollow);
    followBtn.onclick = following.bind(followBtn, detailsPage);

    if (isFan) {
        if (beFollow) {
            followBtn.classList.add('btn-both-fan');
            followBtn.textContent = '互相关注';
        } else {
            followBtn.classList.add('btn-fan');
            followBtn.textContent = '已关注';
        }
    } else {
        followBtn.textContent = '未关注';
    }

    //轮播图图片
    const ul = detailsPage.querySelector('.slide-show').querySelector('ul');
    const ol = detailsPage.querySelector('.slide-show-btn-box');
    if (images.length == 1) {
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.src = images[0];
        li.appendChild(img);
        ul.appendChild(li);
        li = document.createElement('li');
        li.className = 'slide-show-selected';
        ol.appendChild(li);
    } else if (images.length > 1) {
        let fragment = document.createDocumentFragment();
        let li = document.createElement('li');
        let img = document.createElement('img');
        img.src = images[images.length - 1];
        li.appendChild(img);
        fragment.appendChild(li);

        images.forEach(imgSrc => {
            let li = document.createElement('li');
            let img = document.createElement('img');
            img.src = imgSrc;
            li.appendChild(img);
            fragment.appendChild(li);
        });

        li = document.createElement('li');
        img = document.createElement('img');
        img.src = images[0];
        li.appendChild(img);
        fragment.appendChild(li);

        ul.appendChild(fragment);
        ul.classList.add('ul-margin');

        fragment = document.createDocumentFragment();
        for (i = 0; i < images.length; i++) {
            let li = document.createElement('li');
            fragment.appendChild(li);
        }
        fragment.children[0].className = 'slide-show-selected';

        ol.appendChild(fragment);
        slideShowBtn(ul, ol)

        ul.timer = setInterval(automovePublic, 5000);
    }


    // 文章标题
    const articleTitle = detailsPage.querySelector('.article-title');
    articleTitle.textContent = title;

    //文章内容
    const articleBody = detailsPage.querySelector('.article-body');
    articleBody.textContent = content;

    // 文章标签
    const articleTags = detailsPage.querySelector('.article-tags');
    fragment = document.createDocumentFragment();
    tags.forEach(tag => {
        let i = document.createElement('i');
        i.textContent = ' #' + tag;
        fragment.appendChild(i);
    });
    articleTags.appendChild(fragment);

    // 日期
    const date = detailsPage.querySelector('.date');
    if (postDate.substring(5, 6) == '0') {
        postDate = postDate.substring(6, 10);
    } else {
        postDate = postDate.substring(5, 10);
    }
    date.textContent = postDate;

    //评论的数量
    const reviewSum = document.querySelector('.review-num').querySelector('i');
    reviewSum.textContent = reviews.length;
    const bottomBarReviewSum = document.querySelector('.bottom-bar-review').querySelector('span');
    bottomBarReviewSum.textContent = reviews.length;

    //自己的头像
    const useHead = document.querySelector('.review-bar').querySelector('img');
    let myId = localStorage.getItem('userId');
    ajax({
        url: '/user/baseInfo',
        urlParams: {
            userId: myId
        },
        success(data) {
            useHead.src = data.user.avatar;
        }
    });

    // 喜欢
    const like = detailsPage.querySelector('.like');
    like.setAttribute('articleId', articleId);
    console.log(like);
    const likeNum = like.querySelector('span');
    const likeIcon = like.querySelector('i');

    likeNum.textContent = likes;
    if (isLikeArticle) {
        likeIcon.classList.remove('icon-xihuan-xianxing');
        likeIcon.classList.add('icon-xihuan');

        like.setAttribute('isLikeArticle', isLikeArticle);
    } else {
        likeIcon.classList.add('icon-xihuan-xianxing');
        likeIcon.classList.remove('icon-xihuan');

        like.setAttribute('isLikeArticle', isLikeArticle);
    }

    like.onclick = function (e) {
        liking(e, like)
    }

    //收藏
    isStaring(articleId, starCallback)
    function starCallback() {
        const star = detailsPage.querySelector('.collect');
        star.setAttribute('articleId', articleId);
        const starNum = star.querySelector('span');
        const starIcon = star.querySelector('i');

        starNum.textContent = stars;
        if (isStar) {
            starIcon.classList.remove('icon-shoucang');
            starIcon.classList.add('icon-shoucang1');

            star.setAttribute('isStar', isStar);
        } else {
            starIcon.classList.add('icon-shoucang');
            starIcon.classList.remove('icon-shoucang1');

            star.setAttribute('isStar', isStar);
        }

        star.onclick = staring;
    }

    let reviewsNum = reviews.length;
    let reviewCount = 0;
    let reviewFragment = document.createDocumentFragment();
    //评论区
    const reviewBox = document.querySelector('.review-content');

    if (reviewsNum == 0) {
        let reviewEndInfo = document.createElement('div');
        reviewEndInfo.className = 'review-endInfo';
        reviewEndInfo.textContent = '还没有评论哦~';
        reviewBox.appendChild(reviewEndInfo);
    }

    reviews.forEach(review => {
        console.log(review);
        let authorId = review.authorId

        ajax({
            url: '/user/baseInfo',
            urlParams: {
                userId: authorId
            },
            success(data) {
                reviewCount++;
                let user = data.user;
                let secondReview = review.reviewList;

                createReview(review, user, reviewFragment, secondReview, 1);

                if (reviewCount == reviewsNum) {
                    let reviewEndInfo = document.createElement('div');
                    reviewEndInfo.className = 'review-endInfo';
                    reviewEndInfo.textContent = '已经到底了~';
                    reviewFragment.appendChild(reviewEndInfo);

                    reviewTh = true;
                    reviewBox.appendChild(reviewFragment);
                    window.addEventListener('scroll', refreshReview);
                };
            }
        });
    });
}

var likeReview = 0;

// 判断是否喜欢评论
function isLikeReview(reviewId, callback) {
    let userId = localStorage.getItem('userId');
    ajax({
        url: '/user/fullInfo',
        urlParams: {
            userId
        },
        success(data) {
            likeReview = 0;
            let { likedReviews } = data.user;

            likedReviews.forEach(likedReview => {
                if (likedReview == reviewId) {
                    likeReview = 1;
                }
            });

            callback();
        }
    });
}

var likeRwTh = true;//节流阀
// 喜欢评论
function likingReview(e, likeReviewBtn) {
    e.stopPropagation();
    let userId = localStorage.getItem('userId');//拿到自己的Id
    let reviewId = likeReviewBtn.getAttribute('reviewId');//拿到评论的Id
    let likeReview = Number(likeReviewBtn.getAttribute('likeReview'));

    //若已经喜欢该评论，则点击按钮取消喜欢
    if (likeReview) {
        if (likeRwTh) {
            likeRwTh = false;
            ajax({
                type: 'post',
                url: '/review/unlike',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    reviewId
                },
                success(data) {
                    likeRwTh = true;
                    console.log(data);
                    if (data.status == 200) {
                        likeReviewBtn.setAttribute('likeReview', 0);
                        likeReviewBtn.querySelector('.like-num').textContent--;

                        let reviewIcon = likeReviewBtn.querySelector('.like-icon');
                        reviewIcon.classList.add('icon-xihuan-xianxing');
                        reviewIcon.classList.remove('icon-xihuan');
                    }
                }
            });

        }
    } else {
        if (likeRwTh) {
            likeRwTh = false;
            //若还未喜欢该评论，点击按钮喜欢评论
            ajax({
                type: 'post',
                url: '/review/like',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    reviewId
                },
                success(data) {
                    likeRwTh = true;
                    console.log(data);
                    if (data.status == 200) {
                        likeReviewBtn.setAttribute('likeReview', 1);
                        likeReviewBtn.querySelector('.like-num').textContent++;

                        let reviewIcon = likeReviewBtn.querySelector('i');
                        reviewIcon.classList.remove('icon-xihuan-xianxing');
                        reviewIcon.classList.add('icon-xihuan');

                    }
                }
            });

        }
    }

}

// 渲染评论
function createReview(review, user, reviewFragment, secondReview, reviewLevel) {
    let { nickname, avatar, userId } = user;
    let { content, postDate, likes, reviewId, _id } = review;

    if (postDate.substring(5, 6) == '0') {
        postDate = postDate.substring(6, 10);
    } else {
        postDate = postDate.substring(5, 10);
    }

    let item = document.createElement('div');
    if (reviewLevel == 1) {
        item.className = 'review-item';
    } else {
        item.className = 'second-review';
    }

    let userImg = document.createElement('img');
    userImg.src = avatar;
    userImg.setAttribute('backPlace', '.detailsPage');
    userImg.setAttribute('userId', userId);
    userImg.onclick = userClick;
    item.appendChild(userImg);

    let reviewWord = document.createElement('div');
    reviewWord.className = 'review-word';

    item.appendChild(reviewWord);

    const writeReview = document.querySelector('.write-review');//评论输入区
    const reviewMask = document.querySelector('.review-mask');//评论输入区显示时的遮罩层
    const writeReviewInput = document.querySelector('.write-review-input').querySelector('input');//写评论的input表单
    reviewWord.onclick = function () {
        writeReview.classList.add('flex');
        reviewMask.classList.add('show');
        writeReviewInput.focus();
        writeReviewInput.setAttribute('reviewId', reviewId);
        writeReviewInput.placeholder = `回复：${nickname}`;
    }

    let userName = document.createElement('span');//用户昵称
    userName.className = 'userName';
    userName.textContent = nickname;
    reviewWord.appendChild(userName);

    let reviewContent = document.createElement('p');//评论内容
    reviewContent.className = 'review-content';
    reviewContent.textContent = content;
    reviewWord.appendChild(reviewContent);

    let reviewDate = document.createElement('span');//评论日期
    reviewDate.className = 'review-date';
    reviewDate.textContent = postDate;
    if (reviewLevel == 1) {
        reviewWord.appendChild(reviewDate);
    } else {
        reviewContent.appendChild(reviewDate);
    }

    //喜欢盒子
    let like = document.createElement('span');
    like.setAttribute('reviewId', reviewId);
    like.setAttribute('likeReview', likeReview);
    like.className = 'like';
    reviewWord.appendChild(like);

    //喜欢图标
    let likeIcon = document.createElement('i');
    likeIcon.className = 'like-icon iconfont icon-xihuan-xianxing';
    like.appendChild(likeIcon);

    // 喜欢数量
    let likeNum = document.createElement('i');
    likeNum.className = 'like-num';
    likeNum.textContent = likes;
    like.appendChild(likeNum);

    // 判断是否喜欢评论
    isLikeReview(_id, likeReviewCallback);

    function likeReviewCallback() {
        if (likeReview) {
            likeIcon.classList.remove('icon-xihuan-xianxing');
            likeIcon.classList.add('icon-xihuan');

            like.setAttribute('likeReview', likeReview);
        } else {
            likeIcon.classList.add('icon-xihuan-xianxing');
            likeIcon.classList.remove('icon-xihuan');

            like.setAttribute('likeReview', likeReview);
        }


        like.onclick = function (e) {
            likingReview(e, like);
        };
    }

    if (secondReview.length != 0) {
        let secondReviewFragment = document.createDocumentFragment();
        let reviewNum = secondReview.length;
        let reviewCnt = 0;
        secondReview.forEach(review => {
            let authorId = review.authorId

            ajax({
                url: '/user/baseInfo',
                urlParams: {
                    userId: authorId
                },
                success(data) {
                    reviewCnt++;
                    let user = data.user;
                    let secondReview = review.reviewList;

                    createReview(review, user, secondReviewFragment, secondReview, 2);

                    if (reviewCnt == reviewNum) {
                        reviewWord.appendChild(secondReviewFragment);
                    }
                }
            });
        });
    }

    reviewFragment.appendChild(item);
}

//个人中心
// 填入个人中心的相关信息
function fillPersonal(userId) {
    ajax({
        url: '/user/fullInfo',
        urlParams: {
            userId
        },
        success(data) {
            let user = data.user;
            let { avatar, fans, follows, likedArticles, nickname, staredArticles } = user;

            const userInfo = document.querySelector('.person-info');
            //用户头像
            const userImg = userInfo.querySelector('img');
            userImg.src = avatar;
            //用户昵称
            const userName = userInfo.querySelector('h4');
            userName.textContent = nickname;
            //关注数量
            const followNum = document.querySelector('.person-follow').querySelector('i');
            followNum.textContent = follows.length;
            //粉丝数量
            const fanNum = document.querySelector('.person-fan').querySelector('i');
            fanNum.textContent = fans.length;
            //点赞与收藏的数量
            const likeAndStarNum = document.querySelector('.person-likeAndStar').querySelector('i');
            likeAndStarNum.textContent = likedArticles.length + staredArticles.length;

            const personalPage = document.querySelector('.personal');//个人中心页面
            personalPage.style.opacity = '1';
        }
    });
}

// 获取用户的笔记
function getUserPage(authorId, box, pageLocation = '.subject') {
    // targetBox = box;
    ajax({
        url: '/article/byAuthor',
        urlParams: {
            authorId
        },
        success(data) {
            console.log(data);
            productPage(data, pageLocation, box);
        }
    });
}

// 获取用户收藏的笔记
function getStaredPage(userId, box, pageLocation = '.subject') {
    // targetBox = box;
    console.log(box);
    ajax({
        url: '/article/getStar',
        urlParams: {
            userId
        },
        success(data) {
            console.log(data);
            productPage(data, pageLocation, box);
        }
    });
}

// 获取用户喜欢的笔记
function getLikePage(userId, box, pageLocation = '.subject') {
    // targetBox = box;
    ajax({
        url: '/article/getLike',
        urlParams: {
            userId
        },
        success(data) {
            console.log(data);
            productPage(data, pageLocation, box);
        }
    });

}

//用户列表页
//获得关注的人（插入到哪个盒子，用户的ID）
function getFollowUser(box, userId) {
    ajax({
        url: '/user/followerList',
        urlParams: {
            userId
        },
        success(data) {
            produceUser(box, data.followsList, '.userlist-Page');
            const userlistPage = document.querySelector('.userlist-Page');
            const loading = document.querySelector('.loading');
            const userFollow = document.querySelector('.user-follow');//用户关注
            clearTimeout(box.timer);
            clearTimeout(userFollow.timer);
            userlistPage.classList.add('show');
            loading.classList.remove('show');
        }
    });
}

// 获取粉丝列表
function getFans(box, userId) {
    ajax({
        url: '/user/fanList',
        urlParams: {
            userId
        },
        success(data) {
            produceUser(box, data.fansList, '.userlist-Page');
            const userlistPage = document.querySelector('.userlist-Page');
            const loading = document.querySelector('.loading');
            const userFan = document.querySelector('.user-fan');//用户粉丝
            clearTimeout(box.timer);
            clearTimeout(userFan.timer);
            userlistPage.classList.add('show');
            loading.classList.remove('show');
        }
    });
}

// 获取能够发私信的用户列表
function getChatUser(box, userId, pageLocation) {
    let chatUser = [];
    let index = 0;

    ajax({
        url: '/user/followerList',
        urlParams: {
            userId
        },
        success(data) {
            let followers = data.followsList;

            ajax({
                url: '/user/fanList',
                urlParams: {
                    userId
                },
                success(data) {
                    let fans = data.fansList;

                    followers.forEach(follower => {
                        fans.forEach(fan => {
                            if (follower.userId == fan.userId) {
                                chatUser[index] = fan;
                                index++;
                            }
                        });
                    });

                    produceChatUser(box, chatUser, pageLocation)
                }
            });
        }
    });

}

//生成可以聊天的用户
function produceChatUser(box, users, pageLocation) {

    if (users.length == 0) {
        // 创建p标签，显示提示信息
        let noInfo = document.createElement('p');
        noInfo.className = 'endInfo pa';
        noInfo.textContent = '没有更多了~';
        box.appendChild(noInfo);
        // 结束函数调用
        return;
    }

    let userNum = users.length;
    let chatFragment = document.createDocumentFragment();
    let cnt = 0;

    users.forEach(user => {
        inputChatUser(user, chatFragment, pageLocation);
        cnt++;

        if (cnt == userNum) {
            // 创建底部的提示信息
            let p = document.createElement('p');
            p.className = `endUserInfo`;
            p.textContent = '已经到底了~';
            chatFragment.appendChild(p);

            // 将文档片段插入
            box.appendChild(chatFragment);
        }

    })
}

// 插入可以聊天的用户
function inputChatUser(user, chatFragment, pageLocation) {
    // 解构拿到相关信息
    let { avatar, nickname, userId } = user;

    // 最大的盒子
    let userItem = document.createElement('div');
    userItem.className = 'user-item';
    userItem.setAttribute('userId', userId);
    userItem.setAttribute('avatar', avatar);
    userItem.setAttribute('nickname', nickname);
    userItem.setAttribute('backPlace', pageLocation);
    userItem.onclick = chatting;

    // 用户信息盒子
    let userInfo = document.createElement('div');
    userItem.appendChild(userInfo);

    // 用户头像
    let img = document.createElement('img');
    img.src = avatar;
    img.onclick = function (e) {
        e.stopPropagation();
        userClick(userId, pageLocation);
    };
    userInfo.appendChild(img);

    // 装文字的盒子
    let span = document.createElement('span');
    userInfo.appendChild(span);

    // 名字
    let h4 = document.createElement('h4');
    h4.textContent = nickname;
    span.appendChild(h4);

    let chatArrow = document.createElement('div');
    chatArrow.className = 'userAndPage-details';
    userItem.appendChild(chatArrow);

    // item盒子插入文本片段
    chatFragment.appendChild(userItem);
}

var socket = null;
var connect = false;
// 点击进入聊天界面的事件
function chatting() {
    if (connect) {
        const chatUserName = document.querySelector('.chat-user-name');//聊天页面中聊天对象的名字
        const chatPageBack = document.querySelector('.chat-page-back');//聊天页面中的返回按钮
        const chatPage = document.querySelector('.chat-page');//聊天页面
        const msgArea = document.querySelector('.msg-area');//展示信息的区域
        const messageContent = document.querySelector('.message-content');//发送信息的表单
        const sendMessage = document.querySelector('.send-message');//发送信息的按钮
        const loading = document.querySelector('.loading');//加载页面
        loading.classList.add('show');

        chatRefreshPage = 2;
        chatRefreshTh = true;
        // const socketChat = io.connect('ws://175.178.193.182:8080/chat');
        // socketChat.on('message', (data) => {
        //     console.log(data);
        // });

        msgArea.textContent = '';

        let backPlace = this.getAttribute('backPlace');
        let ownUserId = localStorage.getItem('userId');
        let userId = this.getAttribute('userId');
        let avatar = this.getAttribute('avatar');
        let nickname = this.getAttribute('nickname');
        document.querySelector(backPlace).classList.remove('show');

        // 监听滚动事件，以便刷新聊天数据
        window.onscroll = function () {
            chatRefresh(ownUserId, userId, avatar);
        }

        // 输入时回到底部
        messageContent.onclick = function () {
            let realHeight = document.documentElement.scrollHeight;
            let visionHeight = window.innerHeight;
            let scrollY = window.scrollY;
            let scrollHeight = realHeight - visionHeight;

            if (scrollY != scrollHeight) {
                window.scroll(0, scrollHeight);
            }
        }

        //上线实时聊天
        socket.emit('online', Number(ownUserId));

        socket.off('receive-message');
        socket.on('receive-message', reMsg);

        function reMsg(res) {
            let chatMsgEnd = msgArea.querySelector('.chat-msg-end');
            if (chatMsgEnd) {
                msgArea.removeChild(chatMsgEnd);
            }
            inputChatData(res, ownUserId, userId, avatar, msgArea);
            let realHeight = document.documentElement.scrollHeight;
            let visionHeight = window.innerHeight;
            let scrollHeight = realHeight - visionHeight;

            window.scroll(0, scrollHeight);
        }

        // 发消息
        sendMessage.onclick = function () {
            let chatMsgEnd = msgArea.querySelector('.chat-msg-end');
            if (chatMsgEnd) {
                msgArea.removeChild(chatMsgEnd);
            }

            let value = messageContent.value;

            if (value != '') {
                loading.classList.add('show');
                // 传统发消息
                ajax({
                    type: 'post',
                    url: '/chat/send',
                    headerProperty: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        userId: ownUserId,
                        receiverId: userId,
                        message: value
                    },
                    success(data) {
                        let record = data.newMessage;
                        inputChatData(record, ownUserId, userId, avatar, msgArea);
                        loading.classList.remove('show');

                        let realHeight = document.documentElement.scrollHeight;
                        let visionHeight = window.innerHeight;
                        let scrollHeight = realHeight - visionHeight;

                        window.scroll(0, scrollHeight);
                    }
                });

                // 实时聊天发消息
                socket.emit('send-message', {
                    userId: Number(ownUserId),
                    receiverId: Number(userId),
                    message: value
                });

                messageContent.value = '';
            }
        }

        // 发私信页面返回按钮
        chatPageBack.onclick = function () {
            document.querySelector(backPlace).classList.add('show');
            chatPage.classList.remove('show');
        }

        chatUserName.textContent = nickname;

        // 获取聊天数据
        getChatData(ownUserId, userId, avatar, msgArea);

        chatPage.classList.add('show');

        loading.classList.remove('show');
    }
}

let chatScroll;//页面滚动的距离
var chatRefreshPage = 2;//页数
var chatRefreshTh = true;//节流阀
// 聊天页面刷新
function chatRefresh(userId, receiverId, avatar) {
    const msgArea = document.querySelector('.msg-area');//显示信息的页面
    const chats = msgArea.querySelectorAll('.msg-Item ');//以显示的信息
    const loading = document.querySelector('.loading');//加载页面
    chatScroll = window.scrollY;

    if (chatScroll == 0 && chatRefreshTh) {
        loading.classList.add('show');
        chatRefreshTh = false;
        console.log(chatRefreshPage);
        ajax({
            url: '/chat/getRecord',
            urlParams: {
                userId,
                receiverId,
                page: chatRefreshPage
            },
            success(data) {
                console.log(data);
                if (data.status == 200) {
                    let records = data.newRecord;
                    let fragment = document.createDocumentFragment();

                    if (records.length == 0) {
                        loading.classList.remove('show');
                        return;
                    }

                    ajax({
                        url: '/user/baseInfo',
                        urlParams: {
                            userId
                        },
                        success(data) {
                            chatRefreshPage++;
                            chatRefreshTh = true
                            let ownAvatar = data.user.avatar;
                            records.forEach(record => {
                                inputChatData(record, userId, receiverId, avatar, fragment, ownAvatar);
                            });

                            msgArea.insertBefore(fragment, chats[0]);
                            loading.classList.remove('show');

                        }
                    });

                }
            }
        });
    }
}

// 获取聊天数据
function getChatData(ownUserId, userId, avatar, box) {
    ajax({
        url: '/chat/getRecord',
        urlParams: {
            userId: Number(ownUserId),
            receiverId: Number(userId),
            page: 1
        },
        success(data) {
            console.log(data);
            if (data.status == 200) {
                let records = data.newRecord;
                let fragment = document.createDocumentFragment();

                if (records.length == 0) {
                    let endInfo = document.createElement('p');
                    endInfo.className = 'chat-msg-end';
                    endInfo.textContent = '尚没有聊天记录';
                    box.appendChild(endInfo);
                    return;
                }

                ajax({
                    url: '/user/baseInfo',
                    urlParams: {
                        userId: ownUserId
                    },
                    success(data) {
                        let ownAvatar = data.user.avatar;
                        records.forEach(record => {
                            inputChatData(record, ownUserId, userId, avatar, fragment, ownAvatar);
                        });


                        box.appendChild(fragment);

                        let realHeight = document.documentElement.scrollHeight;
                        let visionHeight = window.innerHeight;
                        let scrollHeight = realHeight - visionHeight;
                        window.scroll(0, scrollHeight);

                    }
                });

            }
        }
    });
}

// 插入聊天数据
function inputChatData(record, ownUserId, userId, avatar, fragment, ownAvatar) {
    let msgItem = document.createElement('div');
    msgItem.className = 'msg-Item clearfix';

    let msgInfo = document.createElement('div');
    msgInfo.className = 'msg-info';
    msgItem.appendChild(msgInfo);

    let img = document.createElement('img');

    let msgContent = document.createElement('div');
    msgContent.className = 'msg-content';
    msgContent.textContent = record.message;

    if (record.userId == userId) {
        msgInfo.classList.add('other');
        img.src = avatar;
        img.setAttribute('userId', userId);
        img.setAttribute('backPlace', '.chat-page');
        img.onclick = userClick

        msgInfo.appendChild(img);
        msgInfo.appendChild(msgContent);
    } else {
        msgInfo.classList.add('owner');
        if (ownAvatar) {
            img.src = ownAvatar;
        } else {
            ajax({
                url: '/user/baseInfo',
                urlParams: {
                    userId: ownUserId
                },
                success(data) {
                    img.src = data.user.avatar;

                }
            });

        }

        img.setAttribute('userId', ownUserId);
        img.setAttribute('backPlace', '.chat-page');
        img.onclick = userClick

        msgInfo.appendChild(msgContent);
        msgInfo.appendChild(img);
    }

    fragment.appendChild(msgItem);
}

// 获取喜欢的文章
function gettingLike(box, userId) {
    box.textContent = '';
    ajax({
        url: '/notice/article/like',
        urlParams: {
            userId
        },
        success(data) {
            let type = 1;//判断是获赞还是收藏
            let likes = data.like;
            let likesNum = likes.length;
            let likesCount = 0;
            let UserAndPageFragment = document.createDocumentFragment();
            likes.forEach(like => {
                produceUserAndPage(like, UserAndPageFragment, type);
                likesCount++;
            });

            if (likesCount == likesNum) {
                box.appendChild(UserAndPageFragment);

                const userList = document.querySelector('.userlist');//显示用户列表的盒子
                const loading = document.querySelector('.loading');
                const nowPage = userList.querySelector('.getLike');
                const likeAndStar = document.querySelector('.user-likeAndStar');
                clearTimeout(nowPage.timer);
                clearTimeout(likeAndStar.timer);
                loading.classList.remove('show');
                nowPage.classList.add('show');
            }
        }
    });
}

// 获得收藏的文章
function gettingStar(box, userId) {
    box.textContent = '';

    ajax({
        url: '/notice/article/star',
        urlParams: {
            userId
        },
        success(data) {
            let type = 0;//判断是获赞还是收藏
            let stars = data.star;
            let starsNum = stars.length;
            let starsCount = 0;
            let UserAndPageFragment = document.createDocumentFragment();
            stars.forEach(star => {
                produceUserAndPage(star, UserAndPageFragment, type);
                starsCount++;
            });

            if (starsCount == starsNum) {
                box.appendChild(UserAndPageFragment);

                const userList = document.querySelector('.userlist');//显示用户列表的盒子
                const loading = document.querySelector('.loading');
                const nowPage = userList.querySelector('.getStared');
                const likeAndStar = document.querySelector('.user-likeAndStar');
                clearTimeout(likeAndStar.timer);
                clearTimeout(nowPage.timer)
                loading.classList.remove('show');
                nowPage.classList.add('show');
            }

        }
    });
}

// 获得收到的评论
function gettingReview(box, userId) {
    box.content = '';

    ajax({
        url: '/notice/comment',
        urlParams: {
            userId
        },
        success(data) {
            let type = 2;//判断是获赞还是收藏,还是评论
            let reviews = data.like;
            let reviewsNum = reviews.length;
            let reviewsCount = 0;
            let UserAndPageFragment = document.createDocumentFragment();
            reviews.forEach(review => {
                produceUserAndPage(review, UserAndPageFragment, type);
                reviewsCount++;
            });

            if (reviewsCount == reviewsNum) {
                box.appendChild(UserAndPageFragment);
            }

        }

    });
}

// 生成左用户、右文章这种格式的盒子
function produceUserAndPage(info, fragment, type) {
    console.log(info);
    let userAndPage = document.createElement('div');
    userAndPage.className = 'userAndPage';

    let userAndPageLeft = document.createElement('div');
    userAndPageLeft.className = 'userAndPage-left';
    userAndPage.appendChild(userAndPageLeft);

    let leftImg = document.createElement('img');
    leftImg.src = info.userInfo.avatar;
    leftImg.setAttribute('userId', info.userInfo.userId);
    leftImg.setAttribute('backPlace', '.userlist-Page');
    leftImg.onclick = userClick;
    userAndPageLeft.appendChild(leftImg);

    let userAndPageInfo = document.createElement('div');
    userAndPageInfo.className = 'userAndPage-info';
    userAndPageLeft.appendChild(userAndPageInfo);

    let h4 = document.createElement('h4');
    h4.textContent = info.userInfo.nickname;
    userAndPageInfo.appendChild(h4);

    let p = document.createElement('p');
    if (type) {
        if (type == 1) {
            p.textContent = '赞了你的笔记';
        } else {
            if (info.reviews.parentReviewId) {
                p.textContent = '回复了你的的评论';
            } else {
                p.textContent = '评论了你的的笔记';
            }
        }
    } else {
        p.textContent = '收藏了你的笔记';
    }
    userAndPageInfo.appendChild(p);

    let userAndPageRight = document.createElement('div');
    userAndPageRight.className = 'userAndPage-right';
    userAndPageRight.setAttribute('articleId', info.articleInfo.articleId);
    userAndPage.appendChild(userAndPageRight);

    let rightImg = document.createElement('img');
    rightImg.src = info.articleInfo.images[0];
    rightImg.setAttribute('pageLocation', '.userlist-Page');
    rightImg.setAttribute('articleId', info.articleInfo.articleId);

    ajax({
        url: '/article/byId',
        urlParams: {
            articleId: info.articleInfo.articleId
        },
        success(data) {
            if (data.status == 200) {
                rightImg.setAttribute('authorId', data.article.authorId);
                rightImg.onclick = showingDetails;
            }
        }
    });

    userAndPageRight.appendChild(rightImg);

    let userAndPageDetails = document.createElement('div');
    userAndPageDetails.className = 'userAndPage-details';
    userAndPageRight.appendChild(userAndPageDetails);

    fragment.appendChild(userAndPage);
}

// 编辑信息
function editingData() {
    let userId = localStorage.getItem('userId');
    const contentBox = document.getElementById(this.id).querySelector('.content');//该编辑栏的内容区
    const editBox = document.querySelector('.edit-box');//输入信息区
    const confirm = editBox.querySelector('.confirm');//确定按钮
    const mask = document.querySelector('.edit-mask');//遮罩层
    const editError = document.querySelector('.edit-error');//错误信息
    let formData = new FormData();
    let contentName = this.id;
    formData.append('userId', userId);

    confirm.addEventListener('click', fn);


    function fn() {
        confirm.removeEventListener('click', fn);
        editBox.classList.remove('show');
        mask.classList.remove('show');
        const editInput = document.querySelector('.edit-input');
        let content = editInput.value;
        formData.append(contentName, content);

        switch (contentName) {
            case 'gender':
                if (content != '男' && content != '女') {
                    console.log(1);
                    error();
                    return;
                }
                break;
            case 'birthday':
                if (!/^\d{4}[-]\d{2}[-]\d{2}$/.test(content)) {
                    error();
                    return;
                }
                break;
            case 'area':
                if (!/^[\u4e00-\u9fa5]+[\s][\u4e00-\u9fa5]+$/.test(content)) {
                    error();
                    return;
                }
                break;
        }

        ajax({
            type: 'post',
            url: '/user/edit',
            headerProperty: {
                'Content-Type': ''
            },
            body: {
                formData
            },
            success(data) {
                if (data.status == 200) {
                    contentBox.textContent = content;
                    editInput.value = '';
                    localStorage.setItem(contentName, content);
                } else {
                    editError.classList.add('show');
                    mask.classList.add('show');
                    editError.textContent = data.msg;

                    setTimeout(() => {
                        editError.classList.remove('show');
                        mask.classList.remove('show');
                        editError.textContent = '输入格式错误';
                    }, 2000);
                }
            }
        });
    }

    function error() {
        editError.classList.add('show');
        mask.classList.add('show');

        setTimeout(() => {
            editError.classList.remove('show');
            mask.classList.remove('show');
        }, 2000);

    }
}

// 关注的人点击事件
function followClicking(userId, backPlace = '.subject') {
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const userList = document.querySelector('.userlist');//显示用户列表的盒子
    const userlistTab = document.querySelector('.userlist-tab');//用户列表页的获赞与收藏页面的tab栏

    userlistPage.setAttribute('backPlace', backPlace);
    document.querySelector(backPlace).classList.remove('show');
    userList.textContent = '';
    userlistTab.textContent = ''
    getFollowUser(userList, userId);
    userlistPage.querySelector('.userlist-shortcut').querySelector('h2').textContent = '关注的人';
}

//粉丝点击事件
function fanClicking(userId, backPlace = '.subject') {
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const userList = document.querySelector('.userlist');//显示用户列表的盒子
    const userlistTab = document.querySelector('.userlist-tab');//用户列表页的获赞与收藏页面的tab栏

    userlistPage.setAttribute('backPlace', backPlace);
    document.querySelector(backPlace).classList.remove('show');
    userList.textContent = '';
    userlistTab.textContent = ''
    getFans(userList, userId);
    userlistPage.querySelector('.userlist-shortcut').querySelector('h2').textContent = '粉丝';
}

//收到的评论点击事件
function reviewClicking(userId, backPlace = '.subject') {
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const userList = document.querySelector('.userlist');//显示用户列表的盒子
    const userlistTab = document.querySelector('.userlist-tab');//用户列表页的获赞与收藏页面的tab栏

    userlistPage.setAttribute('backPlace', backPlace);
    document.querySelector(backPlace).classList.remove('show');
    userList.textContent = '';
    userlistTab.textContent = ''
    gettingReview(userList, userId);
    userlistPage.querySelector('.userlist-shortcut').querySelector('h2').textContent = '收到的评论和@';
    userlistPage.classList.add('show');
}

// 创建聊天点击事件
function chatClicking(userId, backPlace = '.subject') {
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const userList = document.querySelector('.userlist');//显示用户列表的盒子
    const userlistTab = document.querySelector('.userlist-tab');//用户列表页的获赞与收藏页面的tab栏

    userlistPage.setAttribute('backPlace', backPlace);
    document.querySelector(backPlace).classList.remove('show');
    userList.textContent = '';
    userlistTab.textContent = ''
    getChatUser(userList, userId, '.userlist-Page');
    userlistPage.querySelector('.userlist-shortcut').querySelector('h2').textContent = '发私信';
    userlistPage.classList.add('show');
}

//点赞与收藏点击事件
function likeAndStarClicking(userId, backPlace = '.subject') {
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const userList = document.querySelector('.userlist');//显示用户列表的盒子
    const userlistTab = document.querySelector('.userlist-tab');//用户列表页的获赞与收藏页面的tab栏

    userlistPage.setAttribute('backPlace', backPlace);
    document.querySelector(backPlace).classList.remove('show');
    userlistTab.textContent = '';
    userList.textContent = '';
    userlistPage.querySelector('.userlist-shortcut').querySelector('h2').textContent = '获赞与收藏';

    let li1 = document.createElement('li');
    li1.className = 'tab-nav-selected';
    li1.textContent = '获赞';
    li1.onclick = function () {
        const preShow = userList.querySelector('.show');
        const nowShow = userList.querySelector('.getLike');
        if (preShow == nowShow) {
            return;
        }

        nowShow.timer = setTimeout(() => {
            const loading = document.querySelector('.loading');
            loading.classList.add('show');

        }, 500);
        gettingLike(getLike, userId);
        userlistTab.querySelector('.tab-nav-selected').classList.remove('tab-nav-selected');
        this.className = 'tab-nav-selected';
        preShow.classList.remove('show');
    }
    userlistTab.appendChild(li1);

    let li2 = document.createElement('li');
    li2.textContent = '收藏';
    li2.onclick = function () {
        const preShow = userList.querySelector('.show');
        const nowShow = userList.querySelector('.getStared');
        if (preShow == nowShow) {
            return;
        }

        nowShow.timer = setTimeout(() => {
            const loading = document.querySelector('.loading');
            loading.classList.add('show');

        }, 500);

        gettingStar(getStared, userId);
        userlistTab.querySelector('.tab-nav-selected').classList.remove('tab-nav-selected');
        this.className = 'tab-nav-selected';
        preShow.classList.remove('show');
    }
    userlistTab.appendChild(li2);

    let getLike = document.createElement('div');
    getLike.className = 'getLike';
    getLike.classList.add('show');
    userList.appendChild(getLike);

    gettingLike(getLike, userId);

    let getStared = document.createElement('div');
    getStared.className = 'getStared';
    userList.appendChild(getStared);

    userlistPage.classList.add('show');

}


//用户中心点击事件
var otherUserId
function userClick(userId, pageLocation) {
    if (!socket) {
        socket = io('ws://175.178.193.182:8080/chat');
        socket.on('connect', () => {
            console.log('chat连接成功');
            console.log(socket.id);
            connect = true;
        });

    }

    if (/\d+/.test(userId)) {
        otherUserId = userId;
    } else {
        otherUserId = this.getAttribute('userId');
    }

    const userShow = document.querySelector('.user-show');//用户中心文章展示区
    const userTabs = userShow.querySelectorAll('li');//用户中心tab标签
    const userHome = document.querySelector('.user-home');//用户中心主页
    const userFollow = document.querySelector('.user-follow');//用户关注
    const userFan = document.querySelector('.user-fan');//用户粉丝
    const userLikeAndStar = document.querySelector('.user-likeAndStar');//点赞与收藏
    const userBack = document.querySelector('.user-back');//用户页面返回按钮
    const loading = document.querySelector('.loading');//加载页面

    let locationClass;
    if (pageLocation) {
        locationClass = pageLocation;
    } else {
        locationClass = this.getAttribute('backPlace');
    }
    let backPlace = document.querySelector(locationClass);//原来的页面

    userBack.onclick = function () {
        userHome.classList.remove('show');
        document.querySelector('.subject').classList.add('show');
        const mainPages = document.querySelector('.subject').querySelectorAll('section');//主页面中的三个页面，首页、我的消息、个人中心
        mainPages.forEach(mainPage => {
            mainPage.classList.remove('show');
        });
        let id = document.querySelector('.tab').querySelector('.tab-selected').id;
        document.querySelector(`.${id}`).classList.add('show');
    }

    backPlace.classList.remove('show');
    loading.classList.add('show');

    userFollow.onclick = function () {
        userFollow.timer = setTimeout(() => {
            loading.classList.add('show');
        }, 500);
        followClicking(otherUserId, '.user-home');
    }

    userFan.onclick = function () {
        userFan.timer = setTimeout(() => {
            loading.classList.add('show');
        }, 500);

        fanClicking(otherUserId, '.user-home');
    }

    userLikeAndStar.onclick = function () {
        userLikeAndStar.timer = setTimeout(() => {
            loading.classList.add('show');
        }, 500);
        likeAndStarClicking(otherUserId, '.user-home');
    }

    userTabs.forEach(tab => {
        tab.onclick = function () {
            userShow.querySelector('.tab-nav-selected').classList.remove('tab-nav-selected');
            this.className = 'tab-nav-selected';

            const preShow = userShow.querySelector('.show');
            const pageShowBox = userShow.querySelector(`.${this.id}`);
            if (preShow == pageShowBox) {
                return;
            }
            const loading = document.querySelector('.loading');

            loading.classList.add('show');
            preShow.classList.remove('show');
            pageShowBox.textContent = '';
            pageShowBox.classList.add('show');
            console.log(pageShowBox);
            pageShowBox.style.opacity = '0';

            let type = this.id;
            switch (type) {
                case 'note-page':
                    getUserPage(otherUserId, pageShowBox, '.user-home');
                    break;
                case 'collect-page':
                    getStaredPage(otherUserId, pageShowBox, '.user-home');
                    break;
                case 'like-page':
                    getLikePage(otherUserId, pageShowBox, '.user-home');
                    break;
            }
        }
    });


    const notePage = userShow.querySelector('.note-page');
    const preShow = userShow.querySelector('.show');

    if (notePage != preShow) {
        userShow.querySelector('.tab-nav-selected').classList.remove('tab-nav-selected');
        userTabs[0].classList.add('tab-nav-selected');
        preShow.classList.remove('show');
        notePage.classList.add('show');
    }
    notePage.textContent = '';
    notePage.style.opacity = '0';

    fillUser(otherUserId);
    getUserPage(otherUserId, notePage, '.user-home');
}

// 填写用户中心的信息
function fillUser(userId) {
    ajax({
        url: '/user/fullInfo',
        urlParams: {
            userId
        },
        success(data) {
            let user = data.user;
            let { avatar, fans, follows, likedArticles, nickname, staredArticles } = user;

            const userChat = document.querySelector('.user-chat');//用户主页发消息按钮
            userChat.setAttribute('backPlace', '.user-home');
            userChat.setAttribute('userId', userId);
            userChat.setAttribute('avatar', avatar);
            userChat.setAttribute('nickname', nickname);

            isFanOrBothFan(userId, callback);
            const userHome = document.querySelector('.user-home');
            userHome.classList.add('show');

            function callback() {
                if (isFan == 1 && beFollow == 1) {
                    userChat.onclick = chatting;
                } else {
                    userChat.onclick = function () {
                        let error = document.createElement('div');
                        error.textContent = '没有互相关注';
                        error.className = 'noBothFan';
                        const userHome = document.querySelector('.user-home');
                        userHome.appendChild(error);
                        error.classList.add('show');

                        setTimeout(() => {
                            error.classList.remove('show');
                        }, 2000);
                    }
                }
            }

            const userInfo = document.querySelector('.user-home-info');
            //用户头像
            const userImg = userInfo.querySelector('img');
            userImg.src = avatar;
            console.log(userImg);
            //用户昵称
            const userName = userInfo.querySelector('h4');
            userName.textContent = nickname;
            console.log(userName);
            //关注数量
            const followNum = document.querySelector('.user-follow').querySelector('i');
            followNum.textContent = follows.length;
            //粉丝数量
            const fanNum = document.querySelector('.user-fan').querySelector('i');
            fanNum.textContent = fans.length;
            //点赞与收藏的数量
            const likeAndStarNum = document.querySelector('.user-likeAndStar').querySelector('i');
            likeAndStarNum.textContent = likedArticles.length + staredArticles.length;
        }
    });
}

