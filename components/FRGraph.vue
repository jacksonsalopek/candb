<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';
import { ref, watch } from 'vue';
import type { Target } from '~/shared/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORS = [
  'rgb(255, 99, 132)', // Red
  'rgb(54, 162, 235)', // Blue
  'rgb(255, 206, 86)', // Yellow
  'rgb(75, 192, 192)', // Green
  'rgb(153, 102, 255)', // Purple
  'rgb(255, 159, 64)', // Orange
];

type Headphone = {
  brand: string;
  model: string;
};

type FrequencyResponse = {
  fr: { raw: number; freq: number }[];
};

type Props = {
  headphones: Headphone[];
  targets: Target[];
};

const props = defineProps<Props>();
const chartOptions = {
  responsive: true,
  elements: {
    point: {
      radius: 0
    }
  }
};
let chartData = ref({ datasets: [] });

const fetchHeadphoneData = async (headphone: Headphone) => {
  return await $fetch<FrequencyResponse>(`/api/frequency-response?brand=${headphone.brand}&model=${headphone.model}`);
};

const updateChartData = async () => {
  const datasets = await Promise.all(
    props.headphones.map(async (headphone, index) => {
      if (!headphone.brand || !headphone.model) return {
        label: 'TBD',
        data: [],
        fill: false,
        borderColor: `rgb(0, 0, 0)`,
        tension: 0.1,
      };
      const frData = await fetchHeadphoneData(headphone);
      const dataPoints = frData.fr.map(item => item.raw);
      return {
        label: `${headphone.brand} ${headphone.model} FR`,
        data: dataPoints,
        fill: false,
        borderColor: COLORS[index],
        tension: 0.1,
      };
    })
  );

  // If there is at least one dataset, show the target curve
  if (datasets.length > 0 && datasets.reduce((acc, d) => acc || d.data.length > 0, false)) {
    datasets.push(...props.targets.map(target => ({
      label: target.name,
      data: target.data.map(item => item.raw),
      fill: false,
      borderColor: 'rgb(201, 203, 207)',
      borderDash: [5, 5],
      tension: 0.1,
    })));
  }

  if (datasets.length > 0 && datasets.every(d => d)) {
    chartData.value = {
      labels: datasets[0].data.map((_, i) => i), // Assuming all datasets have the same length
      datasets,
    };
  }
};

watch(props, updateChartData, { deep: true, immediate: true });
</script>
