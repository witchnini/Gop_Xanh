# Sprint 2 - Đóng góp và kết quả

Kế hoạch đề xuất, phụ thuộc luồng chiến dịch/quyền sprint 1. Chưa phân công hoặc xác nhận hoàn thành.

| Story         | User story                                               | Tiêu chí chấp nhận                                        | Task                                                                                |
| ------------- | -------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| US-05 / FR-05 | Là người góp tiền, tôi muốn thử đóng góp                 | Ghi rõ demo; số tiền hợp lệ; lỗi DB không báo thành công  | T5.1 xử lý lỗi insert; T5.2 kiểm tra chiến dịch; T5.3 chạy TC-05, TC-06             |
| US-06 / FR-06 | Là cộng tác viên, tôi muốn đăng ký kỹ năng               | Lưu đủ dữ liệu hợp lệ; phản ánh lỗi lưu                   | T6.1 rà form/server; T6.2 chốt tiếp nhận; T6.3 chạy TC-07                           |
| US-07 / FR-07 | Là chủ chiến dịch, tôi muốn đăng tiến độ                 | Đúng quyền; cập nhật xuất hiện trên chiến dịch công khai  | T7.1 kiểm tra quyền; T7.2 kiểm tra hiển thị; T7.3 chạy TC-08, SEC-04                |
| US-08 / FR-08 | Là người góp, tôi muốn so sánh tác động thực tế/mục tiêu | Có đơn vị, minh chứng; phân biệt demo và số liệu xác minh | T8.1 thiết kế chỉ số; T8.2 migration; T8.3 UI; T8.4 bổ sung test khi chốt nghiệp vụ |
| US-09 / FR-09 | Là đối tác, tôi muốn gửi yêu cầu hợp tác                 | Có nơi tiếp nhận/lưu; thông báo đúng kết quả              | T9.1 chốt kênh nhận; T9.2 thay cơ chế log; T9.3 chạy TC-09                          |

## Sau MVP và nghiệm thu

FR-10: chốt chia sẻ rủi ro. Thanh toán thật, phần thưởng, hoàn tiền/giải ngân, dashboard CSR/ESG và xác minh độc lập cần đặc tả riêng.

Test chức năng, phân quyền và hồi quy phải có kết quả trên môi trường thử nghiệm. Không coi đóng góp mô phỏng là giao dịch thanh toán.
