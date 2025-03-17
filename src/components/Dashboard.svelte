<script>
  import { onMount } from "svelte";
  import BarChart from "./charts/BarChart.svelte";
  import LineChart from "./charts/LineChart.svelte";
  import PieChart from "./charts/PieChart.svelte";
  import FacturasSummary from "./FacturasSummary.svelte";
  import PieChart2 from "./charts/PieChart2.svelte";
  import SvelteTable from "svelte-table";
  import { collection, db, getDocs } from "../lib/Firebase";

  let totalFacturado = 0;
  let cantidadFacturas = 0;
  let facturasPagadas = 0;
  let facturasPendientes = "";
  let columns = [];
  let facturas = [];

  let datosBarras, datosLinea, datosPie, datosDoughnut;

  async function fetchFacturas() {
    try {
      console.log("Iniciando consulta a Firebase...");

      const querySnapshot = await getDocs(collection(db, "facturas"));

      if (!querySnapshot.empty) {
        facturas = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        console.log("Facturas obtenidas de Firebase:", facturas);

        processChartData();
        processSummaryData(); 
      } else {
        console.warn("No hay facturas en Firebase.");
      }
    } catch (error) {
      console.error("ERROR al obtener datos de Firebase:", error);
    }
  }

  onMount(fetchFacturas);

  function processChartData() {
    if (!facturas || facturas.length === 0) {
      console.warn("No hay facturas para procesar gráficos.");
      return;
    }

    // 🔹 Contar facturas por empresa
    const facturasPorEmpresa = facturas.reduce((acc, factura) => {
      const empresa = factura.empresa || "Desconocido"; // Si no hay empresa, asignar "Desconocido"
      acc[empresa] = (acc[empresa] || 0) + 1;
      return acc;
    }, {});

    console.log("Facturas por Empresa:", facturasPorEmpresa);

    // 🔹 Datos para el BarChart
    datosBarras = {
      labels: Object.keys(facturasPorEmpresa), // Nombres de empresas
      datasets: [
        {
          label: "Número de Facturas por Empresa",
          data: Object.values(facturasPorEmpresa), // Cantidad de facturas por empresa
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };

    datosBarras = { ...datosBarras }; // 🔄 Forzar actualización en Svelte

    // 🔹 Normalizar y ordenar las fechas de emisión
    let facturasOrdenadas = facturas.map((factura) => {
      let fecha = factura.fechaEmision;

      if (!fecha || typeof fecha !== "string") {
        console.warn("Factura sin fecha válida:", factura);
        return null;
      }

      if (fecha.includes("/")) {
        const partes = fecha.split("/");
        if (partes.length === 3) {
          fecha = `${partes[2]}-${partes[1]}-${partes[0]}`; // Convertir a formato YYYY-MM-DD
        }
      }

      return { fecha, monto: factura.total || 0 };
    }).filter(Boolean); // Elimina facturas nulas si hay errores


    console.log("Fechas ordenadas:", facturasOrdenadas);

    // 🔹 Generar datos para LineChart
    datosLinea = {
      labels: facturasOrdenadas.map((f) => f.fecha), // Fechas en el eje X
      datasets: [
        {
          label: "Facturación por Fecha (€)",
          data: facturasOrdenadas.map((f) => f.monto), // Valores en el eje Y
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 2,
          fill: true,
        },
      ],
    };

    datosLinea = { ...datosLinea }; 

    console.log("Datos para LineChart:", datosLinea);

    const ivaCounts = facturas.reduce((acc, factura) => {
      const iva = factura.iva || "Desconocido"; // Si no tiene IVA, poner "Desconocido"
      acc[iva] = (acc[iva] || 0) + 1;
      return acc;
    }, {});

    console.log("IVAs utilizados en las facturas:", ivaCounts);

    datosPie = {
      labels: Object.keys(ivaCounts), // IVAs distintos
      datasets: [
        {
          label: "Uso de IVAs",
          data: Object.values(ivaCounts), // Cantidad de veces que se usa cada IVA
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    datosPie = { ...datosPie }; // Forzar actualización en Svelte


    if (!facturas || facturas.length === 0) {
    console.warn("No hay facturas para procesar gráficos.");
    return;
  }

  // 🔹 Contar facturas por empresa
  const facturasPorEmpresa2 = facturas.reduce((acc, factura) => {
    const empresa = factura.empresa || "Desconocido";
    acc[empresa] = (acc[empresa] || 0) + 1;
    return acc;
  }, {});

  console.log("Facturas por Empresa:", facturasPorEmpresa2);

  // 🔹 Datos para el BarChart
  datosBarras = {
    labels: Object.keys(facturasPorEmpresa2),
    datasets: [
      {
        label: "Número de Facturas por Empresa",
        data: Object.values(facturasPorEmpresa2),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  datosBarras = { ...datosBarras };

  // 🔹 Procesamiento de Bases Imponibles para PieChart2
  const basesImponibles = facturas.reduce((acc, factura) => {
    const base = factura.baseImponible || 0;
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});

  console.log("Bases Imponibles Procesadas:", basesImponibles);

  datosDoughnut = {
    labels: Object.keys(basesImponibles).map((b) => `€${b}`),
    datasets: [
      {
        label: "Bases Imponibles (€)",
        data: Object.values(basesImponibles),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  datosDoughnut = { ...datosDoughnut }; // 🔄 Forzar actualización en Svelte



  }

  function processSummaryData() {
    if (!facturas || facturas.length === 0) {
      totalFacturado = 0;
      cantidadFacturas = 0;
      facturasPagadas = 0;
      facturasPendientes = "";
      return;
    }

    // 🔹 Sumar todos los totales de facturas
    totalFacturado = facturas.reduce((sum, factura) => sum + (factura.total || 0), 0);

    // 🔹 Cantidad de facturas (total de documentos en la base de datos)
    cantidadFacturas = facturas.length;

    // 🔹 Último IVA registrado en la base de datos
    facturasPagadas = facturas[facturas.length - 1]?.iva || 0;

    // 🔹 Última dirección registrada en la base de datos
    facturasPendientes = facturas[facturas.length - 1]?.direccion || "N/A";

    console.log("Resumen de Facturas - Total Facturado:", totalFacturado);
    console.log("Cantidad de Facturas:", cantidadFacturas);
    console.log("Último IVA registrado (facturasPagadas):", facturasPagadas);
    console.log("Última Dirección (facturasPendientes):", facturasPendientes);
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
      <h2>Facturas por Empresa</h2>
      {#if datosBarras}
        <BarChart data={datosBarras} />
      {/if}
    </div>

    <div class="chart-box">
      <h2>Total Facturado</h2>
      {#if datosLinea}
        <LineChart data={datosLinea} />
      {/if}
    </div>

    <div class="chart-box">
      <h2>IVA Utilizado</h2>
      {#if datosPie}
        <PieChart data={datosPie} />
      {/if}
    </div>

    <div class="chart-box">
      <h2>Bases Imponibles</h2>
      {#if datosDoughnut}
        <PieChart2 data={datosDoughnut} />
      {/if}
    </div>
    




    <div class="table-container">
      <SvelteTable {columns} rows={facturas}></SvelteTable>
    </div>
  </div>
</div>






<style>
  .titulo {
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
    border-color: rgb(202, 203, 246);
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
