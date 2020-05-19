<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <!-- <lang-select class="set-language" /> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="captcha">
        <div class="captchaWrapper">
          <span class="svg-container">
            <svg-icon name="captcha" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            :placeholder="$t('login.captcha')"
            name="captcha"
            type="text"
            tabindex="3"
            autocomplete="on"
          />
          <div class="imageWrapper">
            <img
              :src="imgSrc"
              alt="captcha"
              @click="getImage"
            >
          </div>
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>

      <!-- <div style="position:relative">
        <div class="tips">
          <span>{{ $t('login.username') }} : admin </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>
        <div class="tips">
          <span>{{ $t('login.username') }} : editor </span>
          <span>{{ $t('login.password') }} : {{ $t('login.any') }} </span>
        </div>

        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog=true"
        >
          {{ $t('login.thirdparty') }}
        </el-button>
      </div> -->
    </el-form>

    <!-- <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'
import { getCaptcha } from '@/api/users'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!isValidUsername(value)) {
      callback(new Error('请输入正确的用户名'))
    } else {
      callback()
    }
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码不能少于六位'))
    } else {
      callback()
    }
  }

  private validateCaptcha = (rule: any, value: string, callback: Function) => {
    if (!value.length) {
      callback(new Error('请输入验证码'))
    } else {
      callback()
    }
  }

  private loginForm = {
    username: 'admin',
    password: '111111',
    captcha: '',
  }

  private imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABGCAYAAABL0p+yAAAXtklEQVR42u2dh3tV1dLG7x/xYcOuV2/R6xUVkCIICoIiilyaoCCKUpTeDb2GXqR3kN6LlNA7UkLvJfRek1AD881vkX2y9s45JycNEfc8z3k08eScvdd6Z+add2Zt/ya++fYH2t/8JfDNB6BvPgB9880HoG8+AH3zzQegbz4AffPNB6BvPgB9880HoG8+AH3z7Q8B4L179+Tu3Xv+Svn2xwDw+o3bsi72oPy2bLtcuBSvP99SQN4N+f47SUly+WqinLtwTW7oe33zLVMAHD9rvRSr3FM+/bafNOo4WZas2S07952Uq/HXAxESu3Qlwfx+8erd0n/0Upkyb6OcOX/VX2HfMg7AoycuyN8Lt5D/e7Oe5MhVX14o2Ez+W6KNtIyeLsMnrZRTZy/LtfgbkpR0V0G3RPKU7mjey2vs9LVy89Ydf4X/wnbpSqLBRoYAGKfgK1W9TwBQBoTJ/3w+f1MpWrG7VPppiEycvUEGj18hhctHB96X97OOsmLDPn8HHmEDWAnXbwZ+hp5t3hEn0xdskT4jF0u7PrNlvtK2DEXAu5pWp87fJB9U7iEvF2ouT+dt7AIir8ffbmCA+FTuhvKvD6Jc7/mx9Xg5dPScv0uPqN2+nWQCDDRr9NQ10qb3LPm++Rj5vMYvUqBsF/lHkZ/l42p9ZP2WQxkDYJIWGbv2n5Q1mw5IzZbjNBL2lRcLNEsFwlCviXN+12Lk7iO7AazNlWvX/1KgO3L8vAHct01HynP5mpjAU/yrXvLWJ+1M8Hm+QFPJXbqDAd7XDYfLpLmRYSBkCr51+44kJN6UY5qKx89cL216zZKilbrLi+81l5x5G4UEHxewZO2eRzLl7D10WqIHzZcy3/8iFeoMkqadp8rUeZv+9MUWqsbpc1dcvyO9HjhyVuYs3iY/d58hJav20cjWUh57q77Z56fyNJJ8ZTpL2ZoDpXbUOOn0yzz5VXGyeuN+OXnmcqA4zXQVjCVevyVbdx+TBct3yHfNRssHX/YwXhAKgAtX7JSLlxNMKn8UjHuZrEArXCHaRTVYgwbtJ/3pAMj1rtt8UMbNWCdte8/WqDZKDh87Hwg88P/hk1bJN41HyjufdjB0y95jol/z6GkyfeFm2bbnuClEs02GcYyK9sq1RNl36Iz0Hh6jFz3aXEiOXBYvfKuBekmU1Gs3URat2ik3bt4O+5nc7MG4s7Ih9rAB7RTd5NkxsXLu4jUj68xYuEVa9ZgpLbpOM9Gmy4Df5PethyO+uTt3kjK8MHhwokaBlcp1av48LqizvVastQwYu+yhBRqaLesLXyM6ddYo9UOLMVL2hwEmiLxdqr28UriFfFl3iInuPYcvMjyO6Oa917yfdZL6uq/zlm43mfGB6YDeTcGOnboksxdvldI1+smTuRukulh4QTMFzYathwwIg3VSSGl9RsbIV/WHS+lv+5sFAWT7D58xKYGqqlqjEfKsRpnHct0P+89p0YMgfisCeeeqcrSRU1YrQZ5tHGbCrA2aHg6YTYkk3R4/fdEs+BslWruczH5V+HGw7D9y5oFTARyDqHxc92HvwdOycdsRWbx6l+Fog8Ytl/Z955hCEJUC/bZIxW7yjoLt1fdbyhOeaPbkOw2kepNRxpns+3xJqVaRit1NMJk2f7McUCCzdveyOKtlqBdMkbJl51F5X28s2MZwU3k/7ySNOk6RA4fPmkhn2+Fj5+STb1IkHqrphh0mmdDvAJ000X3IQtfnokl26Dc3TT7DYiGa34/K9eUVXfjPv+svc5dsS/PeTp29IiMmrzZO9Hgy38EJXi7Uwmygcy3/1MofueFB2rGTFyWqxwyp9OMQKVdroJTRaPXJN31No6BQuWijw/7nozZmnYJFsWAvspj984sFm0lJpVFdlesuVS5/QvlcMC2PoGKDMT7hhqFqDwSAGEBwRGpbI0xJx/XlvXJdZfS0tYZfXNML5IJnxWyVPJ+lCNYsGKW801lxjMjZe0SM/PvDVq7P7TJwvknRoWyVppuSVXu7eAsEmg5NuNSBU0EBPtcC47n8Kfy2UPloo3M27jTFANn5ffk6g03aepCG3IEjRKpGRPJ65t3G5lWyWm/prBQH6SRUhmGN2Bci8JYdcYYnAtT+o5YY6jRHs+Keg6fS1YDIEABZ+I++7p1yE0rMP/q6lzzxjtubXijQTPJ90clUjngTgHq1SMomknbXbjkY9Du4UdLKP4tGWZG1oVRU7wfMXotXcM1cGGtIs10kVG04XFPVxdA8Sb2WaE6qwfvva5z1TYSjwNi5/4SpBql8A9Gv6IOPfrsPnDLrlVXAw0FLqGNuUE59Sitgb5byGmvUS6lMudqDzLoSYAhAb5Zsazpk/O7LukNl574T2R8BOyqZtaNBvbYTpNvgBaY78lSehqZSdCLQkwjVGsXyf9HFVUE27jQ5VenvDfGblNt403z5OoNSRR48sm2f2S6wIo6P0ejLYEQo3gIwowctMOnWBdpGww2vSkxW+nsOW2QAGe4astuoVl8p3FJyamrFUV5XzoYMQrT/ouYAUzwgk3Gd3qqVCPdasSh5+t2U9a+o/DXu+HkjKoda/0NKlfqNXmLWJ0cEoCYang+TnbIEgBQJJaqmRD/ExwVaweKhbDjdk8r1h0nB/3UNepHoiJ0H/mZAEY7QOlyuetNRrr/P/0Vn2b73uAtEDZQ/PpkcfZ9Q/kmkoKoOtbDxCddl8Zrd91N1Ms9j0wpX6GakiXgrwh48ek6+0KrR+X5UfiKBq5rXlBOfhZVhsGsmI0AheHF9bPSOvSfM2pNhANSbH7czDh/g1gWaSqnq/aRG8zHy90LNA78HqPDJcN+3eNVuE+2crJA6dTdxFS3QKhoX2c4BozXS/aPoz4EvhpdA3K/rAjGcgEcxMQOfoPoindkX/u9irUzVtWl7nP5N+KrqavwNqavR9VnLc4lyfD58ZLfyDYRQh0gDotpRvxoeEqqCRM/k+1/SDXEW8A3loX2GLzZg86aifspvXiuWwkP5vh2eNHMg7ox07DdPOvSda5xw+bq9cubc1UxXjADhbrKjOnOZEP11ytMq1xtmUp+9tkRHMg3V+/zlO4xTsBZ26kZOIZ2GTvUnjcjurZaJgoC8jlbXVRuOMBGX9+XRAETRyX5nRA9NFwBPnL4kpbSst3WwGOVpXpkGYbL7kAUu8AUilN5YLvXUXsNiTDFxO4RWx2fh7dN+2+QK//COAWOWmXaYPX3zcqFm0q7v7FTFjC0mD52wwmhfgXSrxUaVBsNkfezhEBXxZV3kwa4KEcXfCxKAy8aS6t76pL2U1op7zPS16QYgUd9Et0vxcvLMJS0IDkqMOtvKDfvNBtMSfebdlOoWeYprKqoAq6WOR1Hwu1IH1hVnM/ulVXLA+T+Mko3q+EH7u7oPRNN3P++UAmilTGU1vY/SIhEOv3nHUaMDc42sDSCnyETBCLWGWQrAoRNXyhsl2qRwP/U0R0G3b4Rig1TlvO8d9ZIPK/c0gw1G1tDwXah8Vxk5ebVJ6aG0ORaRVpDNAxkLI1XmsngJhQep84ryvWC2bN0eU4ygbdkVOjrhCd3oUAaIbMDS5VmzKXXRBIknqjrvgwa06zsnog4BHJXPnLNkm9HxEIuJWDnzNAwhcTWUlwo2N05MNKZC36VRy7uGZzUafd1guIs6TJ67Magmi6OMmb5OXi/e2rVnA8YuNc7lFfQdx+L3RzWVxyfczHC0jxiApDyEVxsIMxduSRUNWvea5VqwgWOXmcno/nozP7QYK+9XSAETRHoIC6jRLNgN3OdrN5VPdnGPheVKiayvvN9CNu2ICxlFEaTtyhtNr3LdYSbKpBWNbP5Juq6vVXGo97bX9Gtf46caeexmPNeCcExTf/7y7dJtyEJ14AkK3JEmagabODJRTp0FLofsAx0gfYaK8vZe1Wwxxr0P45aFXCMin6udqtd+STNGpM2JzFCNiAG4ZM0eV2EBB7C5xHEN93XbTgz89zdKtJWx6lVOlUUKpI0GRypXa5CJQrTu4Cwd+s81BNar03FjFy7HS7Smc6cJbr/ooBA9Qg09Eo2HTljpSqF1246PqFlOC87FnTQ1MeUTtOWn30/b8GWL6PO3pEMkI1qN/ccsDfBVUudzyaNsbse67yBEq9eKt5IqWsyt+n1f2CMQXktIvKHftSTA4ShKEOVDgTZmFVJXSraq+NOQkJkkOyxiANLesYVnOIkjCFNR4ckOzyM9zI7ZKjdv3U4FqBOnLxswA0KKGdJVrpLtTHTES49oSrcjB1GQjecz7c0ikm7afiTsxC1pyeZAXD/pu4xWtbWixkmPoQtl5qJYE4G9XBQOaxdb4dpud5M7Q+9ZDgqQPlMuWKxKT8mnlfvz+ZuElTAoIOhqdB043/CpjPZboQ120UQ77khyh8lrODe8MiVNRxlnufcAh0ginob5X62BgQslXcxZsjX5JhKkWqORVg+xmaxYvy9syGZxSUd1Wv1q0o/Dy5BYajQbLZOVCyUk3gp8d0Ur9QdEbo1miMThvue0VufhNhzNjMjGXBvaXstu002EXqlRB1HV5l3Nuk51fTbA5wDW7v2nZKoWSjVbjAsLMCI4kQ06kNPTJiMS1m8/MVOHuHBUtMl/WXola3Q4xGAw/G3e0m2uggYHeNAWEQDXxx4yjWnnYvFqFHQiH1Mxzu+poBat3JWmB92XFO6aqWkEVshvjmRuR6HA51RrPFKGadFDhRVMBH1BeRF8M5SQCg/aoCmwnAKLhSXyUVC8qiDwpj47RRNpqWhfLNjcJWpDyA2VuJIgsbuOmrZTDeVZgBenCwU8lILqukZkkG4aVQG5Uww5nx3VY6acvZC5kS66NVUbjUiJZhq9ScWhDP20eddprqDyvd7P+UvXHj4AEtZzWd2CWj+PU6DtdN2w6ZuWi5Ypv23UxUz7JgAhAi7RhnROCkbZJyUDRDoSDCk8bnE/eI3DBQFlWY3Km0LICgGR+PYdJf4XzCTMhNkbpMtA/a6WY03PF0EWUJKa7cImWL+0YNkuRphldu7Dyj1Mx+fJEEC2nYRJHJQCeCcFGcJ9oIAq3NLIOmSDzBh6H52gZ60ZTaaRLoYptLbtPu4qKnmV+X6AmaahUEKd4IzHPo2qTH8TXdduPij79PdOP/iBAdA7ePBTm/EmJQMW+wbwIqQKosOFNKpMb98XcXfGgs0S1X2G5GYI0lN0sLjwuVes6yCVjZqyJmhvOC0zRZFGSECJZPJlvaFmCgSA5AwxSYIDBBvNQoglqnHdpb/t5xpmIIITbYjmb1t9asBLBwNgZtaY8rHbiQSCrbuOh/0bjtB6e8vsX24zUdPaZA1kHPbz1fdbmPfigJ99318adZpiirTz6djjTAHwRwWcLRMQqRyAsFneChXyzbxgQjqBQSHAUdCo7jPTJO3Oi9N4/E2kT28g9TvFEdXeqo37DcWYpIUOTsVGPpsv7e927rlopR6ausaagU8oydZdxwyvdGjDywrMdn3mmM+116lVz5lySsGXngo3lI4ISGyHpWi7eTP8cAFVMVngqTSiuPeFA8KJi2j2QJy+fv1W9gOQQybBZJASX/c25wEYmcoRZDQfaQKym56qCl7orXjDvYhKnMhCxmHMnJTOv5NiaBGS5k9oBEKMpligxwmloApmsoYpHse5kEZCDZ/aGwxv+0i5H6Dj+9Aa71kts+jB810DAbzf+VzWke4KNCUrHnlCZLXbZnRFwg1g2Eb0t4dK0vuqqVTmZhpT71kCQLShVJGnQrRp9TD7BY9hrs/7HooJxGr4QiQLAl+r5uGVDGAy1Dpk/HKjPT4WhKvRWSFFkKI/qd7XFAb5lbPRN2Ywk+uA7wFsJ7rlDDOw6XU2UhKDC/nKdJKuyiHhddx3qPs6fzHeNfPoHaag4MgKqQPg285KEJimNCbSz4bb0X15S3kwasSrVvcKYFKxO+sdLCvwnkj3NlMAhB/ZX/zfkm1lqUYU54uRVfCm1z9KPb4OH+IpCWiGaV0op++ezZeS6hkjZyCBNOVEF545M/jX5SE7B+l9AUQWkohFamHuz+ZTvJCGbt25YzRKO7qEu5/2/eakygpMVCNROfeTGePv6SLlcNGRbnIpwugXEK4VQLduJ8l0Be6QCSvMUC57yTQ6513g8zQU6rT+1bQvvesXu/NY9gPwu+ajAyKzmeXrPEUSPZoVhQRTGvR4veCAZ1DpMoqflBRcNjkYd07TR3dXhENrvK1R0b5BR4NjI0mZwUD1dN5Gpn31zLupQYoW5xycbhE9zRRYFCH0hZGWSN9UyTY34mcqzUgXmnMajMx7J0roJOFAWRH9aFHCf22HB5Be8T+9RmS3xX20TqcXPH3+ZjNkbN9TzOrdIaWwLAMgJT2SgvOlTANfDtKuoYg4pECq02q8q73jgBDOQGnvHfnmpmnC2+NFSDxHT14IuVksEtqad16NNE3l2bDjJNOCaqlVNYfrKRQYJWrTa7Zs33PcDMNyBoXo7XAxZ6F5rISt1X2l1SCtxkiM6p8z1PYwhv0arFQiMZPEnTUhStmiM1F7y46jaT6LJTPGdb9XLtp1Pyu1iMtMIRURAPt6ZuIAZLgxdyZMeEKWd4gAEBJ5qJCZH3TAxYgQv3e4F5LPeF3gtAguQ5k1mo1xRSs+h55zUvKi4BR0RPZoVIo7cdFEsqQ0UiCp6L8l2qb0nLWq37wjLqJuBIUJOqHNI+2xNNI9sklmgHJDo1y9thNdPBZpjPvLTmMtOSuc0tpsGVHjIdMA5Cwo0ovdF7WnkkPJAwtX7jTRw07JVJOI2pzxZaYMOYApD7saQ29Cp4qko8LB6EpWkQSXo2on3WfUWNTC1tROAXWkGZ7Jn2AROXbXMdfZEoeXcZjfnl0sUqmbGVrNaPTDGcrVHug6e8ORiOuZrEjTMjKSXSRS+GV0DjBdAETJ/9g6RknltTSCx29Q1R7TSEn3gUrS1V1QUMLB4EREBNpUY2esM6P0jJpHerKKjUdu4bwwg5MAu3HHKSaKZXihNTXbvW8iMtcXDhRoioDUrkrhovSYcSZSpl1JsnkcGk+vEb05r2KfjvtP8dYmq6QXyEnpSJ0MLrC+jNA5js60Do9geyDTMDwdwD5rCmm/kQ6Po8rqMXSRzIqJNW2dpLsP98OL4I9PW8/A4VxFuAcSEc05O2Knxae0cOPxdc7AJg5n0wXen96ihPeSMZCebP4HmNOrKzLRzANIkXPgrq4pJOuaqJKHTlxhpDenSKSix6luZ+LpE+kCIOh/0/JuJlky4sF/FmNxc1tpE8E61DMPoRtMFKM1BubwFHwMQjB65jgqjxuhQLJFdM6wpIcuMGLGEIHdh67WeESGTunNWhRrxrHg9+wn531+GbPUPFZlmVIExuM4//FCkCej1W0zQeKOX3gwrTinQwHBt72O7sKjaoyaM0BqFw/dhy4MSgEYdkCMt6MfPBDud8EzWcyofG3dbFuHhNifuxjZAMdJjbR0cew+dJV6w0yUTa8xBFHdKipwCKp/R3Ij2nl78mQFsoH3KEa2AxDjiUg8gBCvpdrjYUWPspEeOWvyTZNRRlaB8xwLUv3TT6Y1Z0clJBIe8hmsLUafFsHb1gnpt6MepJWOGaL4sEoPl/6HHHUxwhF6r/UZsdh1ZCH0WFkr0xEbp5E+rSMB2QZAnpj/VzZSJeNI3ogGPaHd54ACIJb6tq8Z+Awm0gIy0hfapB3JODh1NMx5Xf6OR2JwEN2eEmKe8HoGh1kZu2rceaoUr9LTONEbyS3Vt0t1MBMx5WsPMhF74LjlRt66fCUxSyem/f9RTRYYc3L0nu2IgZTEwEE4vY/o6JyPcf4OTnbm3JWQm3xSK377qACgZ84wremXSLglkzwM21KQbNoWZw57pfdZLz4A/0DjMDrHSOmEcOoNsT6taMHwJwWAPVvJmBTnXbx/y8/L1++V4l/1dHFNHh1yMws1wIfuTIhv2buZRJ9vmox08Toqz/vSijuC0j58Oo/7cProaWtC9tgfdvMB+JDYaY2efUYuMQI1B+1Js7QyvUdBmWdk6prxNwpC2oQM06b1dCsfgL755gPQNx+AvvnmA9A3H4C++eYD0DcfgL75APTNNx+AvvkA9M03H4C++QD0zTcfgL75APTNt+y2/wfkT2bcKmi/MAAAAABJRU5ErkJggg=='

  private captchaId = ''

  private loginRules = {
    username: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }],
    captcha: [{ validator: this.validateCaptcha, trigger: 'blur' }],
  }

  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private capsTooltip = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  created() {
    this.getImage()
  }

  mounted() {
    if (this.loginForm.username === '') {
      (this.$refs.username as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        await UserModule.Login(this.loginForm)
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  private getImage() {
    getCaptcha().then(res => {
      this.imgSrc = 'data:image/jpeg;base64,' + res.data.base64
      this.captchaId = res.data.verificationId
    })
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $loginCursorColor; }
    input::first-line { color: $lightGray; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $lightGray;
      caret-color: $loginCursorColor;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .captchaWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .imageWrapper {
    cursor: pointer;
    height: 100%;
    padding-right: 10px;
    height: 47px;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
      height: 40px;
      border-radius: 5px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
