<script>

  import { onMount } from "svelte";
  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import BarChart from "./charts/BarChart.svelte";
  import LineChart from "./charts/LineChart.svelte";
  import PieChart from "./charts/PieChart.svelte";
  import DoughnutChart from "./charts/DoughnutChart.svelte";
  import FacturasSummary from "./FacturasSummary.svelte";
  import SvelteTable from "svelte-table";

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDfbRW5ZGQzOeNwJnHLGWcePwAdBzpJfYQ",
    authDomain: "dashboard-e88f4.firebaseapp.com",
    projectId: "dashboard-e88f4",
    storageBucket: "dashboard-e88f4.firebasestorage.app",
    messagingSenderId: "972881158096",
    appId: "1:972881158096:web:f42883ceec90f1334223d5"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let facturas = [];

  // Fetch data from Firestore
  async function fetchFacturas() {
    const querySnapshot = await getDocs(collection(db, "facturas"));
    facturas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Process data for charts after fetching
    processChartData();
  }

  onMount(fetchFacturas);

  // Function to process chart data dynamically after fetching
  function processChartData() {
    const facturasPorMes = facturas.reduce((acc, factura) => {
      const mes = factura.fecha.substring(0, 7);
      acc[mes] = (acc[mes] || 0) + factura.monto;
      return acc;
    }, {});

    datosBarras = {
      labels: Object.keys(facturasPorMes).map(mes => {
        const [year, month] = mes.split('-');
        return ${month}/${year};
      }),
      datasets: [{
        label: 'Total Facturado (€)',
        data: Object.values(facturasPorMes),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };

    datosLinea = { ...datosBarras, datasets: [{
      label: 'Evolución de Facturación (€)',
      data: Object.values(facturasPorMes),
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1
    }] };

    const facturasPorEstado = facturas.reduce((acc, factura) => {
      acc[factura.estado] = (acc[factura.estado] || 0) + 1;
      return acc;
    }, {});

    datosPie = {
      labels: Object.keys(facturasPorEstado),
      datasets: [{
        label: 'Estado de Facturas',
        data: Object.values(facturasPorEstado),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    };

    const facturacionPorCliente = facturas.reduce((acc, factura) => {
      acc[factura.cliente] = (acc[factura.cliente] || 0) + factura.monto;
      return acc;
    }, {});

    datosDoughnut = {
      labels: Object.keys(facturacionPorCliente),
      datasets: [{
        label: 'Facturación por Cliente (€)',
        data: Object.values(facturacionPorCliente),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    };
  }
</script>


<div class="dashboard">
  <div>
  <h1 class="titulo">Dashboard de Facturas</h1>
</div>
  <FacturasSummary 
    {totalFacturado} 
    {cantidadFacturas} 
    {facturasPagadas} 
    {facturasPendientes} 
  />
  
  <div class="charts-container">
    <div class="chart-box">
      <h2>Facturación Mensual</h2>
      <BarChart data={datosBarras} />
    </div>
    
    <div class="chart-box">
      <h2>Evolución de Facturación</h2>
      <LineChart data={datosLinea} />
    </div>
    
    <div class="chart-box">
      <h2>Estado de Facturas</h2>
      <PieChart data={datosPie} />
    </div>
    
    <div class="chart-box">
      <h2>Facturación por Cliente</h2>
      <DoughnutChart data={datosDoughnut} />
    </div>
  </div>

  <div class="table-container">
    <SvelteTable columns="{columns}" rows="{facturas}"></SvelteTable>
  </div>
</div>

<style>

  .titulo{
    color: rgb(74, 73, 73);
    border-bottom: 2px solid;
  }

  .table-container {
    border: 1px solid rgb(0, 0, 0);
    background-color: rgb(212, 212, 212);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1px;

  }

  .table-container {
    color: #000;
    margin-top: 20px;
    border-radius: 10px;
    background-color: white;
    border-color:rgb(202, 203, 246);
  }

  .dashboard {
    color: rgb(0, 0, 0); 
    padding: 15px 20px; 
    text-align: center; 
    border-radius: 10px;  
    margin-bottom: 20px;
  }
  
  
  .charts-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 20px;
  }
  
  .chart-box {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
  }
  
  @media (max-width: 768px) {
    .charts-container {
      grid-template-columns: 1fr;
    }
  }

</style> 