<!--
Description: web 登录
@author: zhao-xiaowen;
@data: 2018-07-04  08:30:00
-->
<template>
    <div class="login">
        <div class="login-body">
            <div></div>
            <div>
                <span class="login">登&nbsp;&nbsp;录</span>
            </div>
            <div></div>
            <div class="login-body-content">
                <div class="login-body-content-first">
                    <input name="unames" type="text" v-model.trim="user.username"
                           placeholder="用户名/手机号"/>
                    <p class="verification"></p>
                </div>
                <div class="login-body-content-second">
                    <input name="pwds" type="password" v-model.trim="user.password"
                           placeholder="请输入密码"
                           @keyup.enter="login"/>
                    <p class="verification"></p>
                </div>

                <div class="login-body-content-third">
                    <span><input type="checkbox" :checked="this.checked"/>7天免登录</span>
                    <span>忘记密码？</span>
                </div>

                <div class="login-body-content-fourth">
                    <span style="display: inline-block; width: 100px; height: 20px; background-color: #00b7ee " @click="login">登录</span>
                </div>

                <div class="login-body-content-fifth">
                    <div></div>
                    <div>
                        <span class="login">使用第三方登录</span>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getConfig} from "../assets/js/config";

    export default {
        name: 'Login',
        data() {
            return {
                checked: true,
                user: {
                    username: '',
                    password: '',
                    freeFlag: '0' // 0: 正常登陆 1:7天免登陆
                }
            }
        },
        methods: {
            // 登录
            login: function () {
                if (this.user.username == "" || this.user.password == "") {
                    return;
                }

                let currentUrl = getConfig().remoteHost + "/sys/user/login";
                this.user.freeFlag = "0";
                this.$http.post(currentUrl, {
                    username: this.user.username,
                    password: this.user.password,
                    freeFlag: this.user.freeFlag
                }, {
                    emulateJSON: true,
                    credentials: true
                })
                    .then(res => {
                        let status = res.data.status;
                        if (status == "200") {
                            if (this.checked == true) { //七天免登陆
                                // 存储 WEBSITE_USER + 时间戳 到localStorage
                                let currentTime = new Date().getTime();
                                let date = currentTime + 7 * 24 * 3600 * 1000;
                                localStorage.setItem('LOGIN_TIME', date)
                                localStorage.setItem('WEBSITE_USER', this.user.username)
                                localStorage.setItem('WEBSITE_PASSWORD', res.data.data.token)
                            }

                            sessionStorage.setItem('WEBSITE_USER', this.user.username);
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            });
                        } else {
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            },
        },
        created() {
            let currentUrl = getConfig().remoteHost + "/sys/user/login";
            // 从localStorage里取WEBSITE_USER + 时间戳
            let timer = localStorage.getItem("LOGIN_TIME")
            let username = localStorage.getItem("WEBSITE_USER")
            let password = localStorage.getItem("WEBSITE_PASSWORD")
            let currentTime = new Date().getTime();
            let freeFlag = "1";
            // 若果 WEBSITE_USER != null && 时间戳 < 7天
            if (username != null && password != null && currentTime < timer) {
                this.$http.post(currentUrl, {
                    username: username,
                    password: password,
                    freeFlag: freeFlag
                }, {
                    emulateJSON: true,
                    credentials: true
                })
                    .then(res => {
                        let status = res.data.status;
                        if (status == "200") {

                            if (this.checked == true) { //七天免登陆
                                // 存储 WEBSITE_USER + 时间戳 到localStorage
                                let currentTime = new Date().getTime();
                                let date = currentTime + 7 * 24 * 3600 * 1000;
                                localStorage.setItem('LOGIN_TIME', date)
                            }

                            sessionStorage.setItem('WEBSITE_USER', username);
                            this.success("登录成功！");
                            let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                            this.$router.push({
                                path: redirect
                            });
                        } else {

                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }
</script>

<style scoped>

</style>
