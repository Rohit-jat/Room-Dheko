
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('searchInput').value.trim();
    if (input) {
      window.location.href = `/search/${encodeURIComponent(input)}`;
    }
  });
