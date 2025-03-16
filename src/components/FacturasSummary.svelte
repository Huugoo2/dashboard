<script>
  export let totalFacturado;
  export let cantidadFacturas;
  export let facturasPagadas;
  export let facturasPendientes;
  
  // Función para formatear cantidades como moneda
  function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  }
</script>

<div class="summary-container">
  <div class="summary-card">
    <div class="icon">💰</div>
    <div class="content">
      <h3>Total Facturado</h3>
      <p>{formatCurrency(totalFacturado)}</p>
    </div>
  </div>
  
  <div class="summary-card">
    <div class="icon">📄</div>
    <div class="content">
      <h3>Facturas Emitidas</h3>
      <p>{cantidadFacturas}</p>
    </div>
  </div>
  
  <div class="summary-card">
    <div class="icon">✅</div>
    <div class="content">
      <h3>Facturas Pagadas</h3>
      <p>{facturasPagadas}</p>
    </div>
  </div>
  
  <div class="summary-card">
    <div class="icon">⏳</div>
    <div class="content">
      <h3>Facturas Pendientes</h3>
      <p>{facturasPendientes}</p>
    </div>
  </div>
</div>

<style>
  .summary-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .summary-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    align-items: center;
  }
  
  .icon {
    font-size: 2rem;
    margin-right: 15px;
  }
  
  .content h3 {
    font-size: 0.9rem;
    color: #777;
    margin: 0 0 5px 0;
  }
  
  .content p {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333;
    margin: 0;
  }
  
  @media (max-width: 992px) {
    .summary-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 576px) {
    .summary-container {
      grid-template-columns: 1fr;
    }
  }
</style> 