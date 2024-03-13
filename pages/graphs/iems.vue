<template>
  <div class="px-6 grid grid-cols-3 gap-4">
    <InputSelect :options="brands" label="Brand" v-model="selectedBrand" />
    <InputSelect :options="models" label="Model" v-model="selectedModel" />
  </div>
  <FRGraph :brand="selectedBrand" :model="selectedModel" />
</template>

<script setup lang="ts">
import { BRANDS_IEM } from '~/shared/constants';

const brands = ref(BRANDS_IEM);
const selectedBrand = ref('');
const selectedModel = ref('');
const models = ref([]);

// Watch for changes to selectedBrand and refetch data when it changes
watch(selectedBrand, async (newBrand, oldBrand) => {
  if (newBrand !== oldBrand) {
    const { data } = await useFetch(`/api/iems?brand=${newBrand}`);
    models.value = data.value.iems.map(iem => iem.model);
  }
}, { immediate: true }); // Use { immediate: true } to run on initial setup as well
watch(selectedModel, (newModel, oldModel) => {
  console.log(`selectedModel: ${newModel}`);
})
</script>
