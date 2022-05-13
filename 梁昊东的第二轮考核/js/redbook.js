document.addEventListener('DOMContentLoaded', function () {
    //获取元素
    let btn = document.querySelector('.btn');//登录按钮
    let form = document.getElementById('form');//登录表单域
    let un = document.querySelector('.un');//用户名输入框
    let pwd = document.querySelector('.pwd');//密码输入框
    let inputInfo = document.querySelector('.input_info');//输入错误提示信息
    let login = document.querySelector('.login');//登陆界面
    let home = document.querySelector('.home');//首页界面
    let tabs = document.querySelector('.tab-nav').querySelectorAll('li');//tab标签
    let subject = document.querySelector('.subject');//主页面
    let main = document.querySelectorAll('.main');//首页的主体区域
    const bottom = document.querySelector('.tab')//主页底部栏
    const bottomTab = bottom.querySelectorAll('li');//主页底部的切换按钮
    let publishImgBtn = document.querySelector('.upload-img');//上传图片的按钮
    let upload = document.getElementById('upload')//上传图片的表单;
    let publishBack = document.querySelector('.publish-back');//上传文章页面返回按钮
    let publish = document.querySelector('.publish');//上传文章页面
    let release = document.querySelector('.release');//主页面中进入上传文章页面的按钮
    let publishImgArea = document.querySelector('.publish-img-area');//上传图片的区域
    let theme = document.querySelector('.theme');//添加话题的按钮
    let writeThemeBox = document.querySelector('.write-theme-box');//装填写话题区域的盒子
    let confirm = document.getElementById('confirm');//确认添加话题的按钮
    let cancel = document.getElementById('cancel');//取消添加话题的按钮
    let themeName = document.getElementById('themeName');//话题的输入框
    let themeArea = document.querySelector('.theme-area');//显示话题的区域
    let publishBtn = document.querySelector('.publish-btn');//发布笔记的按钮
    let pageTitle = document.querySelector('.page-title');//文章标题输入框
    let push = document.getElementById('push');//推荐页
    const searchBack = document.querySelector('.search-back');//搜索页面返回按钮
    const search = document.querySelector('.search');//搜索页面
    const homeSearchBtn = document.querySelector('.home-search-btn');//主页的搜索按钮
    const searchInput = document.querySelector('.search-input');//搜索页的搜索框
    const searchNav = document.querySelector('.search-nav');//搜索页面的导航栏
    const searchNavLi = document.querySelector('.search-nav').querySelectorAll('li');//搜索页面的导航栏的标签
    const searchBtn = document.querySelector('.search-btn');//搜索页面的搜索按钮
    const resultPage = document.getElementById('result-page');//文章搜索结果
    const resultUser = document.querySelector('.result-user');//用户搜索结果
    const slideShow = document.querySelector('.slide-show');//轮播图的盒子
    const slideShowOl = document.querySelector('.slide-show-btn-box');//轮播图的按钮
    const writeReviewInput = document.querySelector('.write-review-input').querySelector('input');//书写评论的输入框
    const sendReviewBtn = document.querySelector('.send-review-btn');//发送评论的按钮
    const bottomReviewBar = document.querySelector('.bottom-review-bar');//详情页底部的通栏的输入框
    const writeReview = document.querySelector('.write-review');//评论输入区
    const reviewMask = document.querySelector('.review-mask');//评论输入区显示时的遮罩层
    const reviewInput = document.querySelector('.review-input');//评论区顶部的输入框
    const mainPages = document.querySelector('.subject').querySelectorAll('section');//主页面中的三个页面，首页、我的消息、个人中心
    const personShow = document.querySelector('.person-show');//个人主页的文章展示区
    const personTabs = personShow.querySelectorAll('li');//个人主页的tab标签
    const personal = document.getElementById('personal');//个人主页按钮
    const outLogin = document.querySelector('.out-login');//退出登录按钮
    const personalPage = document.querySelector('.personal');//个人中心页面
    const userlistBack = document.querySelector('.userlist-back');//用户列表页的返回按钮
    const userlistPage = document.querySelector('.userlist-Page');//用户列表页页面
    const personFollow = document.querySelector('.person-follow');//个人中心关注的人按钮
    const personFan = document.querySelector('.person-fan');//个人中心粉丝按钮;
    const personLikeAndStar = document.querySelector('.person-likeAndStar');//个人中心点赞与收藏按钮
    const personData = document.querySelector('.person-data');//编辑资料按钮
    const editBack = document.querySelector('.edit-back');//编辑资料页面返回按钮
    const userEdit = document.querySelector('.user-edit');//编辑资料页面
    const userAvatar = document.querySelector('.edit-user-avatar').querySelector('img');//编辑用户界面的头像
    const avatarPic = document.querySelector('.avatar-pic');//上传头像的file表单
    const nameContent = document.querySelector('.name-content');//编辑资料中显示名字的盒子
    const editArea = document.querySelector('.edit-area');//编辑信息的区域
    const editBox = document.querySelector('.edit-box');//输入编辑信息的盒子
    const editMask = document.querySelector('.edit-mask');//编辑信息页面的遮罩层
    const editBoxCancel = editBox.querySelector('.cancel');//编辑信息取消输入按钮
    const editInput = document.querySelector('.edit-input');//编辑信息输入的表单
    const editBar = document.querySelectorAll('.edit-bar');//所有编辑栏
    const userBackGroundPicture = document.querySelector('.user-backGroundPicture');//上传背景图
    const BackGroundImg = userBackGroundPicture.querySelector('img');//背景图片
    const uploadBackgroundImg = document.querySelector('.upload-background-img');//上传背景图片的表单
    const msgLikeAndStar = document.querySelector('.msg-likeAndStar');//我的消息赞与收藏
    const msgFollow = document.querySelector('.msg-follow');//我的消息新增关注
    const msgReview = document.querySelector('.msg-review');//我的消息收到的评论
    const newChat = document.querySelector('.new-chat');//创建聊天按钮
    const messageContent = document.querySelector('.message-content');//聊天消息输入表单
    const sendMessage = document.querySelector('.send-message');//发送消息按钮
    const myMessageBtn = document.getElementById('myMessage');//切换我的消息页面的按钮
    const chatList = document.querySelector('.chat-list');//聊天列表
    const loading = document.querySelector('.loading');

    // 判断登陆状态
    (function () {
        let userId = localStorage.getItem('userId');
        loading.classList.add('show');

        if (!userId) {
            loading.classList.remove('show');
            login.classList.add('show');
            return;
        }
        ajax({
            url: '/getLoginStatus',
            urlParams: {
                userId
            },
            success(data) {
                if (data.result === 0) {
                    subject.classList.add('show');

                    getPage('推荐', main[0]);

                    //显示推荐页
                    push.classList.add('show');
                    push.style.opacity = '0';
                } else {
                    loading.classList.remove('show');
                    login.classList.add('show');
                }
            }
        });
    })();


    //登录页面
    // 给登录按钮添加点击事件
    btn.onclick = function () {
        loading.classList.add('show');

        let formData = new FormData(form);
        ajax({
            type: 'post',
            url: '/login',
            body: {
                formData
            },
            headerProperty: {
                'Content-Type': '',
            },
            success(data) {
                if (data.status == 400) {
                    //添加错误时，表单的样式
                    un.classList.add('input_error');
                    pwd.classList.add('input_error');

                    //错误是提示信息的样式和内容
                    inputInfo.textContent = data.msg;
                    inputInfo.classList.add('icon-cuowu');
                    inputInfo.classList.add('iconfont');
                    loading.classList.remove('show');
                } else if (data.status == 200) {
                    loading.classList.remove('show');
                    localStorage.setItem('userId', data.userId);
                    // 错误信息清除
                    inputInfo.textContent = '';
                    inputInfo.classList.remove('icon-cuowu');
                    inputInfo.classList.remove('iconfont');
                    un.classList.remove('input_error');
                    pwd.classList.remove('input_error');


                    //成功时进入首页
                    login.classList.remove('show');
                    loading.classList.add('show');
                    subject.classList.add('show');
                    home.classList.add('show');
                    bottom.querySelector('.tab-selected').classList.remove('tab-selected');
                    bottomTab[0].classList.add('tab-selected');

                    //显示推荐页
                    push.classList.add('show');
                    push.style.opacity = '0';

                    //进入首页，发起获取文章请求
                    getPage('推荐', main[0]);


                }
            }
        });

    }

    // 主页面
    release.onclick = function () {
        subject.classList.remove('show');
        publish.classList.add('show');
        pageTitle.focus();
    }

    // 搜索按钮
    homeSearchBtn.onclick = function () {
        subject.classList.remove('show');
        search.classList.add('show');
        searchInput.focus();
    }

    // 主页底部按钮
    bottomTab.forEach(tab => {
        tab.addEventListener('click', function () {
            bottomTab.forEach(tab => {
                tab.classList.remove('tab-selected');
            });

            mainPages.forEach(mainPage => {
                mainPage.classList.remove('show');
            });

            // if (this.id == 'personal') {
            //     personalPage.style.background = `url(${localStorage.getItem('background-img')})`
            // }
            this.classList.add('tab-selected');
            document.querySelector(`.${this.id}`).classList.add('show');
        });

    });

    //首页切换不同类型文章按钮
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function () {
            let type = this.textContent;
            let selectedMain;
            switch (type) {
                case '推荐':
                    selectedMain = document.getElementById('push');
                    break;
                case '旅行':
                    selectedMain = document.getElementById('travel');
                    break;
                case '美食':
                    selectedMain = document.getElementById('food');
                    break;
                case '时尚':
                    selectedMain = document.getElementById('fashion');
                    break;
                case '彩妆':
                    selectedMain = document.getElementById('cosmetics');
                    break;
                case '高效':
                    selectedMain = document.getElementById('efficient');
                    break;
                case '护肤':
                    selectedMain = document.getElementById('skin');
                    break;
            }
            // 将添加的选中样式清除，让显示的页面隐藏
            let tabSelected = document.querySelector('.tab-nav').querySelector('.tab-nav-selected');

            let mainSelected = home.querySelector('.show');

            if (selectedMain != mainSelected) {
                tabSelected.classList.remove('tab-nav-selected');
                mainSelected.classList.remove('show');

                pages = 1;
                // 点击的这个tab标签加上选中样式
                this.classList.add('tab-nav-selected');
                //清空页面中的内容
                selectedMain.textContent = '';
                // 插入文章
                loading.classList.add('show');
                getPage(type, selectedMain);
                // 页面显示
                selectedMain.classList.add('show');
                selectedMain.style.opacity = '0';

            }
        });
    };


    // getPage('推荐', main[0]);

    // //显示推荐页
    // let push = document.getElementById('push');
    // push.classList.add('show');

    //发布文章页面
    var uploadImgArr = [];//上传的图片的数组
    var isPublishingImg;//判断是否在上传图片
    var imgIndex = 0;//

    // 选择图片上传点击事件
    function selectImg() {
        upload.click();
    }

    // 上传图片
    function publishingImg() {
        let formData = new FormData();
        formData.append('image', this.files[0]);
        isPublishingImg = 1;

        ajax({
            type: 'post',
            url: '/upload/image',
            headerProperty: {
                'Content-Type': ''
            },
            body: {
                formData
            },
            success(data) {
                uploadImgArr.push(data.url);
                isPublishingImg = 0;

                let publishPic = document.createElement('div');
                let img = document.createElement('img');
                let imgRemove = document.createElement('span');
                let newPublishImgBtn = document.createElement('button');
                let newUpload = document.createElement('input');

                publishPic.className = 'publish-pic';
                img.className = 'pre-img';
                img.src = data.url;
                imgRemove.className = 'img-remove icon-guanbi iconfont';
                imgRemove.setAttribute('index', imgIndex);
                imgRemove.onclick = function () {
                    publishImgArea.removeChild(this.parentNode);
                    uploadImgArr.splice(this.getAttribute('index'), 1);
                    let imgRemoves = document.querySelectorAll('.img-remove');

                    for (let i = 0; i < imgRemoves.length; i++) {
                        imgRemoves[i].setAttribute('index', i);
                    }
                }
                imgIndex++;

                publishPic.appendChild(img);
                publishPic.appendChild(imgRemove);

                newPublishImgBtn.className = 'upload-img icon-daohang-fabuwenzhang iconfont';
                newPublishImgBtn.onclick = selectImg;
                newUpload.className = 'hide'
                newUpload.type = 'file';
                newUpload.name = 'image';
                newUpload.onchange = publishingImg;

                img.onload = function () {
                    let fragment = document.createDocumentFragment();

                    publishImgArea.removeChild(publishImgArea.querySelector('.hide'));
                    publishImgArea.removeChild(publishImgArea.querySelector('.upload-img'));

                    fragment.appendChild(publishPic);
                    fragment.appendChild(newPublishImgBtn);
                    fragment.appendChild(newUpload);

                    publishImgArea.appendChild(fragment);
                }

            }
        });
    }

    // 发布文章
    function publishPage() {
        loading.classList.add('show');
        let pageContent = document.querySelector('.page-content');//文章正文

        if (pageTitle != '' && pageContent != '' && !isPublishingImg) {
            let userId = localStorage.getItem('userId');

            ajax({
                type: 'post',
                url: '/article',
                headerProperty: {
                    'Content-Type': 'application/json'
                },
                body: {
                    userId,
                    title: pageTitle.value,
                    content: pageContent.value,
                    tags: tagArr,
                    images: uploadImgArr
                },
                success(data) {
                    loading.classList.remove('show');
                    let publishInfo = document.querySelector('.publish-info');

                    publishInfo.textContent = data.msg;

                    publishInfo.classList.add('show');

                    setTimeout(() => {
                        publishInfo.classList.remove('show');
                        publish.classList.remove('show');
                        subject.classList.add('show');

                    }, 1000);

                    let publishPics = document.querySelectorAll('.publish-pic');

                    publishPics.forEach(pic => {
                        publishImgArea.removeChild(pic);
                    });

                    pageTitle.value = '';
                    pageContent.value = '';
                    themeArea.textContent = '';

                    tagArr.splice(0);

                    uploadImgArr.splice(0);

                    imgIndex = 0;
                }
            });
        }
    }

    // 上传图片点击区域绑定点击事件
    publishImgBtn.addEventListener('click', selectImg);

    // 发布文章页面返回按钮
    publishBack.onclick = function () {
        publish.classList.remove('show');
        subject.classList.add('show');
    }

    upload.onchange = publishingImg;

    // 添加话题点击
    theme.onclick = function () {
        writeThemeBox.classList.add('show');
        themeName.focus();
    }

    var tagArr = [];

    // 确定按钮点击
    confirm.onclick = function () {
        let value = themeName.value;
        tagArr.push(value);

        value = '# ' + value + '\t';

        themeArea.textContent += value;

        writeThemeBox.classList.remove('show');

        themeName.value = '';
    }

    // 取消按钮点击
    cancel.onclick = function () {
        writeThemeBox.classList.remove('show');

        themeName.value = '';
    }

    // 发布文章按钮
    publishBtn.onclick = publishPage;

    // 搜索页面
    searchBack.onclick = function () {
        search.classList.remove('show');
        subject.classList.add('show');
    }

    // 搜索切换搜索结果按钮
    searchNavLi.forEach(li => {
        li.onclick = function () {
            let liSelected = document.querySelector('.search-nav').querySelector('.tab-nav-selected');
            liSelected.classList.remove('tab-nav-selected');
            this.classList.add('tab-nav-selected');

            let type = this.textContent
            if (type == '文章') {
                resultUser.classList.remove('show');
                resultPage.classList.add('show');
            } else {
                resultUser.classList.add('show');
                resultPage.classList.remove('show');
            }
        }
    });

    // 点击搜索按钮，触发事件
    searchBtn.onclick = function () {
        // 拿到关键词
        let keyWord = searchInput.value;

        if (keyWord == '') {
            return;
        }
        // 清空搜索结果
        resultPage.textContent = '';
        resultUser.textContent = '';

        // 显示导航栏
        searchNav.classList.add('show');

        loading.classList.add('show');
        resultPage.style.opacity = '0';
        // 开启获取用户搜索结果程序
        getResultPage(resultPage, keyWord);
        //开启获取文章搜索结果程序
        getResultUser(resultUser, keyWord);
    }

    //文章详情页

    // 轮播图函数
    slideShowEvent(slideShow, slideShowOl);
    writeReviewInput.addEventListener('input', function () {
        if (writeReviewInput.value != '') {
            sendReviewBtn.classList.add('send-review-btn-show');
        } else {
            sendReviewBtn.classList.remove('send-review-btn-show');
        }
    });

    // 开始写评论的点击事件
    function inputtingReview() {
        writeReview.classList.add('flex');
        reviewMask.classList.add('show');
        writeReviewInput.focus();
    }

    // 底部输入框点击
    bottomReviewBar.addEventListener('click', inputtingReview);

    // 评论区域点击
    reviewInput.addEventListener('click', inputtingReview);

    // 点击遮罩层返回
    reviewMask.addEventListener('click', function () {
        writeReview.classList.remove('flex');
        reviewMask.classList.remove('show');
        writeReviewInput.value = '';
        writeReviewInput.placeholder = '快说点什么~';
        writeReviewInput.removeAttribute('reviewId');
    });

    // 个人主页
    // 切换不同类型文章按钮
    personTabs.forEach(tab => {
        tab.onclick = function () {
            personShow.querySelector('.tab-nav-selected').classList.remove('tab-nav-selected');//移除先前选中的标签的样式
            this.className = 'tab-nav-selected';

            const prePageShow = personShow.querySelector('.show');
            const pageShowBox = personShow.querySelector(`.${this.id}`);

            if (prePageShow == pageShowBox) {
                return;
            }

            loading.classList.add('show');
            prePageShow.classList.remove('show');
            pageShowBox.classList.add('show');
            pageShowBox.style.opacity = '0';
            pageShowBox.textContent = '';

            let type = this.id;
            let userId = localStorage.getItem('userId');
            switch (type) {
                case 'note-page':
                    getUserPage(userId, pageShowBox);
                    break;
                case 'collect-page':
                    getStaredPage(userId, pageShowBox);
                    break;
                case 'like-page':
                    getLikePage(userId, pageShowBox);
            }
        }
    });

    outLogin.addEventListener('click', function () {
        let userId = localStorage.getItem('userId');

        ajax({
            type: 'post',
            url: '/logout',
            body: {
                userId
            },
            success(data) {
                console.log(data);
                if (data.status == 200) {
                    localStorage.removeItem('userId');
                    personalPage.classList.remove('show');
                    subject.classList.remove('show');
                    login.classList.add('show');
                } else {
                    alert('退出登录失败');
                }
            }
        });
    });

    personal.addEventListener('click', function () {
        let userId = localStorage.getItem('userId');
        const notePage = personShow.querySelector('.note-page');
        notePage.textContent = '';

        loading.classList.add('show');
        personalPage.style.opacity = '0';
        notePage.style.opacity = '0';
        fillPersonal(userId);
        getUserPage(userId, notePage);
    });

    // 关注的人点击事件
    personFollow.onclick = function () {
        loading.classList.add('show');
        let userId = localStorage.getItem('userId');
        followClicking(userId);
    }


    // 粉丝按钮点击事件
    personFan.onclick = function () {
        loading.classList.add('show');
        let userId = localStorage.getItem('userId');
        fanClicking(userId);
    }


    // 点赞与收藏点击事件
    personLikeAndStar.onclick = function () {
        loading.classList.add('show');
        let userId = localStorage.getItem('userId');
        likeAndStarClicking(userId);
    }


    //用户列表页
    userlistBack.onclick = function () {
        userlistPage.classList.remove('show');
        document.querySelector(userlistPage.getAttribute('backPlace')).classList.add('show');
    }

    //编辑资料
    personData.onclick = function () {
        let userId = localStorage.getItem('userId');

        if (localStorage.getItem('background-img')) {
            BackGroundImg.src = localStorage.getItem('background-img');
            BackGroundImg.classList.add('show');
        }

        ajax({
            url: '/user/baseInfo',
            urlParams: {
                userId
            },
            success(data) {
                userAvatar.src = data.user.avatar;
                nameContent.textContent = data.user.nickname
            }
        });

        userEdit.classList.add('show');
        subject.classList.remove('show');
    }

    // 编辑页面返回按钮点击事件
    editBack.onclick = function () {
        userEdit.classList.remove('show');
        subject.classList.add('show');
    }

    // 点击触发表单，选择文件
    userAvatar.onclick = function () {
        avatarPic.click();
    }

    // 选择了文件就上传
    avatarPic.onchange = function () {
        let formData = new FormData();
        let userId = localStorage.getItem('userId');

        formData.append('userId', userId);
        formData.append('avatar', this.files[0]);

        ajax({
            type: 'post',
            url: '/user/upload',
            headerProperty: {
                'Content-Type': ''
            },
            body: {
                formData
            },
            success(data) {
                if (data.status == 200) {
                    userAvatar.src = data.avatar;
                }
            }
        });
    }

    // 点击编辑栏，呼出输入框
    editArea.onclick = function () {
        editBox.classList.add('show');
        editMask.classList.add('show');
        editInput.focus();
    }

    // 取消输入
    editBoxCancel.onclick = function () {
        editBox.classList.remove('show');
        editMask.classList.remove('show');
        editInput.value = '';
    }

    editBar.forEach(bar => {
        bar.addEventListener('click', editingData);
    });

    userBackGroundPicture.removeEventListener('click', editingData);
    // 点击上传图片
    userBackGroundPicture.addEventListener('click', function (e) {
        e.stopPropagation();
        uploadBackgroundImg.click();
    });

    // 上传背景图片
    uploadBackgroundImg.onchange = function () {
        let userId = localStorage.getItem('userId');
        let formData = new FormData();
        formData.append('userId', userId);
        formData.append('backGroundPicture', this.files[0]);

        ajax({
            type: 'post',
            url: '/user/upload',
            headerProperty: {
                'Content-Type': ''
            },
            body: {
                formData
            },
            success(data) {
                if (data.status == 200) {
                    BackGroundImg.src = data.backGroundPicture;
                    BackGroundImg.classList.add('show');
                    personalPage.style.background = `url(${data.backGroundPicture})`;
                }
            }
        });
    }

    // 点击切换到赞与收藏
    msgLikeAndStar.onclick = function () {
        let userId = localStorage.getItem('userId');
        likeAndStarClicking(userId);
    }
    // 点击切换到新增关注
    msgFollow.onclick = function () {
        let userId = localStorage.getItem('userId');
        followClicking(userId)
    }

    // 点击切换到收到评论
    msgReview.onclick = function () {
        let userId = localStorage.getItem('userId');
        reviewClicking(userId)
    }

    // 给创建聊天添加点击事件
    newChat.onclick = function () {
        let userId = localStorage.getItem('userId');
        chatClicking(userId, '.subject')
    }

    //给聊天输入框添加事件
    messageContent.addEventListener('input', function () {
        sendMessage.classList.add('send-message-change');
        if (messageContent.value == '') {
            sendMessage.classList.remove('send-message-change');
        }
    });

    // 我的消息切换按钮点击事件
    myMessageBtn.addEventListener('click', function () {
        const loading = document.querySelector('.loading');
        loading.classList.add('show');
        let userId = localStorage.getItem('userId');
        chatList.textContent = '';

        if (!socket) {

            socket = io('ws://175.178.193.182:8080/chat');
            socket.on('connect', () => {
                console.log('chat连接成功');
                console.log(socket.id);
                connect = true;
            });

        }

        ajax({
            url: '/chat/getList',
            urlParams: {
                userId
            },
            success(data) {
                console.log(data);
                produceChatUser(chatList, data.chatList, '.subject');
                loading.classList.remove('show');
            }
        });
    });
});

