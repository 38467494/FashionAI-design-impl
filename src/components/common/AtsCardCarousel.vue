<template>
  <div ref="swiper" class="swiper">
    <div class="swiper-wrapper">
      <!-- Slides -->
      <div class="swiper-slide py-16" v-for="imgsrc in imgs">
        <FrostedGlassContentCard
          class="p-3"
          style="
                  border-radius: 6%;
                  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.35)"
        >
          <img
            style="height: 100%; max-height: 55vh; width: auto;"
            :src="imgsrc"
            class="rounded-lg"/>
        </FrostedGlassContentCard>
      </div>
    </div>
    <div class="swiper-pagination">
    </div>
  </div>
</template>

<script>
import FrostedGlassContentCard from "./FrostedGlassContentCard";
import Swiper, {Autoplay,EffectCards,Pagination} from "swiper"
import 'swiper/swiper-bundle.min.css'
export default {
  name: "AtsCardCarousel",
  components: {
    FrostedGlassContentCard
  },
  props: {
    imgs: {
      type: Array,
      required: true,
    }
  },
  mounted() {
    new Swiper(this.$refs.swiper, {
      modules: [Autoplay, EffectCards, Pagination],
      effect: "cards",
      cardsEffect: {
        slideShadows: false,
      },
      autoHeight: true,
      grabCursor: true,

      loop: false,
      // autoplay: {
      //   delay: 3 * SECOND,
      //   disableOnInteraction: false,
      // },
      // speed: 2 * SECOND,
      pagination: {
        el: '.swiper-pagination',
        clickable: false,
      },

      on: {
        slideChange: (swiper) => {
          this.activeIndex = swiper.realIndex
        },
      },
    })
  },
}
</script>

<style scoped>
.swiper {
  width: 50vw;
  height: 80vh;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
