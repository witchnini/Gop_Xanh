---
name: project-review
description: Review Gop Xanh source against its SRS, permission model, and documented test cases.
---

# Rà soát Góp Xanh

Đọc `docs/srs.md`, `docs/DB-erd/README.md` và `test/`. Đối chiếu UI trong `code/front end/src` với server functions trong `code/backend/src` và RLS trong migration.

Ưu tiên lỗi phân quyền, rò rỉ thông tin, báo thành công khi lưu thất bại, sai trạng thái chiến dịch và nhầm dữ liệu mô phỏng với dữ liệu thật. Nêu file/dòng, điều kiện tái hiện và tác động cho từng phát hiện. Không sửa source nếu nhiệm vụ chỉ là review.

Chỉ báo pass cho kiểm tra đã thực thi; nêu rõ giới hạn khi chưa có tài khoản hoặc môi trường DB thử nghiệm.
