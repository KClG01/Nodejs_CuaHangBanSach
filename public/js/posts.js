{/* <script>
  $(document).ready(function () {
    $('#postsTable').DataTable({
      ajax: {
        url: 'http://localhost:3000/posts',
        dataSrc: 'data',
        error: function (xhr, error, thrown) {
          console.error("❌ Lỗi JSON trả về từ server:", xhr.responseText);
        }
      },
      columns: [
        {
          data: 'image_url',
          render: function (data) {
            return `<img src="/path/to/images/${data}" width="80"/>`;
          }
        },
        { data: 'title' },
        { data: 'created_at' },
        { data: 'category_name' }, 
        { data: 'status' }
      ]
    })};
    );
</script> */}