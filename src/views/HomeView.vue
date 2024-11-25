<template>
  <div class="view bg-color-blue">
    <FButtonIcon
      name="tooltip"
      class="tooltip"
      color="blue-light"
      small
      @click="toggleInfoCard"
    />
    <div class="heading">
      <div class="title">
        <FTitle class="title"> air quality</FTitle>
        <FTitle class="title"> in brussels</FTitle>
      </div>
      <FSubTitle class="subtitle"> Climate and Energy </FSubTitle>
    </div>
    <FButton
      label="Start demo"
      type="primary"
      class="start-button"
      on-dark
      @click="$router.push('/interactive')"
    />
    <FFooter class="footer" />
  </div>
</template>

<script setup lang="ts">
import {
  FTitle,
  FSubTitle,
  FFooter,
  FButtonIcon,
  FButton,
} from 'fari-component-library'
import { ref } from 'vue'

const showInfoCard = ref(false)
const toggleInfoCard = () => (showInfoCard.value = !showInfoCard.value)
</script>

<style scoped lang="scss">
.view {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  width: 100%;
  position: relative;
}
.tooltip {
  position: absolute;
  top: 7rem;
  right: 40rem;
}

.heading {
  width: 100%;
  position: absolute;
  top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space;

  .title {
    gap: 1rem;
    display: flex;
    flex-direction: column;
  }
}

.start-button {
  display: inline-block;
  width: auto;
  position: absolute;
  top: 50%;
  left: 45%;
}

.footer {
  margin-top: auto;
  margin-bottom: 1.8rem;
}
</style>
