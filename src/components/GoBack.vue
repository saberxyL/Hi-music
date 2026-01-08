<script setup>
import { useRouter } from 'vue-router'
defineProps({
  top: {
    type: String,
    default: '10'
  }
})
const router = useRouter()
const handleBack = () => {
  router.back()
}
</script>
<template>
  <div
    class="back-btn-wrapper"
    :style="{ top: top + 'px' }"
    @click="handleBack"
  >
    <div class="icon-box">
      <el-icon><ArrowLeft /></el-icon>
      <span class="back-text">
        <slot>返回</slot>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.back-btn-wrapper {
  position: fixed;
  left: 50px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  .icon-box {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    color: rgba(255, 255, 255, 0.7);
    overflow: hidden;

    .el-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 20px;
      transition: transform 0.3s ease;
    }

    .back-text {
      position: absolute;
      top: 50%;
      left: 100px;
      display: inline-block;
      opacity: 0;
      text-wrap: nowrap;
      font-size: 15px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.6);
      transform: translate(0, -50%);
      transition: all 0.3s ease;
      pointer-events: none; // 防止文字阻挡点击
    }
  }

  &:hover {
    left: 40px;
    .icon-box {
      background: $accent-color;
      border-color: $accent-color;
      color: #fff;
      width: 120px;
      box-shadow: 0 8px 20px rgba($accent-color, 0.4);

      .el-icon {
        transform: translateY(-50%); // 箭头小动画
      }
      .back-text {
        opacity: 1;
        left: 35px;
        top: 50%;
        color: #fff;
      }
    }
  }
}
</style>
