# Góp Xanh - Shark Xanh

## Cấu trúc source hiện tại

```text
docs/
  srs.md
  convention.md
  backlogs/
    sprint1/README.md
    sprint2/README.md
  DB-erd/README.md
  UI/UX style guideline/README.md
code/
  front end/
    src/
    public/
  backend/
    src/
    drizzle/
    supabase/
.agent/
  rules/project.md
  workflows/change.md
  skills/project-review/SKILL.md
test/
  README.md
  functional.md
  permissions.md
  regression.md
```

`srs.md` và `convention.md` là file. `UI/UX style guideline` gồm thư mục `UI` và thư mục con `UX style guideline` vì `/` là ký tự phân cách đường dẫn.

Frontend và backend được phân chia theo source, dùng chung runtime TanStack Start và dependency ở gốc. Backend chứa server functions, SQL migration và cấu hình Supabase. Các adapter tích hợp, kiểu dữ liệu dùng chung và entry SSR hiện nằm trong frontend. Chưa có backend server chạy độc lập.

Chạy `npm install`, `npm run dev`, `npm run build`, `npx tsc --noEmit` và `npm run lint` từ gốc. Giữ `.env`, cấu hình build, lockfile, `.lovable` và `AGENTS.md` ở gốc. `.output`, `.wrangler`, `node_modules` là kết quả sinh tự động, không sửa trực tiếp.

Xem [đặc tả](docs/srs.md), [quy tắc code](docs/convention.md) và [kiểm thử](test/README.md). Đóng góp tiền hiện là mô phỏng. Backlog là kế hoạch đề xuất, không phải xác nhận đã hoàn thành. Build cục bộ không xác nhận việc đồng bộ hoặc triển khai cấu trúc mới trên Lovable.

## Nội dung khởi tạo và liên kết Lovable

Hãy tạo cho tôi một trang web dựa trên file PRD tôi gửi bạn, còn với phong cách style thì sử dụng nội dung trong file DESIGN. Frontend sử dụng React, backend sử dụng Nodejs, tách backend và frontend ra làm các project riêng biệt, Với frontend sử dụng các components của shadcn. Sử dụng các package cần thiết cho cả frontend và backend.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://radiant-builds-56.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c1399e72-05f1-447c-87a2-abbd9b001258).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
