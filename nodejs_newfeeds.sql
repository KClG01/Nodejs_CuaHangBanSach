-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 08, 2025 at 10:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `da_nodejs_newsfeed`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Công nghệ', '2025-03-31 18:00:00', '2025-05-06 19:23:35'),
(2, 'Xã hội', '2025-03-31 18:00:00', '2025-05-06 19:23:35'),
(3, 'Thế giới', '2025-03-31 18:00:00', '2025-05-06 19:23:35'),
(5, 'Giáo dục', '2025-03-31 18:00:00', '2025-05-06 19:23:35');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `email`, `content`, `created_at`) VALUES
(2, 8, '0306231386@caothang.edu.vn', 'Nhớ mãi những buổi học cùng nhau, thật biết bao kĩ niệm. Hi vọng clb sẽ tiếp tục phát triển', '2025-05-08 07:03:59'),
(3, 8, '0306231394@caothang.edu.vn', 'Em chúc mừng và em hi vọng được tham gia vào clb của mình\r\n', '2025-05-08 07:04:40'),
(4, 8, '0306231436@caothang.edu.vn', 'Chúc mừng sinh nhật câu lạc bộ. Thật hãnh diện khi là thành viên của clb', '2025-05-08 07:05:46'),
(5, 8, '0306231425@caothang.edu.vn', 'Thật hào hứng khi nghe tin câu lạc bộ lại thêm 1 năm tuổi nữa hy vong tuổi clb sẽ đón nhận nhiều  thành công hơn \r\n', '2025-05-08 07:06:51'),
(6, 8, 'itclub@caothang.edu.vn', 'Một hành trình nhiều kĩ niệm bên nhau mãi! yêu!', '2025-05-08 07:09:45');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `sdt` char(10) NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `sdt`, `title`, `message`, `status`, `created_at`) VALUES
(1, 'adhiuahgoaf', 'ada@gm.com', '12313212', 'adsagagagasgagag', 'asdadadads', 1, '2025-05-08 04:35:43'),
(2, 'Lữ Cao Tiến', 'lucaotien@caothang.edu.vn', '0987654321', 'Tôi muốn đăng bài tuyển thành viên câu lạc bộ tin học', '🎉🎂Chúc mừng sinh nhật lần thứ 14 cho Câu lạc bộ Tin học Cao Thắng! 🎂🎉\nHôm nay là một ngày đặc biệt không chỉ là kỉ niệm thành lập CLB mà còn là sự trở lại mạnh mẽ sau 1 thời gian vắng lặng. \n🙆 CLB đang có mục tiêu phát triển CLB mạnh hơn nữa, mở đầu cho việc đó là Khoá học Unity 2D. Đánh dấu bước ngoặc mới cho CLB phát triển và mở rộng chuyên môn trong các lĩnh vực mới.\n\n🎯Bên cạnh đó CLB định hướng xây dựng và tạo ra một môi trường chủ động và tích cực, khuyến khích chia sẻ kiến thức để cùng nhau và phát triển. Qua đó có thể phát triển kỹ năng cá nhân của mỗi thành viên và mở rộng mối quan hệ trong và ngoài CLB.\nNhân dịp, sinh nhật lần thứ 14 của CLB Tin Học Ban chủ nhiệm xin gửi lời cảm ơn chân thành nhất tới Quý thầy/cô giáo Khoa Công nghệ Thông tin, Đoàn - Hội Sinh viên trường, các CLB - đội - nhóm trong - ngoài trường đã luôn tạo điều kiện, giúp đỡ cho phía CLB và đặc biệt cảm ơn các bạn thành viên CLB Tin học qua các khóa đã luôn hỗ trợ, góp sức xây dựng, duy trì CLB ngày càng phát triển lớn mạnh hơn.\n🎊 Hy vọng rằng, trong chặng đường tiếp theo, CLB sẽ tiếp tục phát triển mạnh mẽ, lan tỏa giá trị tích cực, trở thành nơi đồng hành vững chắc cho những thế hệ sinh viên Cao Thắng năng động, sáng tạo và yêu thích Tin học.\n#KhoaCNTT #CaoThắng #ITClubCT \n---------------------------------------------------------------—\nWebsite Khoa CNTT: http://cntt.caothang.edu.vn \nFanpage Khoa CNTT: fb.com/cntt.caothang.edu.vn \nCộng đồng sinh viên: fb.com/groups/fit.caothang \nCLB Tin học: fb.com/itclub.caothang', 0, '2025-05-08 06:55:58');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `Author` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `views` int(255) NOT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `category_id`, `Author`, `image_url`, `content`, `views`, `status`, `created_at`) VALUES
(1, 'Phương án sắp xếp chi tiết 30 quận, huyện, thị xã của Hà Nội', 2, 'Phạm Quốc Khánh', '/images/p1.png', 'Hà Nội với tổng diện tích gần 3.360 km2, 30 đơn vị hành chính cấp huyện và dân số khoảng hơn 8,5 triệu người, dự kiến giảm từ 526 phường xã xuống còn 126.\n\n12 quận trung tâm của thành phố Hà Nội có 153 phường, diện tích chiếm hơn 9% toàn thành phố, dân số chiếm 42%. Trong đó, Quận Long Biên có diện tích lớn nhất là 56 km2, quận Hoàn Kiếm có diện tích nhỏ nhất là 5,17 km2. Hoàng Mai có dân số lớn nhất là hơn 430.000 người, Tây Hồ có dân số ít nhất 167.000 người.', 0, 1, '2025-04-14 16:13:52'),
(2, 'Xe container bốc cháy ngùn ngụt trên đường ở Hà Nội', 3, 'Bùi Huy Khang', '/images/p2.png', 'Đang chạy trên đường Khuất Duy Tiến để lên vành đai 3 trên cao, xe container bốc cháy ngùn ngụt kèm nhiều tiếng nổ, tối 20/4.\r\n\r\nKhoảng 21h10, sau một vài tiếng nổ, lửa bắt đầu bốc lên từ khu vực đầu kéo của xe container, sau đó nhanh chóng lan lên cabin. Tài xế thoát ra ngoài kịp thời.\r\n\r\nThời điểm cháy, đường đông đúc, một số dừng lại chụp ảnh gây ùn tắc.\r\n\r\n10 phút sau khi lửa bùng lên, lực lượng cứu hóa đã tới dập tắt đám cháy, ngăn cháy lan sang phần container. Riêng đầu kéo đã bị thiêu rụi.\r\n\r\nTới 22h30, xe container bị cháy vẫn chưa được di chuyển, cảnh sát giao thông phải phân luồng để tránh ùn tắc. Nguyên nhân cháy đang được điều tra.\r\n\r\nKhoảng 10h20 cùng ngày, một vụ cháy ôtô khác xảy ra trước cửa nhà trong ngõ 42 Vũ Ngọc Phan, phường Láng Hạ, quận Đống Đa. Xe 4 chỗ tự bốc cháy khi đang dừng đỗ, một chiếc khác đỗ bên cạnh bị cháy xém phần đầu.', 0, 1, '2025-04-14 23:06:51'),
(3, 'Lửa bao trùm cửa hàng nội thất', 2, 'Lê Đình Thái', '/images/p3.png', 'Cần Thơ - Cửa hàng kinh doanh vật liệu nội thất rộng hơn 600 m2 ở quận Ninh Kiều cháy ngùn ngụt, khói lửa bao trùm, thiêu rụi nhiều tài sản, ngày 20/4.\n\nKhoảng 1h, cửa hàng kinh doanh vật liệu xây dựng, nội thất mặt tiền đường 3 tháng 2, phường Hưng Lợi, bốc cháy dữ dội. Khói lửa nhanh chóng bốc cao hàng chục mét, bao trùm toàn bộ cửa hàng lan sang các nhà bên cạnh. Nhiều người bên trong tiệm sau khi khống chế lửa bất thành đã nhanh chóng chạy ra ngoài.\n\nLực lượng chữa cháy huy động gần 100 người gồm cảnh sát PCCC Công an TP Cần Thơ, 13 xe chuyên dụng đến hiện trường phối hợp cùng gần 50 công an phường, quân sự khống chế, dập tắt ngọn lửa lúc gần 3h.\n\nVụ cháy không gây thương vong, song thiêu rụi nhiều tài sản trong cửa hàng rộng hàng trăm m2, thiệt hại ước tính khoảng hai tỷ đồng. Khung sắt, biển báo và trần cửa hàng đổ sập. Hai căn nhà liền kế bị cháy xém.\n\nLực lượng chức năng đang khám nghiệm hiện trường, điều tra nguyên nhân.', 0, 1, '2025-04-14 23:08:20'),
(4, 'Làn sóng sa thải tiếp tục càn quét ngành công nghệ, hơn 22.000 nhân sự mất việc chỉ trong quý 1/2025', 1, 'Phạm Khắc Tuyên', '/images/p4.png', 'Theo TechCrunch đưa tin ngày 18/4 (giờ địa phương), làn sóng tái cấu trúc trong ngành công nghệ tại Mỹ vẫn tiếp diễn sang năm 2025. [...]', 0, 1, '2025-04-14 23:11:59'),
(5, 'Startup AI đang thách thức những gã khổng lồ công nghệ', 1, 'Nguyễn Thời Bình', '/images/p5.png', 'Tháng 1/2025, thế giới công nghệ chứng kiến một cú sốc lớn khi một mô hình AI mới, với hiệu suất ngang ngửa mô hình o1 của OpenAI nhưng chi phí thấp hơn đáng kể, thu hút sự chú ý toàn cầu. [...]', 0, 1, '2025-04-14 23:11:59'),
(6, 'Cuộc đua nhân lực AI toàn cầu: 10 quốc gia có mật độ nhân sự AI cao nhất', 1, 'Phạm Phú Hoàng Sơn', '/images/p6.png', 'Các phân tích từ khảo sát của McKinsey cho thấy việc Tổng Giám đốc điều hành (CEO) trực tiếp giám sát quản trị AI — tức là các chính sách, quy trình và công nghệ cần thiết để phát triển và triển khai hệ thống AI một cách có trách nhiệm — là yếu tố có mối tương quan cao nhất với việc gia tăng tác động tài chính từ việc sử dụng AI tạo sinh trong doanh nghiệp. [...]', 0, 1, '2025-04-14 23:11:59'),
(8, 'Chúc Mừng Sinh Nhật Lần Thứ 14 Của Câu lạc bộ Tin học Cao Thắng', 5, 'HarryKhang', '/images/1746687785742-438373365.jpg', '🎉🎂Chúc mừng sinh nhật lần thứ 14 cho Câu lạc bộ Tin học Cao Thắng! 🎂🎉\r\nHôm nay là một ngày đặc biệt không chỉ là kỉ niệm thành lập CLB mà còn là sự trở lại mạnh mẽ sau 1 thời gian vắng lặng. \r\n🙆 CLB đang có mục tiêu phát triển CLB mạnh hơn nữa, mở đầu cho việc đó là Khoá học Unity 2D. Đánh dấu bước ngoặc mới cho CLB phát triển và mở rộng chuyên môn trong các lĩnh vực mới.\r\n\r\n🎯Bên cạnh đó CLB định hướng xây dựng và tạo ra một môi trường chủ động và tích cực, khuyến khích chia sẻ kiến thức để cùng nhau và phát triển. Qua đó có thể phát triển kỹ năng cá nhân của mỗi thành viên và mở rộng mối quan hệ trong và ngoài CLB.\r\nNhân dịp, sinh nhật lần thứ 14 của CLB Tin Học Ban chủ nhiệm xin gửi lời cảm ơn chân thành nhất tới Quý thầy/cô giáo Khoa Công nghệ Thông tin, Đoàn - Hội Sinh viên trường, các CLB - đội - nhóm trong - ngoài trường đã luôn tạo điều kiện, giúp đỡ cho phía CLB và đặc biệt cảm ơn các bạn thành viên CLB Tin học qua các khóa đã luôn hỗ trợ, góp sức xây dựng, duy trì CLB ngày càng phát triển lớn mạnh hơn.\r\n🎊 Hy vọng rằng, trong chặng đường tiếp theo, CLB sẽ tiếp tục phát triển mạnh mẽ, lan tỏa giá trị tích cực, trở thành nơi đồng hành vững chắc cho những thế hệ sinh viên Cao Thắng năng động, sáng tạo và yêu thích Tin học.\r\n#KhoaCNTT #CaoThắng #ITClubCT \r\n---------------------------------------------------------------—\r\nWebsite Khoa CNTT: http://cntt.caothang.edu.vn \r\nFanpage Khoa CNTT: fb.com/cntt.caothang.edu.vn \r\nCộng đồng sinh viên: fb.com/groups/fit.caothang \r\nCLB Tin học: fb.com/itclub.caothang', 9, 1, '2025-05-08 07:03:05');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscribers`
--

INSERT INTO `subscribers` (`id`, `email`, `created_at`) VALUES
(1, 'phamtuyen27042005@gmail.com', '2025-05-05 08:51:00'),
(2, '0306231436@caothang.edu.vn', '2025-05-05 08:52:14'),
(3, 'admin@gmail.com', '2025-05-05 08:54:38'),
(4, 'leidnhthai22@gmail.com', '2025-05-05 08:56:41'),
(5, 'adad@gmail.com', '2025-05-08 04:37:05'),
(6, 'lucaotien@caothang.edu.vn', '2025-05-08 05:40:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `created_at`) VALUES
(1, 'admin', '123', 'admin@gmail.com', '2025-05-08 04:32:32');

-- --------------------------------------------------------

--
-- Table structure for table `website_info`
--

CREATE TABLE `website_info` (
  `id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `copyright` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_info`
--

INSERT INTO `website_info` (`id`, `address`, `email`, `facebook`, `youtube`, `copyright`) VALUES
(1, '65 Đ. Huỳnh Thúc Kháng, Bến Nghé, Quận 1, Hồ Chí Minh', 'lucaotien@caothang.edu.vn', 'https://www.facebook.com/lucaotien?locale=vi_VN', 'https://www.youtube.com/@lctgroup1108', '© Bản quyền thuộc về newsfeed.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_category_name` (`name`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `website_info`
--
ALTER TABLE `website_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `website_info`
--
ALTER TABLE `website_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
