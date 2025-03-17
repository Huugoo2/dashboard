<script>
  import { onMount, onDestroy } from "svelte";
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController,
  } from "chart.js";

  ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

  export let data;
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: false,
        text: "Estado de Facturas",
      },
    },
  };

  let chart;
  let chartElement;

  onMount(() => {
    chart = new ChartJS(chartElement, {
      type: "doughnut", 
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: false,
            text: "Estado de Facturas",
          },
        },
      },
    });
  });

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });

  $: if (chart && data) {
    chart.data = data;
    chart.update();
  }
</script>

<div class="chart-container">
  <canvas bind:this={chartElement}></canvas>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
  }
</style>
