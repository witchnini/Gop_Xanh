# Sprint 1 - Nền tảng và hồ sơ

Cập nhật phân quyền: ba role contributor, partner, admin. Các story nông hộ áp dụng chung cho Chủ dự án / Đối tác (nông hộ, hợp tác xã, doanh nghiệp CSR/ESG). Task bổ sung: áp dụng migration 0002 trên DB thử và thực thi ROLE-01 đến ROLE-10 trong `test/roles.md` trước nghiệm thu.

Kế hoạch đề xuất; chưa ấn định ngày, người phụ trách hoặc ước lượng. Các story cần xác minh/hoàn thiện từ source hiện có, chưa được xác nhận Done.

| Story         | User story                                               | Tiêu chí chấp nhận                                                       | Task                                                                     |
| ------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| US-01 / FR-01 | Là khách, tôi muốn xem chiến dịch để chọn mô hình hỗ trợ | Danh sách/chi tiết nhất quán; không lộ hồ sơ chờ; có trạng thái rỗng/lỗi | T1.1 rà nguồn demo/DB; T1.2 kiểm tra slug; T1.3 chạy TC-01, TC-02        |
| US-02 / FR-02 | Là nông hộ, tôi muốn đăng nhập để quản lý hồ sơ          | Lỗi đăng nhập rõ; mất phiên bị chặn ở server                             | T2.1 kiểm tra Auth; T2.2 kiểm tra middleware; T2.3 chạy SEC-01           |
| US-03 / FR-03 | Là nông hộ, tôi muốn nộp hồ sơ để được sàng lọc          | Validate; đúng owner; lưu trạng thái chờ duyệt                           | T3.1 kiểm tra form; T3.2 kiểm tra DB; T3.3 chạy TC-03, SEC-02            |
| US-04 / FR-04 | Là admin, tôi muốn duyệt hồ sơ đủ điều kiện              | Chỉ admin có quyền; ghi chú đến chủ hồ sơ; công khai đúng trạng thái     | T4.1 kiểm tra role/RLS; T4.2 chốt luồng bổ sung; T4.3 chạy TC-04, SEC-03 |

## Điều kiện hoàn thành

Build/TypeScript đạt, kết quả lint được ghi nhận, test có bằng chứng trên môi trường thử nghiệm với tài khoản khách/nông hộ/admin. Có màn hình không đồng nghĩa đã nghiệm thu story.
