# Test case panel quản trị

Điều kiện: DB thử nghiệm đã áp dụng migration 0000 đến 0003; có tài khoản admin, partner và contributor; có dữ liệu hồ sơ, đóng góp, cộng tác viên và cập nhật tiến độ.

| ID     | Thao tác                                                 | Kết quả mong đợi                                                         |
| ------ | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| ADM-01 | Khách mở /admin                                          | Chuyển đến /auth, không hiển thị dữ liệu admin                           |
| ADM-02 | Contributor hoặc partner mở /admin                       | Chuyển về website, server function admin từ chối                         |
| ADM-03 | Admin đăng nhập                                          | Mở dashboard với sidebar riêng; không có header/footer website           |
| ADM-04 | Mở dashboard desktop 1440px và mobile 375px              | Không tràn ngang; mobile dùng menu; số liệu tải đúng                     |
| ADM-05 | Mở /admin/ho-so, đánh dấu thiếu tiêu chí                 | Nút duyệt bị khóa; vẫn có thể yêu cầu bổ sung hoặc từ chối               |
| ADM-06 | Đánh dấu đủ ba tiêu chí và duyệt                         | Trạng thái thành dang_gay_quy; hồ sơ rời hàng chờ và xuất hiện công khai |
| ADM-07 | Yêu cầu bổ sung kèm ghi chú                              | Partner đọc được ghi chú và trạng thái can_bo_sung                       |
| ADM-08 | Lọc chiến dịch, đánh dấu chiến dịch đang chạy hoàn thành | Bảng lọc đúng; trạng thái thành hoan_thanh                               |
| ADM-09 | Mở Đóng góp                                              | Chỉ admin xem được thông tin; có cảnh báo dữ liệu mô phỏng               |
| ADM-10 | Mở Cộng tác viên                                         | Hiển thị kỹ năng, chiến dịch và liên kết email/điện thoại đúng           |
| ADM-11 | Mở Tác động & tiến độ                                    | Admin đọc được cập nhật của mọi chiến dịch theo migration 0003           |
| ADM-12 | Mở /quan-tri cũ                                          | Chuyển đến /admin                                                        |
| ADM-13 | Đăng xuất từ panel                                       | Xóa phiên và chuyển đến /auth                                            |

Checklist Green Filter chưa lưu điểm từng tiêu chí; ca ADM-06 chỉ xác nhận trạng thái và ghi chú được lưu. Không coi số tiền trong dashboard là giao dịch thanh toán thật.
