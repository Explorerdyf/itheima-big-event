import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)
export default pinia

// 作为仓库的统一出口
/* import { useUserStore } from '@/stores/models/user'
export { useUserStore } */
// 下面的代码，相当于即导入，又导出
export * from '@/stores/modules/user.js'
