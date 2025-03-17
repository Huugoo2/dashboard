<script>
  import { onMount, onDestroy } from "svelte";
  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    PieController,
  } from "chart.js";

  // Registrar los componentes necesarios para las gráficas circulares
  ChartJS.register(ArcElement, Tooltip, Legend, PieController);

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
      type: "pie",
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

  // Actualizar el gráfico cuando cambien los datos
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
