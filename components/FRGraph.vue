<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Line } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  brand?: string,
  model?: string,
}

const props = defineProps<Props>();
const chartOptions = {
  responsive: true,
}
let chartData = ref({
  datasets: [
    {
      data: [],
    }
  ]
});
watch(props, async (newProps) => {
  if (newProps.brand && newProps.model) {
    const frData = await $fetch(`/api/frequency-response?brand=${props.brand}&model=${props.model}`);

    const labels = frData.fr.map(item => item.frequency);
    const dataPoints = frData.fr.map(item => item.raw);

    chartData.value = {
      labels: labels, // x-axis data (Frequency)
      datasets: [{
        label: `${props.brand} ${props.model} Frequency Response`,
        data: dataPoints, // y-axis data (Gain)
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    }
  }
}, { deep: true })
</script>
