<script>
  $: console.log("Datos recibidos en BarChart:", data);
  import { onMount, onDestroy } from 'svelte';
  import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController
  } from 'chart.js';
  
  // Registrar los componentes necesarios para las gráficas de barras
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController
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
        text: 'Facturación Mensual'
      }
    }
  };

  let chart;
  let chartElement;

  onMount(() => {
  if (chartElement) {
    chart = new ChartJS(chartElement, {
      type: 'bar',
      data
    });
  }
});


  // Actualizar el gráfico cuando cambien los datos
  $: if (chart && data) {
    chart.config.data = { ...data };
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