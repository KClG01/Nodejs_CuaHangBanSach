       // Hiển thị popup
       function showPopup() {
        document.getElementById("popup").style.display = "flex";
    }
    
    // Đóng popup
    function closePopup() {
        document.getElementById("popup").style.display = "none";
    }
    
    // Tự động hiển thị popup sau 3 giây (tùy chọn)
    
    // window.onload = function() {
    //     setTimeout(showPopup, 3000);
    // };
    
    // Xử lý form khi gửi
    document.getElementById("contactForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Ngăn form gửi đi mặc định
    
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
    
        // Ở đây bạn có thể gửi dữ liệu đến server (dùng fetch hoặc AJAX)
        console.log("Thông tin:", { name, email, phone });
    
        alert("Cảm ơn bạn đã gửi thông tin!");
        closePopup();
    });

    $(document).ready(function() {
        $('.selectpicker').selectpicker();
    });
    
    function navigateToCategory() {
        const categoryId = document.getElementById('categoryDropdown').value;
        if (categoryId) {
            window.location.href = `/category/${categoryId}`; // Chuyển hướng tới trang danh mục
        }
    }