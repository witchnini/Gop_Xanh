# Kiểm thử ba role chính

Kiểm tra source ngày 24/09/2026: `npm run build` và `npx tsc --noEmit` đạt. Các ca DB bên dưới chưa chạy; môi trường hiện không có PostgreSQL thử nghiệm hoặc Docker. Chưa nghiệm thu hành vi phân quyền chỉ từ kết quả build.

Chưa thực thi với DB. Chuẩn bị DB thử đã áp dụng migration 0002 và tài khoản contributor, partner A/B, admin.

| ID      | Thao tác                                                  | Kết quả mong đợi                                                         |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| ROLE-01 | Đăng ký email Người đóng góp                              | Có profile, role contributor; không có link nộp/quản lý hồ sơ            |
| ROLE-02 | Đăng ký partner lần lượt với ba loại chủ thể              | Role partner, entity_type đúng; nộp chiến dịch được                      |
| ROLE-03 | Giả metadata admin hoặc role lạ                           | Không được cấp admin, mặc định contributor                               |
| ROLE-04 | Đăng ký partner với entity_type thiếu/sai                 | Từ chối đăng ký, không tạo tài khoản dở dang                             |
| ROLE-05 | Đăng nhập Google tài khoản mới                            | Contributor, không tự lấy lựa chọn partner từ form email                 |
| ROLE-06 | Contributor mở trực tiếp nộp hồ sơ/hồ sơ của tôi          | Chuyển về chiến dịch; gọi server hoặc insert DB trực tiếp bị chặn        |
| ROLE-07 | Partner A duyệt chiến dịch hoặc đăng tiến độ cho B        | Bị từ chối, không thay đổi DB                                            |
| ROLE-08 | Admin duyệt hồ sơ                                         | Có quyền duyệt; admin không có partner không được nộp qua UI             |
| ROLE-09 | Áp dụng migration trên tài khoản farmer cũ                | Quyền đổi partner, hồ sơ/owner giữ nguyên; entity_type null chờ xác nhận |
| ROLE-10 | Contributor sửa metadata/profile thành partner hoặc admin | Bảng user_roles không thay đổi; không tăng quyền                         |

Kiểm tra thêm menu desktop/mobile và thông báo lỗi. Test lịch sử ghi farmer được hiểu là partner sau migration; farmer trong entity_type chỉ là Nông hộ.
