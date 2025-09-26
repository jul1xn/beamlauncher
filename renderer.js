document.getElementById('btn').addEventListener('click', async () => {
  const result = await window.api.getMessage()
  document.getElementById('output').innerText = result.message
})
