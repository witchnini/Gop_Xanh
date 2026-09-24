# Test case chức năng

Trạng thái tất cả case: chưa thực thi trong đợt tổ chức source. Kết quả mong đợi là tiêu chí nghiệm thu; source hiện có thể chưa đạt.

| ID / yêu cầu  | Tiền điều kiện                        | Thao tác / dữ liệu                                                | Kết quả mong đợi                                                   |
| ------------- | ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| TC-01 / FR-01 | Có chiến dịch chờ và công khai        | Mở danh sách khi chưa đăng nhập                                   | Chỉ dữ liệu công khai; demo được phân biệt                         |
| TC-02 / FR-01 | Có slug hợp lệ                        | Mở chi tiết đúng slug, sau đó slug không tồn tại                  | Đúng chiến dịch; trường hợp không có hiển thị phù hợp              |
| TC-03 / FR-03 | Đăng nhập farmer A                    | Gửi thiếu trường; mục tiêu 9.999.999; rồi hồ sơ hợp lệ >=10 triệu | Chặn dữ liệu sai; hồ sơ đúng lưu owner A, chờ duyệt                |
| TC-04 / FR-04 | Admin, hồ sơ A chờ duyệt              | Yêu cầu bổ sung kèm ghi chú; kiểm tra A; duyệt chiến dịch thử     | A đọc được ghi chú; công khai đúng trạng thái                      |
| TC-05 / FR-05 | Chiến dịch công khai                  | Gửi 9.999đ/email sai; rồi 10.000đ/email hợp lệ                    | Chặn đầu vào sai; demo hợp lệ có bản ghi, không thu tiền           |
| TC-06 / FR-05 | Môi trường thử có thể mô phỏng lỗi DB | Gửi đóng góp khi insert bị từ chối                                | Hiển thị lỗi, không báo lưu thành công; source cần hoàn thiện      |
| TC-07 / FR-06 | Chiến dịch công khai                  | Gửi thiếu vai trò/kinh nghiệm; gửi hợp lệ; mô phỏng lỗi lưu       | Validate, lưu đúng, không báo thành công giả                       |
| TC-08 / FR-07 | A sở hữu chiến dịch                   | Đăng cập nhật hợp lệ; mở chi tiết chiến dịch                      | Nội dung/ngày đúng, gắn đúng chiến dịch                            |
| TC-09 / FR-09 | Có kênh tiếp nhận thử nghiệm          | Gửi liên hệ hợp lệ                                                | Lưu/chuyển yêu cầu đến kênh nhận; cơ chế log hiện tại chưa đáp ứng |
