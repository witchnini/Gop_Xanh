# Kết quả kiểm tra chuyển cấu trúc - 24/09/2026

Phạm vi: di chuyển source, cập nhật alias/cấu hình và bổ sung tài liệu. Không chạy migration hoặc kiểm thử ghi vào DB thật.

| Kiểm tra                           | Kết quả     | Bằng chứng / giới hạn                                                                           |
| ---------------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| REG-01 Build                       | PASS        | `npm run build` exit 0; vẫn có cảnh báo API deprecated và bundle lớn                            |
| REG-02 TypeScript                  | PASS        | `npx tsc --noEmit` exit 0                                                                       |
| REG-03 ESLint                      | FAIL có sẵn | Chạy trực tiếp ESLint: 421 errors, 7 warnings; bằng số lượng trước di chuyển, chủ yếu định dạng |
| REG-04 HTTP smoke                  | PASS        | `/`, `/chien-dich`, `/auth`, `/robots.txt` trả 200 tại localhost:8081                           |
| REG-05 đến REG-07                  | NOT RUN     | Chưa kiểm tra tương tác, mobile hoặc auth trong trình duyệt                                     |
| TC-01 đến TC-09, SEC-01 đến SEC-07 | NOT RUN     | Cần môi trường/tài khoản thử nghiệm và xác minh DB                                              |

HTTP smoke chỉ xác nhận phản hồi các đường dẫn, không xác nhận nghiệp vụ lưu dữ liệu hoặc quyền truy cập.
