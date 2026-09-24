import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import campaign3 from "@/assets/campaign-3.jpg";
import heroField from "@/assets/hero-field.jpg";

export type Tier = {
  amount: number;
  title: string;
  reward: string;
};

export type BudgetItem = {
  label: string;
  amount: number;
};

export type Update = {
  date: string;
  title: string;
  description: string;
};

export type VolunteerRole = {
  title: string;
  description: string;
};

export type Campaign = {
  slug: string;
  name: string;
  owner: string;
  category: string;
  district: string;
  image: string;
  summary: string;
  story: string;
  method: string;
  impact: string;
  raised: number;
  goal: number;
  supporters: number;
  daysLeft: number;
  status: "Đang gây quỹ" | "Sắp hoàn thành" | "Đã hoàn thành";
  tiers: Tier[];
  budget: BudgetItem[];
  updates: Update[];
  roles: VolunteerRole[];
};

export const heroImage = heroField;

export const campaigns: Campaign[] = [
  {
    slug: "hat-giong-mua-xuan",
    name: "Hạt Giống Mùa Xuân",
    owner: "HTX Rau An Toàn Thanh Trì",
    category: "Rau hữu cơ",
    district: "Thanh Trì",
    image: campaign1,
    summary:
      "Hỗ trợ 20 hộ dân chuyển từ canh tác hóa chất sang rau hữu cơ theo chuẩn VietGAP.",
    story:
      "20 hộ dân tại xã Yên Mỹ đang canh tác rau theo lối cũ, phụ thuộc phân bón hóa học và thuốc trừ sâu. Hợp tác xã muốn chuyển toàn bộ 3,5 ha sang canh tác hữu cơ trong hai vụ, nhưng thiếu vốn mua giống, phân vi sinh và chi phí chứng nhận.",
    method: "Canh tác hữu cơ luân canh, ủ phân vi sinh tại chỗ, không thuốc trừ sâu hóa học.",
    impact: "3,5 ha đất phục hồi, giảm 4,2 tấn phân hóa học mỗi năm, tăng 35% thu nhập hộ.",
    raised: 178000000,
    goal: 250000000,
    supporters: 312,
    daysLeft: 24,
    status: "Đang gây quỹ",
    tiers: [
      {
        amount: 50000,
        title: "Gói Hạt Mầm",
        reward: "Thư cảm ơn và bản tin tiến độ hàng tháng từ nông hộ.",
      },
      {
        amount: 200000,
        title: "Gói Luống Rau",
        reward: "Bản tin tiến độ, tên trên trang chiến dịch và 1kg rau vụ đầu.",
      },
      {
        amount: 500000,
        title: "Gói Đồng Hành",
        reward: "Toàn bộ quyền lợi trên, cùng một chuyến thăm vườn cuối vụ.",
      },
    ],
    budget: [
      { label: "Giống rau và phân vi sinh", amount: 95000000 },
      { label: "Hệ thống tưới nhỏ giọt", amount: 80000000 },
      { label: "Chi phí chứng nhận VietGAP", amount: 45000000 },
      { label: "Tập huấn kỹ thuật cho hộ dân", amount: 30000000 },
    ],
    updates: [
      {
        date: "12/08/2026",
        title: "Hoàn tất khảo sát đất",
        description: "Mẫu đất của 20 hộ đã được phân tích, 17 hộ đủ điều kiện chuyển đổi ngay.",
      },
      {
        date: "02/09/2026",
        title: "Nhận đợt giống đầu tiên",
        description: "Giống rau cải, mồng tơi và rau dền đã về tới kho hợp tác xã.",
      },
      {
        date: "28/09/2026",
        title: "Xuống giống vụ thử",
        description: "1,2 ha đầu tiên đã xuống giống, dự kiến thu hoạch sau 45 ngày.",
      },
    ],
    roles: [
      { title: "Mentor tài chính", description: "Hướng dẫn hộ dân ghi sổ thu chi và tính giá thành." },
      { title: "Truyền thông", description: "Viết bài, chụp ảnh tiến độ vụ mùa cho trang chiến dịch." },
    ],
  },
  {
    slug: "vuon-ga-doi-mam",
    name: "Vườn Gà Đồi Mâm",
    owner: "Nông hộ anh Nguyễn Văn Tuấn",
    category: "Chăn nuôi sinh thái",
    district: "Ba Vì",
    image: campaign2,
    summary:
      "Xây hệ thống ủ phân và chuồng trại khép kín thân thiện môi trường cho đàn gà thả vườn.",
    story:
      "Anh Tuấn nuôi 800 con gà thả vườn nhưng chưa xử lý được chất thải, gây mùi và ô nhiễm nguồn nước quanh khu dân cư. Chiến dịch giúp anh xây hệ ủ phân sinh học, biến chất thải thành phân bón cho vườn rau kế bên.",
    method: "Chăn nuôi thả vườn, đệm lót sinh học, tuần hoàn chất thải thành phân bón.",
    impact: "Xử lý 12 tấn chất thải mỗi năm, cung cấp phân hữu cơ cho 1,5 ha rau lân cận.",
    raised: 64200000,
    goal: 90000000,
    supporters: 187,
    daysLeft: 12,
    status: "Đang gây quỹ",
    tiers: [
      { amount: 100000, title: "Gói Đệm Lót", reward: "Thư cảm ơn và ảnh tiến độ chuồng trại." },
      { amount: 300000, title: "Gói Chuồng Sạch", reward: "Ảnh tiến độ và 10 quả trứng gà thả vườn." },
    ],
    budget: [
      { label: "Hệ thống ủ phân sinh học", amount: 40000000 },
      { label: "Cải tạo chuồng trại", amount: 32000000 },
      { label: "Men vi sinh và vật tư", amount: 18000000 },
    ],
    updates: [
      {
        date: "20/08/2026",
        title: "Thiết kế hệ ủ hoàn thiện",
        description: "Kỹ sư nông nghiệp đã chốt bản vẽ hệ ủ phân hai ngăn.",
      },
      {
        date: "15/09/2026",
        title: "Đổ móng khu ủ",
        description: "Phần móng và rãnh thoát đã hoàn thành, chờ vật tư đợt hai.",
      },
    ],
    roles: [
      { title: "Kỹ thuật nông nghiệp", description: "Tư vấn quy trình ủ phân và kiểm soát mùi." },
      { title: "Kết nối thị trường", description: "Giới thiệu sản phẩm trứng sạch tới cửa hàng nội thành." },
    ],
  },
  {
    slug: "mua-lua-huu-co-me-linh",
    name: "Mùa Lúa Hữu Cơ Mê Linh",
    owner: "HTX Lúa Xanh Mê Linh",
    category: "Lúa nước",
    district: "Mê Linh",
    image: campaign3,
    summary:
      "Chuyển 6 ha lúa sang canh tác hữu cơ, giữ nguồn nước sạch và phục hồi hệ sinh thái đồng ruộng.",
    story:
      "Hợp tác xã có 42 thành viên canh tác lúa trên 6 ha ven sông Hồng. Việc lạm dụng thuốc bảo vệ thực vật khiến nguồn nước suy giảm. Chiến dịch tài trợ giống lúa bản địa, chế phẩm sinh học và chi phí kiểm định nước.",
    method: "Canh tác lúa hữu cơ, thả vịt diệt sâu, dùng chế phẩm sinh học thay thuốc hóa học.",
    impact: "6 ha ruộng chuyển đổi, giảm 3,1 tấn CO₂ mỗi năm, nguồn nước tưới đạt chuẩn.",
    raised: 301000000,
    goal: 350000000,
    supporters: 640,
    daysLeft: 6,
    status: "Sắp hoàn thành",
    tiers: [
      { amount: 50000, title: "Gói Gieo Mạ", reward: "Thư cảm ơn và bản tin mùa vụ." },
      { amount: 250000, title: "Gói Mùa Gặt", reward: "Bản tin mùa vụ và 2kg gạo hữu cơ vụ đầu." },
      { amount: 1000000, title: "Gói Đồng Ruộng", reward: "5kg gạo hữu cơ và tên trên bảng tri ân của hợp tác xã." },
    ],
    budget: [
      { label: "Giống lúa bản địa", amount: 120000000 },
      { label: "Chế phẩm sinh học", amount: 110000000 },
      { label: "Kiểm định nước và đất", amount: 70000000 },
      { label: "Tập huấn cho 42 thành viên", amount: 50000000 },
    ],
    updates: [
      {
        date: "05/08/2026",
        title: "Ký cam kết với 42 hộ",
        description: "Toàn bộ thành viên hợp tác xã cam kết không dùng thuốc hóa học trong hai vụ.",
      },
      {
        date: "22/08/2026",
        title: "Thả lứa vịt đầu tiên",
        description: "300 con vịt được thả trên 2 ha ruộng để kiểm soát sâu rầy tự nhiên.",
      },
      {
        date: "18/09/2026",
        title: "Kết quả kiểm định nước",
        description: "Chỉ số dư lượng thuốc trong nước tưới giảm 62% so với đầu vụ.",
      },
    ],
    roles: [
      { title: "Mentor kỹ thuật", description: "Đồng hành kiểm soát sâu bệnh bằng phương pháp sinh học." },
      { title: "Thiết kế", description: "Thiết kế bao bì gạo hữu cơ cho hợp tác xã." },
    ],
  },
];

