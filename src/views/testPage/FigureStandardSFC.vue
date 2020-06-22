<template>
  <figure :class="type" @click="$emit('click')">
    <img :src="src">
    <figcaption v-if="$slots.default">
      <span><slot /></span>
    </figcaption>
    <div v-if="tags && type !== 'framed'" class="tags">
      <span v-for="tag in tags"> {{ tag }}</span>
    </div>
    {{ src }}

    {{ $slots.default }}
  </figure>
</template>

<script>
export default {
  name: 'FigureStandardSFC',
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
