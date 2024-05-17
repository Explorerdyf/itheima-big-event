<script setup>
// 一个个导入在这个会使得App.vue太大
//  import { useUserStore } from "@/stores/models/user";
// 从统一的出口里导入
// import { useUserStore } from '@/stores'
// const userStore = useUserStore()
// 中英转换
import { computed, ref } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
</script>

<template>
  <div>
    <!-- 一级路由出口 -->
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </div>
  <!-- <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button>
  <div>我是App</div> -->
</template>

<style scoped></style>