export const categories = ["Tất cả", "Rau hữu cơ", "Chăn nuôi sinh thái", "Lúa nước"];

export const platformStats = [
  { value: "2.480", label: "người đã góp" },
  { value: "18,6 tỷ", label: "vnđ đã huy động" },
  { value: "34", label: "trang trại xanh" },
];

export const modelSteps = [
  {
    step: "01",
    title: "Góp đa nguồn lực",
    description: "Tiền, kỹ năng, thời gian và kết nối thị trường — mọi nguồn lực đều được ghi nhận.",
  },
  {
    step: "02",
    title: "Lọc xanh",
    description: "Hồ sơ nông hộ đi qua bộ tiêu chí khả thi — minh bạch — tác động trước khi mở gây quỹ.",
  },
  {
    step: "03",
    title: "Theo dõi tác động",
    description: "Mỗi chiến dịch cập nhật tiến độ bằng hình ảnh và số liệu thực địa định kỳ.",
  },
  {
    step: "04",
    title: "Chia sẻ rủi ro",
    description: "Quỹ dự phòng cùng nông hộ gánh rủi ro mùa vụ, cân bằng cho cả hai phía.",
  },
];

export const greenFilterCriteria = [
  {
    group: "Tính khả thi",
    items: [
      "Chủ thể có kinh nghiệm sản xuất thực tế tối thiểu 1 vụ.",
      "Kế hoạch sử dụng vốn chi tiết theo từng hạng mục.",
      "Đầu ra sản phẩm có kênh tiêu thụ dự kiến.",
    ],
  },
  {
    group: "Mức độ minh bạch",
    items: [
      "Cam kết cập nhật tiến độ tối thiểu 2 lần mỗi tháng.",
      "Công khai hóa đơn, chứng từ các hạng mục chi lớn.",
      "Cho phép cộng tác viên tới thăm thực địa.",
    ],
  },
  {
    group: "Tác động xanh",
    items: [
      "Giảm rõ rệt phân bón, thuốc hóa học hoặc chất thải.",
      "Bảo vệ nguồn nước, đất và đa dạng sinh học địa phương.",
      "Cải thiện sinh kế cho ít nhất 5 hộ dân trong vùng.",
    ],
  },
];

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function formatShort(value: number) {
  if (value >= 1000000000) return (value / 1000000000).toFixed(1).replace(".", ",") + " tỷ";
  return Math.round(value / 1000000) + "tr";
}

