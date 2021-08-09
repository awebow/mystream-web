<template>
  <form class="register-form mystream-form">
    <template v-if="!registered">
      <input type="text" placeholder="E-mail" v-model="form.email" @input="emailChanged" maxlength="255" />
      <div :class="{
        'form-message': true,
        'error': !validateEmail() || existEmail,
      }">{{ emailMessage() }}</div>
      <input type="password" placeholder="비밀번호" v-model="form.password" maxlength="255" />
      <div class="form-message error" v-if="!validatePassword()">비밀번호는 8자 이상이어야 합니다.</div>
      <input type="password" placeholder="비밀번호 확인" v-model="passwordCheck" maxlength="255" />
      <div class="form-message error" v-if="!validatePasswordCheck()">비밀번호가 일치하지 않습니다.</div>
      <input type="text" placeholder="이름" v-model="form.name" maxlength="64" />
      <div class="form-message error" v-if="!validateName()">이름을 입력해주세요.</div>
      <button type="button"
        class="register-btn blue-btn"
        :disabled="!validateForm()"
        @click="register">회원가입</button>
    </template>
    <template v-else>
      <h1>회원가입 성공!</h1>
      <router-link to="/login" class="blue-btn">로그인</router-link>
    </template>
  </form>
</template>

<script>
import api from '../utils/api';
export default {

  data: () => ({
    form: {
      email: "",
      password: "",
      name: ""
    },
    passwordCheck: "",
    existEmail: false,
    lastEmailChanged: new Date(),
    checkTimer: null,
    registered: false
  }),

  methods: {
    emailChanged(e) {
      console.log(e);
      this.lastEmailChanged = new Date();
      if(this.checkTimer == null) {
        var callback = () => {
          var duration = new Date().getTime() - this.lastEmailChanged.getTime();
          if(duration >= 1500) {
            if(this.validateEmail()) {
              api.get(`/users/emails/${this.form.email}`)
                .then(() => this.existEmail = true)
                .catch((err) => {
                  if(err.response.status == 404)
                    this.existEmail = false;
                });
            }
            this.checkTimer = null;
          } else {
            this.checkTimer = setTimeout(callback, 500 - duration);
          }
        };
        this.checkTimer = window.setTimeout(callback, 500)
      }
    },

    validateEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.form.email.toLowerCase());
    },

    validatePassword() {
      return this.form.password.length >= 8;
    },

    validatePasswordCheck() {
      return this.form.password == this.passwordCheck;
    },

    validateName() {
      return this.form.name.length > 0;
    },

    validateForm() {
      return this.validateEmail() && this.existEmail === false
        && this.validatePassword() && this.validatePasswordCheck()
        && this.validateName();
    },

    emailMessage() {
      if(this.checkTimer != null)
        return "";
      
      if(!this.validateEmail())
        return "올바르지 않은 E-mail 형식입니다.";

      if(this.existEmail)
        return "이미 사용 중인 E-mail입니다.";

      return "사용 가능한 E-mail입니다."
    },

    register() {
      api.post("/users", this.form).then(() => {
        this.registered = true;
      });
    }
  }

}
</script>

<style lang="scss">
  @import "../stylesheets/form.scss";
  @import "../stylesheets/colors.scss";

  .register-form {
    position: relative;
    input, button {
      margin: 16px 0;
    }

    .form-message {
      position: absolute;
      right: $form-padding-x;

      line-height: 100%;
      margin-top: -14px;
      font-size: 12px;
      text-align: right;
      color: #21be13;

      &.error {
        color: $error-red;
      }

      &:empty::before {
        content: '\A0';
      }
    }

    .register-btn {
      margin-top: 24px;
    }

    h1 {
      margin: 0;
      margin-bottom: 24px;
      font-size: 24px;
    }
  }
</style>