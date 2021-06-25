<template>
<div>
    <div id="app">
        <div class="container-fluid ">
            <div class="row">
                <div class="login-page">
                <div class="form">
                    <h3>系統登入</h3>
                    <form class="login-form"  @submit.prevent="postLogin()">
                        <input v-model="form.clinic_code" type="text" placeholder="account" maxlength="5"/>
                        <input v-model="form.password" type="password" placeholder="password" maxlength="10"/>
                        <button>登入</button>
                        <!-- <p class="message"><a target="__blank" :href="'http://' + mode.dev + '/Leyan/clinic1/shift_login.html'">帳密資訊請點此處</a></p> -->
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from "axios";
export default {
    title: "打卡排班系統",
    name: "Login",
    data() {
        return {
            form: {
                clinic_code: '',
                password: ''
            },
            mode: {
                prd: "34.80.179.232",
                dev: "localhost",
            },
        }
    },
    methods: {
        postLogin() {
            axios.post(`http://${this.mode.dev}/api_v1.1/login/shift`, this.form)
            .then((res) => {
                if (res.data.code === 200) {
                    let data = res.data.data;
                    window.localStorage.setItem('token', data.token);
                    alert(`登入成功`);
                    this.$router.push('/');
                } else if(res.data.code === 400) {
                    alert(res.data.message)
                } else if(res.data.code === 401) {
                    alert(res.data.message)
                }
            })
            .catch((error) => {
                alert(error);
            });
        }
    }
};
</script>

<style lang="css">
html {
  font-family: Microsoft JhengHei;
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}
body {
  margin: 0px;
  padding: 0px;
}
.container-fluid{
  height: 100%;
  width: 100vw;
}
.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: 5rem auto 0;
}
.form {
  position: relative;
  z-index: 1;
  background: #FFFFFF;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}
.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}
.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: #646dc1;
  width: 100%;
  border: 0;
  padding: 15px;
  color: #FFFFFF;
  font-size: 14px;
  -webkit-transition: all 0.3 ease;
  transition: all 0.3 ease;
  cursor: pointer;
}
.form button:hover,.form button:active,.form button:focus {
  background: #727ac5;
}
.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}
.form .message a {
  color: #5a68e6;
  text-decoration: none;
}
.form .register-form {
  display: none;
}
.container {
  position: relative;
  z-index: 1;
  max-width: 300px;
  margin: 0 auto;
}
.container:before, .container:after {
  content: "";
  display: block;
  clear: both;
}
.container .info {
  margin: 50px auto;
  text-align: center;
}
.container .info h1 {
  margin: 0 0 15px;
  padding: 0;
  font-size: 36px;
  font-weight: 300;
  color: #1a1a1a;
}
.container .info span {
  color: #4d4d4d;
  font-size: 12px;
}
.container .info span a {
  color: #000000;
  text-decoration: none;
}
.container .info span .fa {
  color: #EF3B3A;
}
body {
  background: #bcc1ef; /* fallback for old browsers */
  background: -webkit-linear-gradient(right, #bcc1ef, #646dc1);
  background: -moz-linear-gradient(right, #bcc1ef, #646dc1);
  background: -o-linear-gradient(right, #bcc1ef, #646dc1);
  background: linear-gradient(to left, #bcc1ef, #646dc1);
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;      
}

</style>