export function progressOf(c: Campaign) {
  return Math.min(100, Math.round((c.raised / c.goal) * 100));
}

export function getCampaign(slug: string) {
  return campaigns.find((c) => c.slug === slug);
}

/** Map một chiến dịch từ cơ sở dữ liệu (đã duyệt) sang kiểu Campaign hiển thị công khai */
export function mapDbCampaign(row: {
  slug: string;
  name: string;
  category: string;
  district: string;
  summary: string;
  story: string;
  method: string;
  impact: string;
  goal: number | string;
  raised: number | string;
  supporters: number;
  image_url: string | null;
  status: string;
  updates?: { title: string; description: string; created_at: string }[];
}): Campaign {
  return {
    slug: row.slug,
    name: row.name,
    owner: "Chủ thể đã qua Bộ lọc xanh",
    category: row.category,
    district: row.district,
    image: row.image_url ?? campaign1,
    summary: row.summary,
    story: row.story,
    method: row.method,
    impact: row.impact,
    raised: Number(row.raised),
    goal: Number(row.goal),
    supporters: row.supporters,
    daysLeft: 30,
    status: row.status === "hoan_thanh" ? "Đã hoàn thành" : "Đang gây quỹ",
    tiers: [],
    budget: [],
    updates: (row.updates ?? []).map((u) => ({
      date: new Date(u.created_at).toLocaleDateString("vi-VN"),
      title: u.title,
      description: u.description,
    })),
    roles: [],
  };
}
