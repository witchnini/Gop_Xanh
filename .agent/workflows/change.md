# Quy trình thay đổi

1. Đọc yêu cầu, `AGENTS.md`, SRS, convention và module liên quan.
2. Xác định ảnh hưởng đến route, server function, dữ liệu, quyền và tài liệu.
3. Thực hiện thay đổi nhỏ, giữ pattern hiện tại; cập nhật đường dẫn khi di chuyển file.
4. Chạy `npx tsc --noEmit`, `npm run build`, `npm run lint` tại gốc và test case liên quan trong `test/`.
5. Ghi rõ kết quả, lỗi có sẵn, phần chưa chạy và dữ liệu thử nghiệm. Không dùng dữ liệu thật cho test ghi.
6. Cập nhật SRS/backlog/ERD nếu hành vi hoặc mô hình dữ liệu đổi; báo kết quả cho người dùng.
