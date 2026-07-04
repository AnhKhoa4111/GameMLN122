export type QuestionType =
  | "sort"
  | "classify"
  | "followmoney"
  | "scenario"
  | "essay"

export interface RoomQuestion {
  type: QuestionType
  title: string
  prompt: string
  explanation: string
  hint: string
  options?: string[]
  answer?: string[]
}

export interface Room {
  id: number
  title: string
  description: string
  icon: string
  color: string
  borderColor: string
  bgColor: string
  codeFragment: string
  questions: RoomQuestion[]
}

export const GAME_CONFIG = {
  gameDurationMinutes: 20,
  hintsPerTeam: 3,
  hintPenaltySeconds: 120,
}

export const ROOMS: Room[] = [
  {
    id: 1,
    title: "Kho Lưu Trữ Lenin",
    description: "Giải mã nguồn gốc hình thành tư bản tài chính.",
    icon: "📚",
    color: "text-red-300",
    borderColor: "border-red-500",
    bgColor: "bg-red-500",
    codeFragment: "LENIN",
    questions: [
      {
        type: "sort",
        title: "Quá trình hình thành tư bản tài chính",
        prompt:
          "Hãy sắp xếp đúng trình tự hình thành tư bản tài chính theo lý luận của Lênin.",
        hint:
          "Bắt đầu từ quá trình tích tụ, tập trung trong sản xuất rồi đến ngân hàng.",
        explanation:
          "Theo Lênin, tư bản tài chính hình thành từ sự hợp nhất giữa tư bản ngân hàng của một số ít ngân hàng độc quyền lớn với tư bản của các liên minh độc quyền công nghiệp.",
        options: [
          "Tích tụ và tập trung sản xuất",
          "Hình thành tổ chức độc quyền công nghiệp",
          "Tích tụ và tập trung tư bản ngân hàng",
          "Hình thành ngân hàng độc quyền",
          "Tư bản ngân hàng hợp nhất với tư bản công nghiệp",
          "Tư bản tài chính ra đời",
        ],
        answer: [
          "Tích tụ và tập trung sản xuất",
          "Hình thành tổ chức độc quyền công nghiệp",
          "Tích tụ và tập trung tư bản ngân hàng",
          "Hình thành ngân hàng độc quyền",
          "Tư bản ngân hàng hợp nhất với tư bản công nghiệp",
          "Tư bản tài chính ra đời",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Căn Cứ Độc Quyền",
    description: "Phân loại các hình thức tổ chức độc quyền.",
    icon: "🏛️",
    color: "text-orange-300",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-500",
    codeFragment: "DOCQUYEN",
    questions: [
      {
        type: "classify",
        title: "Nhận diện hình thức độc quyền",
        prompt:
          "Một liên minh doanh nghiệp thống nhất về giá cả, phân chia thị trường và sản lượng, nhưng các doanh nghiệp vẫn độc lập về sản xuất và lưu thông. Đây là hình thức nào?",
        hint:
          "Hình thức này là liên minh độc quyền không vững chắc.",
        explanation:
          "Cartel là liên minh độc quyền về giá cả, phân chia thị trường, số lượng hàng hóa sản xuất. Các doanh nghiệp tham gia vẫn độc lập về sản xuất và lưu thông.",
        options: ["Cartel", "Syndicate", "Trust", "Consortium"],
        answer: ["Cartel"],
      },
    ],
  },
  {
    id: 3,
    title: "Trung Tâm Giám Sát",
    description: "Theo dấu dòng tiền để tìm thế lực chi phối thật sự.",
    icon: "🛰️",
    color: "text-yellow-300",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    codeFragment: "TAICHINH",
    questions: [
      {
        type: "followmoney",
        title: "Ai đang kiểm soát?",
        prompt:
          "Ngân hàng A đầu tư vào Công ty B. Công ty B nắm cổ phần chi phối Công ty C. Công ty C kiểm soát một doanh nghiệp fintech tại Việt Nam. Theo logic tư bản tài chính, ai là chủ thể có quyền chi phối sâu xa nhất?",
        hint:
          "Hãy lần ngược dòng sở hữu từ doanh nghiệp fintech về chủ thể đầu tiên.",
        explanation:
          "Quyền lực của tư bản tài chính không chỉ nằm ở sở hữu trực tiếp, mà còn thông qua mạng lưới cổ phần, ngân hàng, quỹ đầu tư và doanh nghiệp trung gian.",
        options: ["Ngân hàng A", "Công ty B", "Công ty C", "Doanh nghiệp fintech"],
        answer: ["Ngân hàng A"],
      },
    ],
  },
  {
    id: 4,
    title: "Hồ Sơ Việt Nam",
    description: "Xử lý tình huống hội nhập kinh tế và bảo vệ lợi ích quốc gia.",
    icon: "🇻🇳",
    color: "text-green-300",
    borderColor: "border-green-500",
    bgColor: "bg-green-500",
    codeFragment: "VIETNAM",
    questions: [
      {
        type: "scenario",
        title: "Ứng xử với vốn nước ngoài",
        prompt:
          "Một tập đoàn tài chính nước ngoài muốn đầu tư vào lĩnh vực ngân hàng, ví điện tử và dữ liệu thanh toán tại Việt Nam. Phương án nào phù hợp nhất?",
        hint:
          "Không nên đóng cửa hoàn toàn, nhưng cũng không nên mở cửa thiếu kiểm soát.",
        explanation:
          "Trong nền kinh tế mở, Việt Nam cần thu hút vốn, công nghệ và kinh nghiệm quản lý, nhưng phải kiểm soát các lĩnh vực then chốt, bảo vệ dữ liệu tài chính và chủ quyền kinh tế quốc gia.",
        options: [
          "Mở cửa hoàn toàn để thu hút vốn",
          "Từ chối toàn bộ vốn nước ngoài",
          "Cho phép đầu tư nhưng giới hạn tỷ lệ sở hữu, kiểm soát dữ liệu và chống độc quyền",
          "Để doanh nghiệp nước ngoài tự quyết định chính sách thị trường",
        ],
        answer: [
          "Cho phép đầu tư nhưng giới hạn tỷ lệ sở hữu, kiểm soát dữ liệu và chống độc quyền",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Phòng Quyết Định Quốc Gia",
    description: "Tổng hợp kiến thức để đưa ra chính sách bảo vệ nền kinh tế.",
    icon: "⚖️",
    color: "text-blue-300",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500",
    codeFragment: "CHUQUYEN",
    questions: [
      {
        type: "essay",
        title: "Chính sách bảo vệ chủ quyền kinh tế",
        prompt:
          "Chọn 3 chính sách phù hợp nhất để Việt Nam vừa tận dụng FDI, fintech nước ngoài, vừa bảo vệ chủ quyền kinh tế quốc gia.",
        hint:
          "Hãy chọn các chính sách cân bằng giữa hội nhập, phát triển và kiểm soát độc quyền.",
        explanation:
          "Việt Nam cần tận dụng mặt tích cực của hội nhập kinh tế, nhưng đồng thời phải kiểm soát độc quyền, bảo vệ dữ liệu tài chính, phát triển doanh nghiệp trong nước và tăng năng lực quản lý nhà nước.",
        options: [
          "Thu hút FDI có chọn lọc",
          "Kiểm soát tỷ lệ sở hữu nước ngoài trong lĩnh vực tài chính nhạy cảm",
          "Bảo vệ dữ liệu tài chính quốc gia",
          "Mở cửa hoàn toàn mọi lĩnh vực",
          "Phụ thuộc vào tập đoàn nước ngoài",
          "Phát triển doanh nghiệp và fintech trong nước",
        ],
        answer: [
          "Thu hút FDI có chọn lọc",
          "Kiểm soát tỷ lệ sở hữu nước ngoài trong lĩnh vực tài chính nhạy cảm",
          "Bảo vệ dữ liệu tài chính quốc gia",
        ],
      },
    ],
  },
]