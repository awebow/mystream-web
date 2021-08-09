<template>
  <main>
    <form class="basic-profile" v-if="$root.me">
      <h1>기본 정보</h1>

      <table>
        <tr class="picture-row">
          <th>프로필 사진</th>
          <td>
            <button type="button" class="upload-picture" aria-label="프로필 사진 업로드"
              @click="$el.querySelector('input').click()">

              <img :src="pictureSrc()" />
              <input type="file" accept="image/jpeg,image/png,image/gif" @change="fileSelected" />
            </button>
          </td>
        </tr>
        <tr>
          <th>이름</th>
          <td>
            <input type="text" placeholder="이름" v-model="name" maxlength="64" />
            <div class="error-message" v-if="!validateName()">이름을 입력해주세요.</div>
          </td>
        </tr>
        <tr>
          <th rowspan="3">비밀번호 (변경 시 입력)</th>
          <td>
            <input type="password" placeholder="현재 비밀번호" v-model="current_pw" maxlength="255" @input="current_pw_error = false" />
            <div class="error-message" v-if="!validateCurrentPW()">현재 비밀번호를 입력해주세요.</div>
            <div class="error-message" v-if="current_pw_error">현재 비밀번호가 일치하지 않습니다.</div>
          </td>
        </tr>
        <tr>
          <td>
            <input type="password" placeholder="새 비밀번호" v-model="password" maxlength="255" />
            <div class="error-message" v-if="!validatePassword()">비밀번호는 8자 이상이어야 합니다.</div>
          </td>
        </tr>
        <tr>
          <td>
            <input type="password" placeholder="비밀번호 확인" v-model="passwordCheck" maxlength="255" />
            <div class="error-message" v-if="!validatePasswordCheck()">비밀번호가 일치하지 않습니다.</div>
          </td>
        </tr>
      </table>
      
      <button type="button" class="blue-btn submit-edit" @click="editBasic" :disabled="!validateForm()">수정</button>
    </form>
  </main>
</template>

<script>
import Cookies from 'js-cookie';
import api from '../utils/api';
import picture from "../utils/picture";

export default {

  data: () => ({
    name: "",
    current_pw: "",
    password: "",
    passwordCheck: "",
    current_pw_error: false,
    uploadPicture: null
  }),

  mounted() {
    if(this.$root.me)
      this.name = this.$root.me.name;
  },

  methods: {
    fileSelected(e) {
      this.uploadPicture = e.target.files[0];
    },

    pictureSrc() {
      if(this.uploadPicture != null)
        return URL.createObjectURL(this.uploadPicture);

      return picture.userPicture(this.$root.me.picture);
    },

    validateName() {
      return this.name.length > 0;
    },

    validateCurrentPW() {
      return this.current_pw.length > 0 || this.password.length == 0;
    },

    validatePassword() {
      return this.password.length == 0 || this.password.length >= 8;
    },

    validatePasswordCheck() {
      return this.password == this.passwordCheck;
    },

    validateForm() {
      return this.validateName() && this.validatePassword() && this.validatePasswordCheck() && this.validateCurrentPW();
    },

    editBasic() {
      var body = {};
      if(this.name.length != this.$root.me.name)
        body.name = this.name;

      if(this.password.length > 0) {
        body.password = this.password;
        body.current_pw = this.current_pw;
      }


      api.put("/users/me", body).then(() => {
        var form = new FormData();
        form.append("file", this.uploadPicture);

        if(this.uploadPicture == null) {
          location.reload();
          return;
        }

        api.put("/users/me/picture", form, {headers: {"Content-Type": "multipart/form-data"}}).then(() => {
          location.reload();
        });
      }).catch(err => {
        if(err.response && err.response.status == 401)
          this.current_pw_error = true;
      });
    }
  },

  watch: {
    '$root.me': function(me) {
      this.name = this.$root.me.name;
    }
  }
}
</script>

<style lang="scss">
  @import "../stylesheets/controls.scss";
  @import "../stylesheets/colors.scss";

  .basic-profile {
    @include default-controls;
    width: 600px;
    text-align: left;

    padding: 16px;

    .picture-row {
      th {
        padding-top: 0;
        vertical-align: middle;
      }
    }

    .upload-picture {
      width: 128px;
      height: 128px;
      cursor: default;

      background: none;
      padding: 0;
      margin: 16px auto;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
        object-fit: cover;
      }

      input[type=file] {
        display: none;
      }
    }

    h1 {
      margin: 0;
      font-size: 24px;
    }
    
    input {
      margin: 6px;
    }
    
    table {
      width: 100%;
      position: relative;
    }

    th {
      padding-top: 12px;
      vertical-align: top;
    }

    input {
      width: 100%;
    }

    .submit-edit {
      width: 72px;
      margin-left: auto;
    }

    .error-message {
      position: absolute;
      right: 0;

      line-height: 100%;
      margin-top: -6px;
      font-size: 12px;
      text-align: right;
      color: $error-red;
    }
  }
</style>