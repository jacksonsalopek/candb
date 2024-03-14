<template>
  <div class="px-6 grid grid-cols-3 gap-4">
    <InputSelect :options="brands" label="Brand" v-model="selectedBrand1" />
    <InputSelect :options="models" label="Model" v-model="selectedModel1" />
  </div>
  <div class="mt-2 px-6 grid grid-cols-3 gap-4">
    <InputSelect :options="brands" label="Brand" v-model="selectedBrand2" />
    <InputSelect :options="models2" label="Model" v-model="selectedModel2" />
  </div>
  <FRGraph :brand1="selectedBrand1" :model1="selectedModel1" :brand2="selectedBrand2" :model2="selectedModel2" />
</template>

<script setup lang="ts">
import { BRANDS_IEM } from '~/shared/constants';

const brands = ref(BRANDS_IEM);
const selectedBrand1 = ref('');
const selectedModel1 = ref('');
const selectedBrand2 = ref('');
const selectedModel2 = ref('');
const models = ref([]);
const models2 = ref([]);

// Watch for changes to selectedBrand and refetch data when it changes
watch(selectedBrand1, async (newBrand, oldBrand) => {
  if (newBrand !== oldBrand) {
    const { data } = await useFetch(`/api/iems?brand=${newBrand}`);
    models.value = data.value.iems.map(iem => iem.model);
  }
}, { immediate: true }); // Use { immediate: true } to run on initial setup as well
watch(selectedModel1, (newModel, oldModel) => {
  console.log(`selectedModel: ${newModel}`);
})
watch(selectedBrand2, async (newBrand, oldBrand) => {
  if (newBrand !== oldBrand) {
    const { data } = await useFetch(`/api/iems?brand=${newBrand}`);
    models2.value = data.value.iems.map(iem => iem.model);
  }
}, { immediate: true }); // Use { immediate: true } to run on initial setup as well
watch(selectedModel2, (newModel, oldModel) => {
  console.log(`selectedModel: ${newModel}`);
})
</script>
