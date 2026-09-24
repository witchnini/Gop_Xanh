# Đặc tả phần mềm Góp Xanh

Phiên bản 0.1, ngày 24/09/2026. Nguồn nghiệp vụ: hồ sơ dự thi Shark Xanh do chủ dự án cung cấp. Hiện trạng đối chiếu source, chưa nghiệm thu trên dữ liệu thật.

## 1. Mục tiêu và phạm vi

Kết nối nông hộ, hợp tác xã và mô hình nông nghiệp xanh nhỏ với cộng đồng đóng góp tài chính, kỹ năng và thời gian. MVP thí điểm tại Hà Nội, hướng đến cộng đồng trẻ 18-35 tuổi. Bốn trụ cột: góp đa nguồn lực, lọc xanh, theo dõi tác động, chia sẻ rủi ro.

MVP gồm xem chiến dịch, nộp và duyệt hồ sơ, góp tiền mô phỏng, đăng ký chuyên môn và cập nhật tiến độ. Thanh toán thật, giải ngân, hoàn tiền, xác minh tác động độc lập và gói CSR/ESG doanh nghiệp chưa được triển khai đầy đủ.

## 2. Tác nhân

| Tác nhân                        | Nhu cầu / quyền dự kiến                                                  |
| ------------------------------- | ------------------------------------------------------------------------ |
| Người đóng góp (`contributor`)  | Xem chiến dịch công khai, góp tiền demo, đăng ký chuyên môn              |
| Chủ dự án / Đối tác (`partner`) | Nộp hồ sơ, quản lý chiến dịch của mình, đăng tiến độ; cũng được đóng góp |
| Quản trị viên                   | Xem hồ sơ, duyệt, yêu cầu bổ sung, từ chối, theo dõi thống kê            |

Ba role chính: `contributor`, `partner`, `admin`. Khách chưa đăng nhập là trạng thái truy cập, không phải role thứ tư. Chủ dự án / Đối tác bao gồm Nông hộ, Hợp tác xã, Doanh nghiệp CSR/ESG; phân biệt bằng `profiles.entity_type` (`farmer`, `cooperative`, `enterprise`), không tạo role riêng.

Đăng ký email chọn Người đóng góp hoặc Chủ dự án / Đối tác; chọn đối tác phải có loại chủ thể. Google mới mặc định Người đóng góp. Admin chỉ được cấp bởi người vận hành có thẩm quyền, không lấy quyền admin từ metadata đăng ký. Doanh nghiệp chỉ tài trợ có thể đăng ký Người đóng góp. Dashboard CSR/ESG vẫn là định hướng phát triển.

Migration `0002_three_roles.sql` đổi role cũ `farmer` thành `partner`, giữ hồ sơ/chiến dịch và quyền cũ; loại chủ thể của tài khoản cũ để null chờ xác nhận. Migration chưa áp dụng vào DB thật; cần triển khai cùng phiên bản ứng dụng. Mô hình `user_roles` vẫn cho phép một tài khoản có nhiều quyền, nhưng chỉ có ba loại role này.

## 3. Yêu cầu chức năng

| ID    | Yêu cầu / điều kiện nghiệm thu                                                                  | Hiện trạng source                                          |
| ----- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| FR-01 | Liệt kê, xem chiến dịch đã duyệt; không lộ hồ sơ chưa duyệt                                     | Có truy vấn DB và dữ liệu demo; cần kiểm thử phân quyền    |
| FR-02 | Đăng ký/đăng nhập; chặn người chưa đăng nhập tại nghiệp vụ nông hộ                              | Có Auth và middleware                                      |
| FR-03 | Nộp hồ sơ với tên, loại mô hình, địa bàn, tóm tắt, câu chuyện, canh tác, tác động, mục tiêu vốn | Có validation; mục tiêu tối thiểu 10 triệu đồng            |
| FR-04 | Chỉ admin được duyệt, yêu cầu bổ sung, từ chối                                                  | Có kiểm tra admin tại server                               |
| FR-05 | Đóng góp demo tối thiểu 10.000 đồng; email hợp lệ; ghi rõ không thu tiền                        | Có mô phỏng; cần xử lý lỗi lưu DB trước khi báo thành công |
| FR-06 | Đăng ký chuyên môn gắn chiến dịch, vai trò, kinh nghiệm, thông tin liên lạc                     | Có đăng ký; chưa có ghép việc/nghiệm thu                   |
| FR-07 | Chủ hồ sơ xem trạng thái/ghi chú duyệt, đăng cập nhật tiến độ                                   | Có; cần kiểm thử quyền sở hữu                              |
| FR-08 | Chỉ số tác động có mục tiêu, thực tế, đơn vị, thời điểm và minh chứng                           | Mới có mô tả/bản tin; chưa có dữ liệu chỉ số cấu trúc      |
| FR-09 | Tiếp nhận liên hệ và thông báo đúng kết quả xử lý                                               | Hiện ghi log, chưa lưu trữ/xử lý yêu cầu                   |
| FR-10 | Công bố rủi ro, trách nhiệm, phương án khi chiến dịch không đạt                                 | Cần chốt nghiệp vụ                                         |

## 4. Luồng nghiệp vụ

Đăng ký → nộp hồ sơ → sàng lọc → công khai → đóng góp → cập nhật → tổng kết.

Trạng thái hiện có: `cho_duyet`, `can_bo_sung`, `dang_gay_quy`, `hoan_thanh`, `tu_choi`. Luồng đề xuất: chờ duyệt có thể bổ sung, từ chối hoặc cho gây quỹ; gây quỹ có thể hoàn thành. Source chưa ràng buộc đầy đủ chuyển trạng thái hoặc quy trình nộp lại hồ sơ.

Green Filter đánh giá tính khả thi, minh bạch và tác động môi trường/cộng đồng. Bộ tiêu chí chấm điểm, bằng chứng bắt buộc và trách nhiệm xác minh cần được nhóm thống nhất.

## 5. Phi chức năng

- Kiểm tra quyền tại server và RLS, không chỉ ẩn nút giao diện.
- Không công khai thông tin liên hệ cá nhân trong dữ liệu chiến dịch.
- Validate đầu vào; lỗi lưu dữ liệu phải phản ánh cho người gửi.
- Giao diện tiếng Việt, hỗ trợ điện thoại/máy tính, nhãn form, trạng thái lỗi và bàn phím.
- Build/TypeScript đạt sau thay đổi; ghi nhận kết quả lint và kiểm thử nghiệp vụ.
- Mục tiêu tải, phản hồi, lưu giữ và khôi phục dữ liệu cần chốt trước pilot; chưa cam kết SLA.

## 6. Dữ liệu và giới hạn

Xem [ERD](DB-erd/README.md). `raised`, `supporters` là số tổng hợp; chưa thấy cơ chế đối soát giao dịch hoặc trigger cộng dồn trong migration hiện có.

Cần chốt tiêu chí lọc xanh, điều kiện hoàn thành, chia sẻ rủi ro, lưu giữ dữ liệu cá nhân, phần thưởng, nghiệm thu chuyên môn. Backlog mô tả kế hoạch đề xuất, chưa phân công hoặc ấn định thời gian.
