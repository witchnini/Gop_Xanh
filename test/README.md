# Kiểm thử Góp Xanh

Phân quyền mới: [test ba role](roles.md). Dùng contributor, partner A/B và admin; các case cũ ghi nông hộ/farmer tương ứng partner sau migration 0002.

Các file trong thư mục này là test case thủ công, chưa phải bộ test tự động. Mỗi lần thực thi cần ghi ngày, môi trường, người chạy, kết quả thực tế và bằng chứng/lỗi. Mặc định các case chưa chạy.

| Nhóm           | File                             | Phạm vi                                                  |
| -------------- | -------------------------------- | -------------------------------------------------------- |
| Chức năng      | [functional.md](functional.md)   | FR-01 đến FR-09 đã có luồng trong source                 |
| Phân quyền     | [permissions.md](permissions.md) | Khách, nông hộ A/B, admin, RLS                           |
| Panel quản trị | [admin-panel.md](admin-panel.md) | Dashboard, Green Filter, chiến dịch, nguồn lực, tác động |
| Hồi quy        | [regression.md](regression.md)   | Build, type, lint, route, asset, hiển thị                |

Chuẩn bị DB thử nghiệm, nông hộ A/B và admin; chiến dịch chờ duyệt, gây quỹ, hoàn thành. Không dùng môi trường thật cho ca ghi dữ liệu. FR-08/FR-10 cần test chi tiết sau khi chốt nghiệp vụ.

## Lệnh kiểm tra tại gốc

```sh
npx tsc --noEmit
npm run build
npm run lint
npm run dev
```

Build/type không thay thế kiểm thử đăng nhập, quyền, lưu DB hoặc thanh toán. HTTP 200 ở route bảo vệ chưa xác nhận quyền truy cập, vì route hiện dùng chuyển hướng phía client.
