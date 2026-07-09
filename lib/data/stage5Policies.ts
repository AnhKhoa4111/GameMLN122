export type Stage5PolicyCard = {
  id: string
  title: string
  tag: string
  isCorrect: boolean
  reason: string
}


export const STAGE5_REQUIRED_SELECTION_COUNT = 4
export const STAGE5_POINTS_PER_CORRECT_CARD = 25
export const STAGE5_PERFECT_SCORE = 200


export const stage5PolicyCards: Stage5PolicyCard[] = [
  {
    id: "selective-fdi",
    title: "Thu hút FDI có chọn lọc",
    tag: "Mở cửa thông minh",
    isCorrect: true,
    reason: "Nhận vốn, công nghệ và thị trường nhưng vẫn chọn dự án phù hợp lợi ích Việt Nam.",
  },
  {
    id: "domestic-business",
    title: "Phát triển doanh nghiệp trong nước",
    tag: "Nội lực quốc gia",
    isCorrect: true,
    reason: "Doanh nghiệp Việt mạnh hơn thì nền kinh tế ít phụ thuộc vào tư bản bên ngoài hơn.",
  },
  {
    id: "full-opening",
    title: "Mở cửa hoàn toàn",
    tag: "Rủi ro mất kiểm soát",
    isCorrect: false,
    reason: "Mở cửa không điều kiện dễ làm tăng phụ thuộc và mất kiểm soát lĩnh vực trọng yếu.",
  },
  {
    id: "anti-monopoly",
    title: "Chống độc quyền",
    tag: "Giữ cạnh tranh",
    isCorrect: true,
    reason: "Kiểm soát độc quyền giúp thị trường không bị một nhóm vốn lớn thao túng.",
  },
  {
    id: "fintech-control",
    title: "Kiểm soát Fintech",
    tag: "Tốt nhưng chưa đủ",
    isCorrect: false,
    reason: "Đây là chính sách tốt, nhưng trong bộ 4 chiến lược tổng thể chưa phải lựa chọn ưu tiên nhất.",
  },
  {
    id: "financial-data",
    title: "Bảo vệ dữ liệu tài chính",
    tag: "Chủ quyền số",
    isCorrect: true,
    reason: "Dữ liệu tài chính là quyền lực mềm mới, cần được bảo vệ trong nền kinh tế số.",
  },
  {
    id: "foreign-capital-dependence",
    title: "Phụ thuộc vốn ngoại",
    tag: "Bẫy phụ thuộc",
    isCorrect: false,
    reason: "Phụ thuộc vốn ngoại đi ngược mục tiêu bảo vệ chủ quyền kinh tế.",
  },
  {
    id: "stock-transparency",
    title: "Minh bạch thị trường chứng khoán",
    tag: "Tốt nhưng phụ trợ",
    isCorrect: false,
    reason: "Đây là chính sách tốt, nhưng không phải trọng tâm nhất của Boss Room lần này.",
  },
]
