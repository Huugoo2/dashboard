<script>
  import Dashboard from './components/Dashboard.svelte';
</script>

<main>
  <Dashboard />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
  }
  
  main {
    width: 100%;
    min-height: 100vh;
  }
</style>
