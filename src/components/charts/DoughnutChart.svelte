<script>
  import { onMount, onDestroy } from 'svelte';
  import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController
  } from 'chart.js';
  
  // Registrar los componentes necesarios para las gráficas de dona
  ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    DoughnutController
  );
  
  export let data;
  export let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: false,
        text: 'Facturación por Cliente'
      }
    }
  };

  let chart;
  let chartElement;

  onMount(() => {
    chart = new ChartJS(chartElement, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: 'Facturación por Cliente'
          }
        }
      }
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