<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="详细信息" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Account },
  data() {
    return {
      user: {},
      activeTab: 'account'
    }
  },
  computed: {
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.$store.dispatch('user/getInfo').then((data) => {
        this.user = data
      })
    }
  }
}
</script>
