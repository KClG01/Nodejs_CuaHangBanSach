-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 23, 2025 at 11:35 AM
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
-- Database: `nodejs_newfeeds`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES
(1, 'Công nghệ', '2025-04-20 06:24:16'),
(2, 'Thời sự', '2025-04-20 06:24:56'),
(3, 'Thể thao', '2025-04-20 06:24:16');

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `message`, `created_at`) VALUES
(1, '1', '2@gmail.com', 'very hard work. respected u', '2025-04-23 07:21:53'),
(2, '1', '2@gmail.com', '1231312', '2025-04-23 07:26:06');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `tacgia` text NOT NULL,
  `views` int(255) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `category_id`, `created_at`, `image_url`) VALUES
(1, 'Phương án sắp xếp chi tiết 30 quận, huyện, thị xã của Hà Nội', 'Hà Nội với tổng diện tích gần 3.360 km2, 30 đơn vị hành chính cấp huyện và dân số khoảng hơn 8,5 triệu người, dự kiến giảm từ 526 phường xã xuống còn 126.\r\n\r\n12 quận trung tâm của thành phố Hà Nội có 153 phường, diện tích chiếm hơn 9% toàn thành phố, dân số chiếm 42%. Trong đó, Quận Long Biên có diện tích lớn nhất là 56 km2, quận Hoàn Kiếm có diện tích nhỏ nhất là 5,17 km2. Hoàng Mai có dân số lớn nhất là hơn 430.000 người, Tây Hồ có dân số ít nhất 167.000 người.', 2, '2025-04-15 06:13:52', '/images/p1.png'),
(2, 'Xe container bốc cháy ngùn ngụt trên đường ở Hà Nội', 'Đang chạy trên đường Khuất Duy Tiến để lên vành đai 3 trên cao, xe container bốc cháy ngùn ngụt kèm nhiều tiếng nổ, tối 20/4.\r\n\r\nKhoảng 21h10, sau một vài tiếng nổ, lửa bắt đầu bốc lên từ khu vực đầu kéo của xe container, sau đó nhanh chóng lan lên cabin. Tài xế thoát ra ngoài kịp thời.\r\n\r\nThời điểm cháy, đường đông đúc, một số dừng lại chụp ảnh gây ùn tắc.\r\n\r\n10 phút sau khi lửa bùng lên, lực lượng cứu hóa đã tới dập tắt đám cháy, ngăn cháy lan sang phần container. Riêng đầu kéo đã bị thiêu rụi.\r\n\r\nTới 22h30, xe container bị cháy vẫn chưa được di chuyển, cảnh sát giao thông phải phân luồng để tránh ùn tắc. Nguyên nhân cháy đang được điều tra.\r\n\r\nKhoảng 10h20 cùng ngày, một vụ cháy ôtô khác xảy ra trước cửa nhà trong ngõ 42 Vũ Ngọc Phan, phường Láng Hạ, quận Đống Đa. Xe 4 chỗ tự bốc cháy khi đang dừng đỗ, một chiếc khác đỗ bên cạnh bị cháy xém phần đầu.', 2, '2025-04-15 13:06:51', '/images/p2.png'),
(3, 'Lửa bao trùm cửa hàng nội thất', 'Cần Thơ - Cửa hàng kinh doanh vật liệu nội thất rộng hơn 600 m2 ở quận Ninh Kiều cháy ngùn ngụt, khói lửa bao trùm, thiêu rụi nhiều tài sản, ngày 20/4.\r\n\r\nKhoảng 1h, cửa hàng kinh doanh vật liệu xây dựng, nội thất mặt tiền đường 3 tháng 2, phường Hưng Lợi, bốc cháy dữ dội. Khói lửa nhanh chóng bốc cao hàng chục mét, bao trùm toàn bộ cửa hàng lan sang các nhà bên cạnh. Nhiều người bên trong tiệm sau khi khống chế lửa bất thành đã nhanh chóng chạy ra ngoài.\r\n\r\nLực lượng chữa cháy huy động gần 100 người gồm cảnh sát PCCC Công an TP Cần Thơ, 13 xe chuyên dụng đến hiện trường phối hợp cùng gần 50 công an phường, quân sự khống chế, dập tắt ngọn lửa lúc gần 3h.\r\n\r\nVụ cháy không gây thương vong, song thiêu rụi nhiều tài sản trong cửa hàng rộng hàng trăm m2, thiệt hại ước tính khoảng hai tỷ đồng. Khung sắt, biển báo và trần cửa hàng đổ sập. Hai căn nhà liền kế bị cháy xém.\r\n\r\nLực lượng chức năng đang khám nghiệm hiện trường, điều tra nguyên nhân.', 2, '2025-04-15 13:08:20', '/images/p3.png'),
(4, 'Làn sóng sa thải tiếp tục càn quét ngành công nghệ, hơn 22.000 nhân sự mất việc chỉ trong quý 1/2025', 'Theo TechCrunch đưa tin ngày 18/4 (giờ địa phương), làn sóng tái cấu trúc trong ngành công nghệ tại Mỹ vẫn tiếp diễn sang năm 2025. Nền tảng theo dõi sa thải độc lập Layoffs.fyi cho biết hơn 150.000 người đã mất việc làm tại 549 công ty trong năm ngoái. Tính đến thời điểm hiện tại của năm nay, hơn 22.000 nhân viên công nghệ đã bị sa thải, đặc biệt là con số gây sốc 16.084 người trong tháng 2.\r\n\r\nLàn sóng tái cấu trúc ngành công nghệ năm 2025 diễn biến khác nhau qua từng tháng. Tháng 1 ghi nhận 2.403 người bị sa thải, tháng 2 là 16.234 người và tháng 3 con số này lên đến hơn 88.000 người. Sang tháng 4, nhiều công ty vẫn tiếp tục tái cơ cấu.\r\n\r\nTheo số liệu TechCrunch theo dõi về tình hình sa thải trong ngành công nghệ năm 2025, việc các doanh nghiệp tích cực áp dụng AI và tự động hóa đang khiến tình trạng cắt giảm nhân sự trở nên trầm trọng hơn. Đây cũng là một chỉ báo cho thấy ảnh hưởng của nỗ lực đổi mới đối với nguồn nhân lực.\r\n\r\nGupShup, một công ty về AI đàm thoại, đã sa thải khoảng 200 nhân viên để cải thiện hiệu quả và lợi nhuận. Đây là lần tái cơ cấu thứ hai của công ty này trong vòng 5 tháng. Trước đó, GupShup từng được định giá 1,4 tỷ USD vào năm 2021.\r\n\r\nTheo The Information, Google đã sa thải hàng trăm nhân viên thuộc bộ phận nền tảng và thiết bị, bao gồm cả những người phụ trách Android, Pixel phone và trình duyệt Chrome.\r\n\r\nBusiness Insider dẫn nguồn tin giấu tên cho biết Microsoft đang cân nhắc sa thải thêm nhân viên cho đến tháng 5. Công ty này đang thảo luận về việc giảm số lượng quản lý cấp trung và nhân viên không phải lập trình viên để tăng tỷ lệ lập trình viên so với quản lý sản phẩm.\r\n\r\nCanva, nền tảng thiết kế, đã sa thải từ 10 đến 12 người viết nội dung kỹ thuật khoảng 9 tháng sau khi khuyến khích nhân viên sử dụng các công cụ AI tạo sinh. Công ty này từng có khoảng 5.500 nhân viên vào năm 2024 và được định giá 26 tỷ USD sau đợt bán cổ phiếu thứ hai trong cùng năm.\r\n\r\nViệc các doanh nghiệp tích cực áp dụng AI và tự động hóa được dự báo sẽ tiếp tục khiến số lượng việc làm trong ngành công nghệ giảm sút. Đặc biệt, việc các ông lớn công nghệ như Microsoft và Google đang hướng tới giảm số lượng quản lý cấp trung và nhân viên không phải là nhà phát triển là một điểm đáng chú ý.\r\n\r\nGiống như trường hợp của Canva, việc cắt giảm đội ngũ viết nội dung kỹ thuật sau khi áp dụng công cụ AI tạo sinh là một ví dụ điển hình cho thấy tác động của AI đối với một số công việc nhất định. Tuy nhiên, như CEO của Block, Jack Dorsey đã chỉ ra, không phải tất cả các vụ sa thải đều nhằm mục đích thay thế bằng AI, mà lý do tái cơ cấu còn tùy thuộc vào tình hình và chiến lược của từng doanh nghiệp.\r\n\r\nXu hướng việc làm trong ngành công nghệ trong tương lai sẽ tiếp tục thay đổi tùy thuộc vào sự đổi mới công nghệ, tình hình kinh tế và chiến lược kinh doanh của từng công ty. Làn sóng tái cấu trúc trong ngành công nghệ không chỉ đơn thuần là cắt giảm chi phí mà còn có thể được coi là quá trình tái cấu trúc nhân lực để phù hợp với kỷ nguyên AI.', 1, '2025-04-15 13:11:59', '/images/p4.png'),
(5, 'Startup AI đang thách thức những gã khổng lồ công nghệ', 'Tháng 1/2025, thế giới công nghệ chứng kiến một cú sốc lớn khi một mô hình AI mới, với hiệu suất ngang ngửa mô hình o1 của OpenAI nhưng chi phí thấp hơn đáng kể, thu hút sự chú ý toàn cầu. Công ty khởi nghiệp DeepSeek đã làm rung chuyển ngành công nghệ không chỉ nhờ mô hình R1 có khả năng suy luận, học hỏi từ các mô hình khác và \"tư duy\", mà còn bởi nó chứng minh tiềm năng của các công ty AI đổi mới, bên cạnh những gã khổng lồ như Microsoft, Google hay OpenAI, trong việc định hình tương lai công nghệ.\r\n\r\nSự xuất hiện của DeepSeek đã khiến nhiều người đặt câu hỏi: Làm thế nào một công ty khởi nghiệp AI, thay vì một gã khổng lồ công nghệ, có thể đạt được thành tựu đột phá như vậy? Câu trả lời nằm ở hệ sinh thái AI rộng lớn, nơi các công ty ngoài những tên tuổi lớn như OpenAI, Google hay Meta đang dẫn đầu trong việc mang lại giá trị kinh tế từ AI cho doanh nghiệp và người tiêu dùng.\r\n\r\nTrong khi các cuộc thảo luận về AI, đặc biệt là AI tạo sinh (gen AI) và AI chủ động (agentic AI), thường tập trung vào các mô hình nền tảng nổi tiếng như ChatGPT hay Gemini, hệ sinh thái AI còn bao gồm các nền tảng đám mây AI, nhà cung cấp phần mềm độc lập, công nghệ tích hợp và các nhà tích hợp hệ thống.\r\n\r\nTheo khảo sát mới đây của Prosper Insights & Analytics, 29,3% người trưởng thành ở Mỹ đã nghe nói về gen AI như ChatGPT và sử dụng nó. Tuy nhiên, chính các công ty tích hợp hệ thống như Tredence đang đóng vai trò quan trọng trong việc triển khai các giải pháp AI và kỹ thuật dữ liệu cho các doanh nghiệp lớn, đảm bảo các ứng dụng AI hoạt động hiệu quả trong môi trường doanh nghiệp.\r\n\r\nTredence, một nhà cung cấp dịch vụ tích hợp hệ thống, sử dụng các mô hình nền tảng để xây dựng ứng dụng, nâng cao hiệu suất trong các lĩnh vực chuyên biệt như quản lý chuỗi cung ứng hoặc phân tích khách hàng. Ông Unmesh Kulkarni, Phó Chủ tịch cấp cao về Gen AI tại Tredence, nhận định: “Những công ty ngoài các gã khổng lồ như Microsoft hay Google đang dẫn đầu làn sóng đổi mới AI tiếp theo, bằng cách nhận diện những khoảng trống mà các doanh nghiệp gặp phải khi áp dụng AI. Điều này giúp các công ty đổi mới tìm được chỗ đứng riêng và cạnh tranh với những tên tuổi lớn”.\r\n\r\nMột trong những cách các công ty AI đổi mới tạo sự khác biệt là thông qua tốc độ và sự linh hoạt. Trong bối cảnh gen AI không ngừng phát triển, tốc độ triển khai các giải pháp AI đóng vai trò then chốt để mang lại giá trị kinh doanh. Các công ty AI linh hoạt có thể nhanh chóng tiếp nhận và áp dụng các công nghệ mới, từ đó tạo ra giá trị thực tiễn.\r\n\r\nVí dụ, Tredence đã đầu tư 10-15% nguồn lực vào việc nâng cao kỹ năng AI và gen AI cho đội ngũ, một yếu tố quan trọng khi 71% tổ chức sử dụng gen AI trong ít nhất một chức năng kinh doanh, theo nghiên cứu của McKinsey (tăng từ 65% vào đầu năm 2024).\r\n\r\nNhờ đó, Tredence đã thành lập một Trung tâm Xuất sắc AI, tập trung vào việc nắm bắt xu hướng công nghệ AI nhanh hơn và chuyển đổi chúng thành giá trị thực tế. Trung tâm này giúp đội ngũ của Tredence thực hiện nghiên cứu ứng dụng và phát triển các công cụ hỗ trợ, cho phép khách hàng triển khai AI chỉ trong một nửa thời gian thông thường. So với các gã khổng lồ công nghệ, Tredence có thể hành động nhanh hơn, triển khai giải pháp AI hiệu quả hơn và tập trung vào việc mang lại kết quả tối ưu.\r\n\r\nÔng Kulkarni nhấn mạnh: “Tốc độ và sự linh hoạt là cơ hội lớn mà các công ty AI phải tận dụng. Quy mô của chúng tôi cho phép dành một phần nguồn lực tập trung hoàn toàn vào gen AI, giúp triển khai các giải pháp và sáng kiến AI quy mô lớn một cách nhanh chóng”.\r\n\r\nMột lĩnh vực khác mà các công ty đổi mới đang dẫn đầu là AI chủ động (agentic AI) – thế hệ hệ thống thông minh tiếp theo có khả năng suy luận, ưu tiên và hành động tự động trong các quy trình làm việc của doanh nghiệp. Theo Deloitte, 25% công ty sử dụng gen AI sẽ triển khai các dự án thí điểm hoặc thử nghiệm AI chủ động vào năm 2025, và con số này dự kiến tăng lên 50% vào năm 2027.\r\n\r\nManus AI, một công ty khởi nghiệp, đang tạo sóng gió trong ngành công nghệ bằng cách đầu tư mạnh vào AI chủ động. Bằng cách xây dựng các tác nhân AI có khả năng suy luận, ưu tiên và ra quyết định trong toàn bộ quy trình kinh doanh, Manus AI tập trung giải quyết các vấn đề thực tiễn, đáp ứng nhu cầu của 24% người dùng gen AI sử dụng chúng như trợ lý cá nhân, theo khảo sát của Prosper Insights & Analytics. Không giống các mô hình AI từ các gã khổng lồ như ChatGPT hay Claude, các tác nhân của Manus AI cho phép tự động hóa công việc mà không cần người dùng giám sát liên tục.\r\n\r\nTương tự, Tredence nhận thấy AI chủ động là biên giới tiếp theo của gen AI, đặc biệt đối với doanh nghiệp. Công ty đang đầu tư nguồn lực để hiểu cách các công nghệ này phát triển và chuyển đổi kiến thức đó thành giá trị thực tiễn, giúp doanh nghiệp chuyển từ tự động hóa đơn giản sang các quy trình tự trị thông minh.\r\n\r\nGiải quyết các thách thức AI phức tạp cho doanh nghiệp là một cách khác để các công ty đổi mới khẳng định vị thế. Ví dụ, một công ty thực phẩm lớn với doanh thu hơn 50 tỷ USD muốn tối ưu hóa ngân sách tiếp thị cho một chiến dịch trên các kênh xã hội, kỹ thuật số và cửa hàng.\r\n\r\nTredence đã triển khai nhiều tác nhân AI để tự động phân tích dữ liệu thị trường, phân bổ ngân sách, đánh giá hiệu suất kênh và đề xuất nội dung sáng tạo. Nhờ đó, công ty thực phẩm này đã chuyển đổi các quyết định tiếp thị phức tạp thành các chiến lược dựa trên dữ liệu, mang lại hiệu quả vượt trội.\r\n\r\nÔng Kulkarni khẳng định: “Khi doanh nghiệp tiến tới tự trị nhờ AI, họ cần không chỉ là các kỹ thuật gợi ý – mà họ cần các tác nhân thông minh có thể suy luận, hành động và thích nghi ở quy mô lớn. Đây là nơi các công ty AI đổi mới như Tredence cần bước lên và tạo sự khác biệt so với các gã khổng lồ công nghệ”.', 1, '2025-04-15 13:11:59', '/images/p5.png'),
(6, 'Cuộc đua nhân lực AI toàn cầu: 10 quốc gia có mật độ nhân sự AI cao nhất', 'Các phân tích từ khảo sát của McKinsey cho thấy việc Tổng Giám đốc điều hành (CEO) trực tiếp giám sát quản trị AI — tức là các chính sách, quy trình và công nghệ cần thiết để phát triển và triển khai hệ thống AI một cách có trách nhiệm — là yếu tố có mối tương quan cao nhất với việc gia tăng tác động tài chính từ việc sử dụng AI tạo sinh trong doanh nghiệp. Điều này đặc biệt đúng với các công ty quy mô lớn, nơi mà sự tham gia của CEO vào quản trị AI có ảnh hưởng lớn nhất đến lợi nhuận từ AI tạo sinh.\r\n\r\n28% người tham gia khảo sát từ các tổ chức sử dụng AI cho biết CEO của họ chịu trách nhiệm giám sát quản trị AI. Tuy nhiên, con số này thấp hơn ở các tổ chức lớn có doanh thu hàng năm từ 500 triệu USD trở lên. Ngoài ra, 17% cho biết việc giám sát quản trị AI do hội đồng quản trị đảm nhiệm. Trong nhiều trường hợp, trách nhiệm này được chia sẻ — trung bình có hai lãnh đạo cùng chịu trách nhiệm về quản trị AI trong một tổ chức.\r\n\r\nCác tổ chức đang bắt đầu thay đổi căn bản cách thức làm việc khi triển khai AI. Cụ thể, 21% người được khảo sát cho biết tổ chức của họ đã tái thiết kế một cách căn bản ít nhất một phần quy trình làm việc khi áp dụng AI tạo sinh.\r\n\r\nĐặc biệt, theo báo cáo năm 2024 của Microsoft và LinkedIn, khảo sát trên 31.000 người tại 31 quốc gia, 66% lãnh đạo doanh nghiệp cho biết họ sẽ không tuyển dụng ai nếu người đó không có kỹ năng AI, trong khi 71% sẵn sàng chọn ứng viên ít kinh nghiệm nhưng biết AI, hơn là người nhiều kinh nghiệm mà không có năng lực công nghệ này.\r\n\r\nTrong bối cảnh đó, việc phát triển năng lực AI không còn là một lợi thế cạnh tranh – mà là điều kiện bắt buộc để tồn tại và phát triển trong thị trường lao động toàn cầu đang thay đổi chóng mặt.\r\n\r\n\"Mật độ tài năng AI\" là một chỉ số đo lường tỷ lệ người lao động có kỹ năng liên quan đến trí tuệ nhân tạo (AI) trong lực lượng lao động của một quốc gia, so với mức trung bình toàn cầu. Nói cách khác, nó thể hiện mức độ phổ biến của kỹ năng AI trong dân số lao động của một quốc gia. Để giúp theo dõi nguồn cung lao động AI toàn cầu, LinkedIn đã công bố chỉ số “mật độ tài năng AI”, dựa trên hồ sơ người dùng có kỹ năng AI (bao gồm cả kỹ thuật như học máy, xử lý ngôn ngữ tự nhiên và kiến thức ứng dụng như ChatGPT, GitHub Copilot).\r\n\r\nDanh sách 10 quốc gia có tỷ lệ nhân lực AI cao nhất so với trung bình toàn cầu năm 2024 bao gồm Israel dẫn đầu với tỷ lệ 1,98%; Singapore (1,64%); Luxembourg (1,44%); Estonia (1,17%); Thụy Sĩ (1,16%); Phần Lan (1,13%); Ireland (1,11%); Đức (1,09%); Hà Lan (1,07%); Hàn Quốc (1,06%).\r\n\r\nĐáng chú ý, 6 quốc gia dẫn đầu vẫn giữ nguyên vị trí so với năm 2023. Trong khi đó, Ireland đã tăng 4 bậc, lên vị trí thứ 7, còn Hàn Quốc tụt 3 bậc, xuống hạng 10 trong năm 2024.\r\n\r\nMặc dù hầu hết các quốc gia dẫn đầu như Israel, Singapore, Luxembourg hay Estonia đều có quy mô dân số và diện tích nhỏ, họ lại “vượt hạng” khi nói đến năng lực AI. Theo bà Chua Pei Ying, chuyên gia kinh tế trưởng khu vực Châu Á - Thái Bình Dương của LinkedIn, những nước này đã xây dựng hệ sinh thái phát triển tài năng hiệu quả, khi doanh nghiệp chú trọng đào tạo và chính phủ hỗ trợ chính sách học tập liên tục.\r\n\r\nSingapore là một ví dụ điển hình – nơi văn hóa học tập suốt đời đã trở thành lợi thế cạnh tranh. Người lao động Singapore dành nhiều hơn 40% thời gian học AI so với mặt bằng chung tại khu vực APAC.\r\n\r\nẤn Độ cũng là một trường hợp đáng chú ý khi dù không nằm trong top 10 về mật độ nhân lực AI, nhưng Ấn Độ lại là quốc gia có tốc độ tăng trưởng nhanh nhất. Chỉ số AI của nước này tăng 252% trong giai đoạn 2016 – 2024, cho thấy nhu cầu học tập và nâng cấp kỹ năng đang tăng mạnh. Năm 2024, tỷ lệ tuyển dụng nhân lực AI ở Ấn Độ tăng 33,4% so với toàn bộ thị trường lao động, vượt xa Singapore (25%) và Mỹ (24,7%). Điều này phản ánh rõ sự dịch chuyển mạnh mẽ của các tập đoàn toàn cầu và thị trường nội địa về phía công nghệ AI.', 1, '2025-04-15 13:13:34', '/images/p6.png'),
(7, 'Chung kết Vietnam Game Awards thu hút 50.000 bình chọn sau ba ngày', 'Sau ba ngày mở cổng, vòng Chung kết Vietnam Game Awards 2025 cán mốc 50.000 lượt bình chọn, trong đó hạng mục Nhà phát hành game xuất sắc chiếm 20%.\r\n\r\nGiải thưởng Game Việt Nam - Vietnam Game Awards 2025 ghi nhận số lượt bình chọn kỷ lục trong ba năm tổ chức, thể hiện mức độ quan tâm, yêu thích của công chúng với lĩnh vực trò chơi điện tử.\r\n\r\nMở cổng từ ngày 18/4, hiện vòng Chung kết thu hút hơn 50.000 lượt vote cho 23 hạng mục. Trong đó, Nhà phát hành game xuất sắc sôi động với 10.000 lượt, chiếm 25% tổng số. Tương tự vòng Sơ loại, vòng Chung kết vẫn là màn đối đầu kịch tính giữa hai \"ông lớn\" VTC và Gamota với số vote hơn 3.000 mỗi bên.\r\n\r\nHạng mục Vận động viên thể thao điện tử xuất sắc cũng được cộng đồng game thủ quan tâm. Tuyển thủ PUBG Lã Phương Tiến Đạt (Himass) của đội Cerberus Esports vẫn giữ vững phong độ, dẫn đầu với 2.500 bình chọn.\r\n\r\nGiải đấu thể thao điện tử của năm có 6 đề cử vào vòng Chung kết và được dự đoán là hạng mục kịch tính đến phút cuối. Chỉ sau ba ngày, giải đấu quốc tế CFS Summer Championship 2024 đã dẫn đầu với gần 2.500 vote, vượt xa các đối thủ trong danh sách.\r\n\r\nGiải đấu thể thao điện tử của năm và Nhân vật game được yêu thích là hai hạng mục mới của Vietnam Game Awards 2025. Ban tổ chức kỳ vọng các game thủ có thể trực tiếp tham gia quá trình đề cử, bình chọn để tìm ra những nhân vật, giải đấu yêu thích.\r\n\r\nVòng Chung kết sẽ tiếp tục ghi nhận bình chọn đến hết ngày 15/5. Kết quả chung cuộc sẽ dựa trên 30% điểm bình chọn và 70% điểm đánh giá từ hội đồng chuyên môn. Lễ trao giải sẽ diễn ra trong sự kiện Vietnam GameVerse ngày 24-25/5 tại SECC, quận 7, TP HCM.\r\n\r\nVietnam Game Awards là một trong những hoạt động chính của Ngày hội Vietnam Gameverse. Sự kiện còn có nhiều hoạt động thú vị khác như cuộc thi Cosplay Contest đang mở cổng bình chọn đến hết ngày 10/5; chương trình tìm kiếm dự án game tiềm năng GameHub 2025 đang nhận đề cử đến hết ngày 30/4 theo hình thức trực tuyến.\r\n\r\nVietnam GameVerse được tổ chức từ năm 2023, trở thành dấu mốc đáng nhớ khi lần đầu tiên một sự kiện quy mô lớn quy tụ đông đảo nhà phát hành, đơn vị sản xuất, đầu tư và cộng đồng yêu game tại Việt Nam.', 3, '2025-04-15 13:13:34', '/images/p7.png'),
(8, 'Văn Toàn nói thật lòng về trận Nam Định hòa đội cuối bảng', 'Tiền đạo Nguyễn Văn Toàn chia sẻ từ đáy lòng sau trận Nam Định hòa thất vọng đối đang đứng cuối BXH V-League 2024/25, CLB Đà Nẵng.\r\n\r\nTiền đạo Nguyễn Văn Toàn vừa cùng CLB Nam Định hoàn thành vòng 19 V-League 2024/25 với chuyến hành quân đến làm khách của CLB Đà Nẵng.\r\n\r\nĐược đánh giá vượt trội hơn rất nhiều so với đội chủ nhà nhưng Nam Định sau cùng chỉ có thể chấp nhận hòa chung cuộc với kết quả 0-0.\r\n\r\nĐiều này khiến người hâm mộ thành Nam vô cùng thất vọng khi Nam Định với vị thế là đương kim vô địch và cũng đang dẫn đầu BXH mùa này.\r\n\r\nTrong khi đó, Đà Nẵng chỉ vừa quay trở lại đấu trường V-League sau một mùa giải rớt hạng và đang chìm sâu dưới cuối bảng.\r\n\r\nGặp gỡ truyền thông sau trận, tiền đạo Văn Toàn chia sẻ: \"Nam Định phải cạnh tranh chức vô địch nên mỗi trận hòa hiện tại không khác gì thất bại.\r\n\r\nChúng tôi không có thể trạng tốt, nên hiệp 1 có phần thua thiệt về thế trận. Các cầu thủ Đà Nẵng hôm nay thi đấu tốt, xứng đáng có điểm”.\r\n\r\nAnh tiếp tục nói: “Việc bị các đối thủ ở nhóm sau, đặc biệt là Hà Nội FC, bám sát sẽ khiến chúng tôi gặp nhiều khó khăn.\r\n\r\nNhưng Nam Định vẫn có lợi thế 2 điểm, vẫn nắm quyền tự quyết nên đây không phải là vấn đề gì nghiêm trọng\".\r\n\r\n\"Điều quan trọng là chúng tôi cần duy trì tinh thần tích cực để hướng đến trận đấu tới”, Văn Toàn nhấn mạnh.\r\n\r\nCần nói thêm, Văn Toàn mới chỉ trở lại sau quãng thời gian dài vắng mặt để điều trị hồi phục chấn thương gặp phải ở AFF Cup 2024.\r\n\r\nSở dĩ, trên BXH lúc này, CLB Nam Định tạm thời vẫn đứng đầu với 36 điểm sau 19 vòng đấu, nhiều hơn 2 điểm so với đội nhì bảng Hà Nội FC (34 điểm).\r\n\r\nVới việc chỉ còn 7 vòng đấu nữa là mùa giải sẽ hạ màn nên cuộc đua vô địch hay trụ hạng đều đang rất kịch tính.\r\n\r\nTheo lịch thi đấu, ở vòng 20 tới đây, CLB Nam Định sẽ trở về sân nhà tiếp đón Bình Dương (26/4) trong khi Đà Nẵng có cuộc tiếp đón Thanh Hóa (27/4).', 3, '2025-04-15 13:15:39', '/images/p8.png'),
(9, '2 ngôi sao Việt kiều mới toanh sắp lên ĐT Việt Nam?', 'Ở các trận đấu từ tháng 6 tới, HLV Kim Sang Sik có thêm bộ đôi cầu thủ Việt kiều sẵn sàng chinh chiến cùng ĐT Việt Nam.\r\n\r\nSau trận đấu giao hữu giữa \"Những ngôi sao Đông Nam Á\" vs Manchester United vào ngày 28/5, HLV Kim Sang Sik sẽ trở lại đội tuyển Việt Nam để chuẩn bị cho trận đấu gặp ĐT Malaysia vào ngày 10/6 trong khuôn khổ vòng loại 3 Asian Cup 2027.\r\n\r\nỞ trận đấu này, HLV Kim Sang Sik sẽ có thêm 2 sự lựa chọn chất lượng, đó là bộ đôi Việt kiều Cao Pendant Quang Vinh và Viktor Lê. Cả hai đều đã có quốc tịch và sẵn sàng thi đấu.\r\n\r\nNgày 19/3, Jason Quang Vinh chính thức có quốc tịch sau nửa năm thi đấu trong màu áo CLB CAHN. Đẳng cấp của cầu thủ Việt kiều Pháp đã được minh chứng qua các trận đấu cùng với đội bóng ngành công an. Kể từ khi gia nhập, Quang Vinh đã thi đấu 25 trận, có 1 kiến tạo ở tất cả các đấu trường. Sự xuất hiện của Jason Quang Vinh sẽ giúp HLV Kim Sang Sik giải bài toán khó bên cánh trái, vị trí mà ĐT Việt Nam chưa thể tìm được người thay thế ưng ý nhất sau khi Văn Hậu chấn thương.\r\n\r\nMột cầu thủ khác khả năng cũng sẽ được HLV Kim trao cơ hội là Viktor Lê. Tiền vệ Việt kiều Nga sinh năm 2003, có quốc tịch Việt Nam từ đầu năm nay. Gần đây, Viktor Lê được gọi lên đội U22 Việt Nam dự giải giao hữu ở Trung Quốc. Anh ra sân đá chính cả ba trận, chơi ấn tượng, đóng góp công lớn vào cả ba trận hòa của U22 Việt Nam trước các đối thủ mạnh. Tháng 6 tới khi ĐT Việt Nam tập trung chuẩn bị cho VL Asian Cup, Viktor Lê có thể được HLV Kim Sang Sik trao cơ hội ăn tập cùng ĐTQG Việt Nam. \r\n\r\nBên cạnh Viktor Lê, Cao Jason Quang Vinh, thủ thành Filip Nguyễn hay Văn Lâm đã sẵn sàng trở lại. Tháng 3 vừa qua, Filip Nguyễn xin vắng mặt vì vướng việc gia đình. Ngoài ra, HLV Kim Sang Sik cũng đón chào sự trở lại của Văn Toàn, Công Phượng...', 3, '2025-04-15 13:15:39', '/images/p9.png');

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
(1, 'admin', '123', 'admin@gmail.com', '2025-04-21 13:02:50'),
(2, 'Khang', '123', '1386@gmail.com', '2025-04-21 13:02:50'),
(3, 'Khanh', '123', '1394@gmail.com', '2025-04-21 13:03:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
