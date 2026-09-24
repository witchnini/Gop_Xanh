# UI/UX style guideline

## Nguồn thiết kế

Nguồn chính thức do chủ dự án cung cấp: [BrandGuideline.pdf](BrandGuideline.pdf), trang 1. Bộ nhận diện này thay thế phần mô tả theme cũ làm căn cứ thiết kế UI/UX. Các quy tắc áp dụng web bên dưới là quy ước triển khai, không phải nội dung được ghi nguyên văn trong PDF.

## Màu thương hiệu

| Nhóm trong PDF | HEX       | RGB tương ứng HEX | Vai trò web đề xuất                 |
| -------------- | --------- | ----------------- | ----------------------------------- |
| Primary        | `#0D530E` | 13, 83, 14        | Màu thương hiệu, nút chính, tiêu đề |
| Primary        | `#FBF5DD` | 251, 245, 221     | Nền phụ hoặc mảng nhận diện         |
| Secondary      | `#000000` | 0, 0, 0           | Chữ nội dung                        |
| Secondary      | `#306D29` | 48, 109, 41       | Màu xanh hỗ trợ                     |
| Secondary      | `#D89344` | 216, 147, 68      | Điểm nhấn                           |
| Secondary      | `#FFF0D1` | 255, 240, 209     | Nền nhấn nhẹ                        |
| Secondary      | `#FFFFFF` | 255, 255, 255     | Nền trang, form và bảng dữ liệu     |

PDF ghi RGB/CMYK dưới màu `#D89344` trùng với màu xanh `#306D29`; bảng trên tính RGB theo HEX. Ô màu ghi `#000000` nhìn giống xám đậm trong bản PDF. Khi triển khai web, tạm ưu tiên mã HEX được ghi, không lấy mẫu màu từ ảnh hoặc tự coi RGB/CMYK mâu thuẫn là chuẩn.

Dùng nền trắng và màu chữ để cân bằng các mảng xanh/kem; trang nghiệp vụ ưu tiên khả năng đọc. Màu thương hiệu không tự thay thế màu cảnh báo/lỗi. Kiểm tra tương phản trước khi dùng cam hoặc màu nền nhạt cho chữ nhỏ.

## Typography

- **Primary typeface:** Playfair Display, dùng cho tiêu đề thương hiệu và tiêu đề trang.
- **Secondary typefaces:** Gotham và Montserrat. Quy ước web đề xuất dùng Montserrat cho nội dung, form, nút và bảng để thống nhất; Gotham chỉ dùng khi có file webfont và quyền sử dụng phù hợp.
- Fallback: `"Playfair Display", Georgia, serif` và `"Montserrat", Arial, sans-serif`.
- Các asset được cung cấp hiện chưa có file font. Khi tích hợp phải kiểm tra tải font, weight thực tế và dấu tiếng Việt; danh sách kiểu chữ trong PDF không chứng minh mọi weight đều có file webfont.

## Logo và asset gốc

| Asset                             | Nội dung                                      | Cách dùng đề xuất                                |
| --------------------------------- | --------------------------------------------- | ------------------------------------------------ |
| [Logo.png](logo/Logo.png)         | Biểu tượng kèm chữ Góp Xanh, ảnh 1000 x 1000  | Vị trí nhận diện đầy đủ, footer, trang đăng nhập |
| [Onlylogo.png](logo/Onlylogo.png) | Biểu tượng không chữ, ảnh 1000 x 736          | Vị trí gọn hoặc đi kèm tên thương hiệu bằng chữ  |
| [Logo GX.png](logo/Logo%20GX.png) | Logo dạng sticker trong suốt, ảnh 2000 x 2000 | Logo trên nền xanh đậm, hiện dùng tại footer     |

Giữ đúng tỷ lệ, màu và nội dung của file gốc; không vẽ lại logo bằng chữ G hoặc icon chung. Hiển thị bằng `object-fit: contain`; không kéo méo, cắt mất chi tiết, thêm filter đổi màu hoặc tự tái tạo gradient. Chọn kích thước theo phần hình thực tế vì file có khoảng trống xung quanh; không tự cắt asset nguồn. Logo nằm trong link trang chủ cần tên truy cập Góp Xanh.

PDF chưa quy định định lượng khoảng trống an toàn, kích thước tối thiểu hoặc biến thể nền tối. Không tự ghi các thông số này thành quy định chính thức. Khi cần favicon hoặc biến thể khác, giữ bản gốc và kiểm tra khả năng nhận diện ở kích thước nhỏ.

## Trạng thái tích hợp

Đã áp dụng bộ nhận diện vào giao diện ngày 24/09/2026:

- Token màu trong `code/front end/src/styles.css` dùng palette HEX của PDF; các alias kỹ thuật cũ được giữ để tránh phá component.
- Playfair Display dùng cho tiêu đề, Montserrat dùng cho nội dung qua Google Fonts và có fallback hệ thống.
- Giao diện import trực tiếp asset gốc trong thư mục `logo/`: header dùng `Logo.png`, footer dùng `Logo GX.png`. Không dùng bản cắt, bản vẽ lại hoặc asset thay thế.
- Bán kính bề mặt được chuẩn hóa tối đa 8px qua token; nút thao tác dạng pill vẫn dùng `rounded-full`.
- Đã kiểm tra build, TypeScript và ảnh chụp desktop/mobile. Việc tải Google Fonts vẫn phụ thuộc mạng; khi cần chạy hoàn toàn offline phải bổ sung file font có giấy phép phù hợp.

## Thành phần và hành vi

- Dùng token ngữ nghĩa `background`, `foreground`, `primary`, `destructive`; không lặp màu cứng trong từng trang.
- Thẻ chiến dịch có ảnh, tên, địa bàn, mục tiêu/tiến độ và trạng thái; không trình bày số liệu demo như kết quả đã xác minh.
- Form có nhãn, trường bắt buộc, lỗi gần trường, trạng thái đang gửi và kết quả. Ngăn gửi lặp khi đang xử lý.
- Nút hành động ghi rõ nghiệp vụ; nút chỉ có icon cần tên truy cập và tooltip. Trạng thái không phân biệt chỉ bằng màu.
- Trang quản trị ưu tiên dữ liệu dễ quét, bộ lọc và thao tác rõ ràng. Thông tin người góp chỉ hiện cho người có quyền.
- Góp tiền demo phải thể hiện chưa trừ tiền thật. Tiến độ hoạt động khác với tác động đã được xác minh.

## Kiểm tra hiển thị

Kiểm tra điện thoại 375px, tablet 768px và desktop 1440px: không tràn ngang, chữ/nút không chồng nhau, ảnh đúng tỷ lệ, form dùng được bằng bàn phím, focus nhìn thấy. Kiểm tra trạng thái loading, rỗng, lỗi và thành công. Đây là tiêu chí nghiệm thu, chưa phải kết quả đo accessibility hoặc ảnh chụp đã kiểm chứng.
