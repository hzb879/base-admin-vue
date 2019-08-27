<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar? avatar: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile">
            <el-dropdown-item>
              个人中心
            </el-dropdown-item>
          </router-link>
          <a @click="updatePwdShow = true">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="updatePwdShow" @close="resetUpdatePwd">
      <el-form ref="updatePwdForm" status-icon :rules="rules" :model="cipherChanger" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="密码" prop="oldCipher">
          <el-input v-model="cipherChanger.oldCipher" type="password" autocomplete="off" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="repeatCipher">
          <el-input v-model="cipherChanger.repeatCipher" type="password" autocomplete="off" placeholder="再次输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newCipher">
          <el-input v-model="cipherChanger.newCipher" type="password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePwdShow = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePwd">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'
import Screenfull from '@/components/Screenfull'
import { changeOwnCipher } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search,
    Screenfull
  },
  data() {
    const validateNewCipher = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('新密码不能为空'))
      }
      callback()
    }
    const validateOldCipher = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.cipherChanger.repeatCipher) {
          this.$refs.updatePwdForm.validateField('repeatCipher')
        }
        callback()
      }
    }
    const validateRepeatCipher = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入旧密码'))
      } else if (value !== this.cipherChanger.oldCipher) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      rules: {
        oldCipher: [
          { validator: validateOldCipher, trigger: 'blur' }
        ],
        repeatCipher: [
          { validator: validateRepeatCipher, trigger: 'blur' }
        ],
        newCipher: [
          { validator: validateNewCipher, trigger: 'blur' }
        ]
      },
      updatePwdShow: false,
      cipherChanger: {
        oldCipher: '',
        newCipher: '',
        repeatCipher: ''
      }

    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    updatePwd() {
      this.$refs['updatePwdForm'].validate((valid) => {
        if (valid) {
          changeOwnCipher(this.cipherChanger).then(() => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.updatePwdShow = false
          })
        }
      })
    },
    resetUpdatePwd() {
      this.$refs['updatePwdForm'].resetFields()
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
