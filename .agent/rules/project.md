# Quy tắc AI cho Góp Xanh

Đọc `AGENTS.md`, `docs/srs.md` và `docs/convention.md` trước khi thay đổi. Giữ phạm vi yêu cầu; không hoàn tác thay đổi của người dùng. Không sửa output sinh tự động hoặc viết lại lịch sử Git đã công bố.

Frontend ở `code/front end`, server functions ở `code/backend/src`. Dùng alias hiện có. Không giả định hai thư mục là hai dịch vụ độc lập. Phân biệt đóng góp demo và thanh toán thật; không tự suy diễn cơ chế tài chính/rủi ro chưa được chốt.

Khi làm UI/UX, đọc `docs/UI/UX style guideline/README.md` và lấy `BrandGuideline.pdf` trong cùng thư mục làm nguồn thương hiệu chính thức. Logo gốc nằm ở `logo/Logo.png` (đầy đủ) và `logo/Onlylogo.png` (biểu tượng). Không thay bằng chữ G/icon chung hoặc tự vẽ lại. Font thương hiệu: Playfair Display, Gotham, Montserrat; palette theo mã HEX trong PDF. Ghi rõ điểm mâu thuẫn hoặc chưa được quy định, không suy diễn thành quy chuẩn chính thức. Theme hiện có chưa đồng bộ đầy đủ với bộ nhận diện này.

Không in `.env`, token hoặc dữ liệu cá nhân. Không chạy migration hay ghi vào dịch vụ thật chỉ để kiểm tra cấu trúc. Ghi nhận kiểm thử thực sự đã chạy; không đánh dấu backlog Done từ việc có source.
