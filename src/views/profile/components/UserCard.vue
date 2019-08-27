<template>
  <el-card style="margin-bottom:20px;">
    <template #header>
      <div class="clearfix">
        <span>{{ user.username }}</span>
      </div>
    </template>
    <div class="user-profile">
      <div class="box-center">
        <el-avatar :size="100" :src="user.avatar" @click.native="imagecropperShow=true" />
      </div>

      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
      </div>

    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>角色</span></div>
        <div class="user-bio-section-body">
          <div v-for="roleName of user.roleCnNames" :key="roleName" class="text-muted">
            {{ roleName }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="/upload/local/own-avatar"
      lang-type="zh"
      @close="close"
      @crop-upload-success="cropSuccess"
    />

  </el-card>
</template>

<script>
import ImageCropper from '@/components/ImageCropper'

export default {
  components: { ImageCropper },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          username: '',
          avatar: '',
          roles: '',
          roleCnNames: []
        }
      }
    }
  },
  data: function() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.user.avatar = resData.src
      this.$store.commit('user/SET_AVATAR', resData.src)
    },
    close() {
      this.imagecropperShow = false
    }
  }

}
</script>

<style lang="scss" scoped>
 .box-center {
   margin: 0 auto;
   display: table;
 }

 .text-muted {
   color: #777;
 }

 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .box-center {
     padding-top: 10px;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }

 .user-bio {
   margin-top: 20px;
   color: #606266;

   span {
     padding-left: 4px;
   }

   .user-bio-section {
     font-size: 14px;
     padding: 15px 0;

     .user-bio-section-header {
       border-bottom: 1px solid #dfe6ec;
       padding-bottom: 10px;
       margin-bottom: 10px;
       font-weight: bold;
     }
   }
 }
</style>
