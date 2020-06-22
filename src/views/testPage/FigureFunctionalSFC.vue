<template functional>
  <figure :class="props.type" @click="listeners.click">
    <img :src="props.src">
    <figcaption v-if="slots().default">
      <span><slot /></span>
    </figcaption>
    <div v-if="props.tags && props.type !== 'framed'" class="tags">
      <span v-for="tag in props.tags"> {{ tag }}</span>
    </div>
  </figure>
</template>

<script>
export default {
  name: 'FigureFunctionalSFC',
  props: {
    src: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    tags: {
      required: false,
      type: Array
    }
  }
}
</script>
