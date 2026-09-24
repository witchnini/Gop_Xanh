# Test case phân quyền

Chưa thực thi. Chạy trên DB thử nghiệm; kiểm tra cả server function và truy cập DB với token người dùng, không chỉ các nút UI.

| ID     | Tiền điều kiện / thao tác                                                                | Kết quả mong đợi                                            |
| ------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| SEC-01 | Khách hoặc token hết hạn gọi nộp hồ sơ/xem hồ sơ cá nhân                                 | Bị từ chối, không đọc/ghi dữ liệu riêng                     |
| SEC-02 | Farmer A gửi owner B hoặc truy cập hồ sơ riêng của B                                     | Không tạo/đọc hồ sơ thay B                                  |
| SEC-03 | Farmer gọi duyệt, thống kê admin; thử cập nhật trực tiếp status/raised/supporters qua DB | Bị chặn; policy owner hiện cần rà soát vì chưa giới hạn cột |
| SEC-04 | A đăng cập nhật cho chiến dịch của B                                                     | Bị từ chối, không tạo bản ghi                               |
| SEC-05 | Khách đọc profiles/donations/volunteer_applications                                      | Không lộ dữ liệu cá nhân                                    |
| SEC-06 | Khách đọc trực tiếp chiến dịch/cập nhật chưa công khai                                   | Không trả dữ liệu chưa duyệt                                |
| SEC-07 | Admin đọc/duyệt hồ sơ thử nghiệm                                                         | Được phép theo đúng quyền, ghi chú/trạng thái lưu đúng      |
