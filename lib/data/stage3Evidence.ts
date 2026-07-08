export type Stage3EvidenceCard = {
  id: string
  code: string
  title: string
  shortContent: string[]
  detailContent: string[]
  note: string
}

export type Stage3AnswerOption = {
  id: string
  label: string
  explanation: string
  isCorrect: boolean
}

export const stage3EvidenceCards: Stage3EvidenceCard[] = [
  {
    id: "fintech-x",
    code: "A",
    title: "Fintech X",
    shortContent: [
      "Mekong Retail: 32%",
      "Aurora Bank: 28%",
      "Blue Star Tech: 18%",
      "Cổ đông nhỏ lẻ: 22%",
    ],
    detailContent: [
      "Fintech X là nền tảng thanh toán số đang phát triển tại Việt Nam.",
      "Cổ đông công khai gồm: Mekong Retail 32%, Aurora Bank 28%, Blue Star Tech 18%, cổ đông nhỏ lẻ 22%.",
      "Không có cổ đông nào nắm quá 50%.",
    ],
    note:
      "Thẻ nền tảng. Nếu chỉ nhìn cổ phần công khai thì rất khó kết luận ai thật sự kiểm soát.",
  },
  {
    id: "mekong-retail",
    code: "B",
    title: "Mekong Retail",
    shortContent: [
      "Sở hữu 32% Fintech X",
      "Không có quyền phủ quyết dữ liệu",
      "Không bổ nhiệm giám đốc tài chính",
    ],
    detailContent: [
      "Mekong Retail sở hữu 32% Fintech X.",
      "Không có quyền phủ quyết dữ liệu.",
      "Không có quyền bổ nhiệm giám đốc tài chính.",
      "Chủ yếu dùng Fintech X làm kênh thanh toán cho hệ thống bán lẻ.",
    ],
    note:
      "Mekong Retail có cổ phần cao nhất, nhưng thiếu quyền kiểm soát các quyết định cốt lõi.",
  },
  {
    id: "aurora-bank",
    code: "C",
    title: "Aurora Bank",
    shortContent: [
      "Sở hữu 28% Fintech X",
      "Cung cấp tín dụng lớn",
      "Không nắm quyền phủ quyết dữ liệu",
    ],
    detailContent: [
      "Aurora Bank sở hữu 28% Fintech X.",
      "Cung cấp hạn mức tín dụng lớn cho Fintech X.",
      "Có thể gây áp lực tài chính nếu Fintech X mất khả năng trả nợ.",
      "Không nắm quyền phủ quyết trong ủy ban dữ liệu.",
    ],
    note:
      "Aurora Bank có ảnh hưởng tài chính mạnh, nhưng chưa đủ để kết luận là chủ thể kiểm soát cuối cùng.",
  },
  {
    id: "blue-star-tech",
    code: "D",
    title: "Blue Star Tech",
    shortContent: [
      "Sở hữu 18% Fintech X",
      "Cung cấp hạ tầng dữ liệu",
      "Quản lý thuật toán tín dụng",
    ],
    detailContent: [
      "Blue Star Tech sở hữu 18% Fintech X.",
      "Cung cấp hạ tầng dữ liệu.",
      "Quản lý thuật toán chấm điểm tín dụng.",
      "Có hợp đồng độc quyền 5 năm với Fintech X.",
    ],
    note:
      "Blue Star Tech nắm công nghệ và dữ liệu, nhưng cần tìm tiếp ai đứng sau công ty này.",
  },
  {
    id: "preferred-share",
    code: "E",
    title: "Cổ phần ưu đãi",
    shortContent: [
      "Phủ quyết đối tác cho vay",
      "Phủ quyết chia sẻ dữ liệu",
      "Phủ quyết hệ thống chấm điểm",
    ],
    detailContent: [
      "Một nhóm cổ đông có quyền phủ quyết việc thay đổi đối tác cho vay.",
      "Có quyền phủ quyết việc chia sẻ dữ liệu người dùng.",
      "Có quyền phủ quyết việc thay đổi hệ thống chấm điểm tín dụng.",
      "Quyền kiểm soát không chỉ phụ thuộc vào tỷ lệ cổ phần phổ thông.",
    ],
    note:
      "Thẻ này cho thấy quyền lực có thể nằm ở quyền phủ quyết, không chỉ ở tỷ lệ cổ phần.",
  },
  {
    id: "silver-lion-fund",
    code: "F",
    title: "Silver Lion Fund",
    shortContent: [
      "Không xuất hiện công khai",
      "Nắm cổ phần ưu đãi ở Blue Star Tech",
      "Có liên kết lợi ích với cổ đông nhỏ lẻ",
    ],
    detailContent: [
      "Silver Lion Fund không xuất hiện trong danh sách cổ đông công khai của Fintech X.",
      "Nắm cổ phần ưu đãi trong Blue Star Tech.",
      "Có đại diện trong nhóm cố vấn đầu tư của Fintech X.",
      "Có liên kết lợi ích với một phần cổ đông nhỏ lẻ.",
    ],
    note:
      "Silver Lion Fund không trực tiếp lộ diện trong danh sách cổ đông, nhưng xuất hiện trong nhiều mối liên kết quan trọng.",
  },
  {
    id: "small-shareholders",
    code: "G",
    title: "Cổ đông nhỏ lẻ",
    shortContent: [
      "Chiếm 22% Fintech X",
      "12% có thỏa thuận biểu quyết chung",
      "Tên quỹ không công khai",
    ],
    detailContent: [
      "Cổ đông nhỏ lẻ chiếm 22% cổ phần Fintech X.",
      "Trong đó 12% đã ký thỏa thuận biểu quyết chung với một quỹ đầu tư nước ngoài.",
      "10% còn lại không có lập trường thống nhất.",
      "Tên quỹ không xuất hiện trong báo cáo công khai.",
    ],
    note:
      "Thẻ này cho thấy một phần cổ đông nhỏ lẻ có thể đang biểu quyết theo cùng một mạng lưới lợi ích.",
  },
  {
    id: "audit-report",
    code: "H",
    title: "Kiểm toán nội bộ",
    shortContent: [
      "Quyết định đi theo nhóm ưu đãi",
      "Liên quan đối tác công nghệ",
      "Mã mạng lưới: S.L.F.",
    ],
    detailContent: [
      "Các quyết định quan trọng của Fintech X thường đi theo đề xuất của nhóm cổ phần ưu đãi, đối tác công nghệ và nhóm cổ đông biểu quyết chung.",
      "Dòng vốn, dữ liệu tín dụng và thuật toán cho vay đều liên quan đến cùng một mạng lưới đầu tư.",
      "Mã mạng lưới được ghi trong báo cáo là: S.L.F.",
    ],
    note:
      "Thẻ chốt. Người chơi cần tự giải mã S.L.F. bằng cách liên hệ với các thẻ đã lật trước đó.",
  },
]

