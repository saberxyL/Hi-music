<script setup></script>

<template>
  <section class="featured-section">
    <div class="featured-card">
      <div class="info">
        <span class="tag">新碟上架</span>
        <h2>夜的第七章</h2>
        <p>周杰伦 - 依然范特西</p>
        <div class="actions">
          <el-button type="primary" round>
            <span class="iconfont icon-video-play"></span>
            立即播放
          </el-button>

          <el-button round icon="Star">收藏</el-button>
        </div>
      </div>
      <div class="cover">
        <!-- Placeholder for album art -->
        <div class="album-art"></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.featured-section {
  margin-bottom: 40px;

  .featured-card {
    background: linear-gradient(
      135deg,
      rgba(30, 30, 30, 0.8),
      rgba(10, 10, 10, 0.9)
    );
    border-radius: 24px;
    padding: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);

    .info {
      z-index: 2;
      max-width: 50%;

      .tag {
        background: $accent-color;
        color: #000;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }

      h2 {
        font-size: 42px;
        margin: 16px 0;
        background: linear-gradient(to right, #fff, #aaa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      p {
        color: $text-secondary;
        margin-bottom: 24px;
        font-size: 18px;
      }

      .actions {
        display: flex;
        gap: 16px;
      }
    }

    .cover {
      width: 250px;
      height: 250px;
      background: #333;
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      transform: rotate(-5deg);
      z-index: 2;
      background-image: url('https://p1.music.126.net/5zs7IvmLv7Szq9xdhGL26Q==/109951165421200265.jpg');
      background-size: cover;
    }

    // Background decoration
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 100%;
      background: radial-gradient(
        circle at center,
        rgba(0, 198, 251, 0.1),
        transparent 70%
      );
      pointer-events: none;
    }
  }
}

@media (max-width: 768px) {
  .featured-section {
    .featured-card {
      flex-direction: column-reverse;
      padding: 20px;
      text-align: center;

      .info {
        max-width: 100%;

        h2 {
          font-size: 24px;
        }
        .actions {
          justify-content: center;
        }
      }

      .cover {
        width: 160px;
        height: 160px;
        margin-bottom: 20px;
        transform: rotate(0);
      }
    }
  }
}
</style>
