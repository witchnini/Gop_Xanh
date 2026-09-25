# Góp Xanh - Shark Xanh

Nền tảng huy động nguồn lực cộng đồng cho các mô hình nông nghiệp xanh.

## Cấu trúc source

    docs/
      srs.md
      convention.md
      backlogs/
      DB-erd/
      UI/UX style guideline/
    code/
      front end/
        src/
        public/
      backend/
        src/
        drizzle/
        supabase/
    .agent/
    test/

Frontend và backend được phân chia theo source nhưng dùng chung runtime TanStack Start và dependency ở thư mục gốc. Backend gồm server functions, SQL migration và cấu hình Supabase.

## Phát triển cục bộ

Yêu cầu Node.js 22.12 trở lên và npm.

    npm install
    npm run dev

Ứng dụng chạy mặc định tại http://localhost:8080.

Các lệnh kiểm tra:

    npm run build
    npx tsc --noEmit
    npm run lint

Giữ file .env tại thư mục gốc. Cấu hình Supabase phía trình duyệt dùng VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY. Không đưa secret key vào biến VITE_.

Migration PostgreSQL dùng DATABASE_URL. Schema Drizzle hiện là placeholder; đọc các SQL migration trong code/backend/drizzle/migrations khi kiểm tra thiết kế dữ liệu.

Google OAuth sử dụng provider và redirect URL được cấu hình trong Supabase. Đóng góp tiền trong MVP hiện là mô phỏng, chưa tích hợp cổng thanh toán thật.

Xem tài liệu đặc tả tại docs/srs.md, quy tắc code tại docs/convention.md và kế hoạch kiểm thử tại test/README.md.

## Production

URL: https://gop-xanh.vercel.app

Deployed trên Vercel (TanStack Start + Nitro preset). Mỗi push lên nhánh `main` sẽ tự động trigger deploy mới.

### Environment Variables (Vercel)

Cấu hình tại Vercel → Project → Settings → Environment Variables:

| Biến | Loại | Mô tả |
|---|---|---|
| `VITE_SUPABASE_URL` | Config (public) | Supabase project URL |
| `VITE_SUPABASE_PROJECT_ID` | Config (public) | Supabase project ID |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Config (public) | Supabase publishable key |
| `SUPABASE_URL` | Config | Supabase project URL (server-side) |
| `SUPABASE_PUBLISHABLE_KEY` | Config | Supabase publishable key (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Supabase service role key — bypass RLS |
| `CRON_SECRET` | Secret | Token xác thực cron job |

### Supabase URL Configuration

Khi đổi domain, cập nhật tại Supabase → Authentication → URL Configuration:

- **Site URL**: `https://gop-xanh.vercel.app`
- **Redirect URLs**: `https://gop-xanh.vercel.app/**`
