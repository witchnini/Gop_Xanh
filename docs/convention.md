# Quy tắc code

Role nghiệp vụ: `contributor`, `partner`, `admin`. Kiểm tra quyền bằng `user_roles`/`has_role`, không dùng metadata hoặc `entity_type` làm quyền. Nông hộ, hợp tác xã, doanh nghiệp là loại chủ thể của partner.

## Tổ chức

- UI, routes, hooks, assets, CSS: `code/front end/src`; tài nguyên tĩnh: `code/front end/public`.
- Server functions: `code/backend/src`; DB: `code/backend/drizzle`; cấu hình dịch vụ: `code/backend/supabase`.
- `@/` trỏ frontend; `@backend/` trỏ backend. Không import UI vào nghiệp vụ server.
- Component dùng PascalCase, hàm/biến camelCase, tên file theo kebab-case đang có. Routes giữ quy ước file-based routing.
- Module chỉ dùng server có hậu tố `.server.ts`. Không đưa khóa service role vào trình duyệt hoặc biến `VITE_*`.

## Định dạng và dữ liệu

Giữ strict TypeScript, type cụ thể, Zod cho đầu vào ngoài hệ thống. Theo Prettier/ESLint ở gốc; format file liên quan, tránh thay đổi hàng loạt ngoài phạm vi. Tiếng Việt dùng UTF-8; comment giải thích lý do/ràng buộc.

Kiểm tra role/chủ sở hữu ở backend và RLS. Kiểm tra `error` từ Supabase, không báo thành công khi lưu thất bại. Không ghi dữ liệu cá nhân hoặc bí mật vào log. Không sửa migration đã áp dụng. Schema Drizzle đang là placeholder; không sinh migration phá DB từ schema trống.

## Xác minh

Đọc module trước khi sửa. Không sửa tay `routeTree.gen.ts`, `.output`, `.wrangler`, `node_modules`. Thay đổi nghiệp vụ cần cập nhật SRS/backlog/test case. Chạy build, TypeScript, lint và test phù hợp; ghi rõ lỗi có sẵn và phần chưa kiểm thử. Không viết lại lịch sử Git đã công bố.
