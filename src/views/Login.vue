<template>
  <form class="login-form mystream-form">
      <input type="email" placeholder="E-mail" v-model="form.email" />
      <input type="password" placeholder="비밀번호" v-model="form.password" />
      <div class="login-failed" v-if="loginFailed">잘못된 E-mail 혹은 비밀번호입니다.</div>
      <button type="button" @click="login" class="login-btn blue-btn">로그인</button>
      <router-link to="/register" class="gray-btn">회원가입</router-link>
  </form>
</template>

<script>
import axios from 'axios';
import api from '../utils/api';
import Vue from 'vue';
import Cookies from 'js-cookie';

export default {
    data: () => ({
        form: {
            email: '',
            password: ''
        },
        referrer: null,
        loginFailed: false
    }),

    methods: {
        login() {
            api.post("/users/tokens", this.form).then(res => {
                Cookies.set('Authorization', 'Bearer ' + res.data.token);

                api.get("/users/me").then(res => {
                    this.$root.me = res.data;

                    if(this.referrer == null || this.referrer.path == "/register")
                        this.$router.push("/")
                    else
                        this.$router.push(this.referrer.path);
                });
            }).catch(err => {
                if(err.response && err.response.status == 401) {
                  this.loginFailed = true;
                }
            });
        },
    },

    beforeRouteEnter(to, from, next) {
      if(Cookies.get("Authorization") != undefined)
        next(vm => vm.$router.push(from.path))
      else
        next(vm => vm.referrer = from);
    }
}
</script>

<style lang="scss">
  @import "../stylesheets/form.scss";
  @import "../stylesheets/colors.scss";

  .login-form {
      position: relative;
  }

  .login-failed {
    text-align: center;
    color: $error-red;
    font-size: 14px;
  }
</style>