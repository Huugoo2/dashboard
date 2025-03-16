<script>
  import { onMount, onDestroy } from 'svelte';
  import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController
  } from 'chart.js';
  
  // Registrar los componentes necesarios para las gráficas de línea
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    LineController
  );
  
  export let data;
  export let options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Evolución de Facturación'
      }
    }
  };

  let chart;
  let chartElement;

  onMount(() => {
    chart = new ChartJS(chartElement, {
      type: 'line',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Evolución de Facturación'
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