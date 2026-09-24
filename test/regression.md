# Hồi quy sau tổ chức source

| ID     | Kiểm tra                                                     | Kết quả mong đợi                                                  |
| ------ | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| REG-01 | `npm run build` tại gốc                                      | Build được frontend, server functions và tài nguyên tĩnh          |
| REG-02 | `npx tsc --noEmit`                                           | Không lỗi kiểu hoặc import                                        |
| REG-03 | `npm run lint`                                               | Ghi nhận lỗi/warning; không bỏ qua lỗi bằng cách vô hiệu hóa rule |
| REG-04 | Khởi động dev, mở `/`, `/chien-dich`, `/auth`, `/robots.txt` | HTTP thành công, tài nguyên đúng nội dung                         |
| REG-05 | Mở form liên hệ, góp demo và đăng ký chuyên môn              | Module backend resolve; không lỗi import khi điều hướng           |
| REG-06 | Xem desktop 1440px/mobile 375px                              | CSS, ảnh, font hiển thị; không chồng chữ/tràn ngang               |
| REG-07 | Khách mở `/ho-so-cua-toi` trong trình duyệt                  | Sau hydration chuyển đến đăng nhập; không lộ dữ liệu riêng        |

REG-05 đến REG-07 cần kiểm tra trình duyệt và/hoặc tài khoản thử nghiệm; không suy ra pass từ HTTP 200. Kết quả đợt chuyển cấu trúc được ghi trong báo cáo thực thi riêng.
