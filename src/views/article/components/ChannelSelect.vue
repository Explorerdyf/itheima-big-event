<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
// 显示下拉列表
const channelList = ref([])

const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()
// 接受父组件传来的cate_id
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})

// 向父组件发送更新
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <!-- 这里将v-model拆分了(下拉框需要拆分)，因为当选择了一个 option 后，需要监视选择的option，然后发送给父组件消息 -->
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<style lang="scss" scoped>
.el-select {
  min-width: 100px;
}
</style>