export const stage3AnswerOptions: Stage3AnswerOption[] = [
  {
    id: "aurora-bank",
    label: "Aurora Bank",
    isCorrect: false,
    explanation:
      "Aurora Bank có ảnh hưởng tài chính vì cho vay vốn lớn, nhưng không nắm quyền phủ quyết dữ liệu và không phải chủ thể kiểm soát cuối cùng.",
  },
  {
    id: "mekong-retail",
    label: "Mekong Retail",
    isCorrect: false,
    explanation:
      "Mekong Retail có tỷ lệ cổ phần công khai cao nhất, nhưng không có quyền phủ quyết dữ liệu, không bổ nhiệm giám đốc tài chính và chủ yếu dùng Fintech X làm kênh thanh toán.",
  },
  {
    id: "silver-lion-fund",
    label: "Silver Lion Fund",
    isCorrect: true,
    explanation:
      "Silver Lion Fund không trực tiếp xuất hiện trong danh sách cổ đông công khai, nhưng liên quan đến Blue Star Tech, cổ phần ưu đãi, nhóm cố vấn đầu tư và một phần cổ đông nhỏ lẻ. Đây là chủ thể chi phối ẩn phía sau.",
  },
  {
    id: "fintech-independent",
    label: "Fintech X tự kiểm soát độc lập",
    isCorrect: false,
    explanation:
      "Fintech X không hoàn toàn độc lập vì các quyết định quan trọng về vốn, dữ liệu, thuật toán và đối tác cho vay đều bị ảnh hưởng bởi mạng lưới phía sau.",
  },
]