export type Stage4DecisionAnswer = "allow" | "conditional" | "reject"


export type Stage4DecisionOption = {
  value: Stage4DecisionAnswer
  label: string
  shortLabel: string
}


export type Stage4CompanyCase = {
  id: string
  companyName: string
  origin: string
  headline: string
  proposal: string
  chain: string[]
  potential: string[]
  risks: string[]
  correctAnswer: Stage4DecisionAnswer
  correctSummary: string
  explanation: string
  vietnamLesson: string
}


export const stage4DecisionOptions: Stage4DecisionOption[] = [
  {
    value: "allow",
    shortLabel: "A",
    label: "Cho phép hoàn toàn",
  },
  {
    value: "conditional",
    shortLabel: "B",
    label: "Cho phép có điều kiện",
  },
  {
    value: "reject",
    shortLabel: "C",
    label: "Từ chối",
  },
]


export const stage4CompanyCases: Stage4CompanyCase[] = [
  {
    id: "cu-xanh-academy",
    companyName: "Cú Xanh Academy",
    origin: "App học ngoại ngữ viral kiểu nhắc bài mỗi ngày",
    headline: "Muốn mở trung tâm AI học tập và ví học phí cho sinh viên Việt Nam.",
    proposal: "Đầu tư nền tảng giáo dục, học bổng và ví học phí liên kết ngân hàng nội địa.",
    chain: ["EdTech", "AI học tập", "Ví học phí", "Học bổng"],
    potential: [
      "Có vốn, công nghệ và học bổng cho sinh viên.",
      "Dữ liệu học tập cần được bảo vệ rõ ràng.",
    ],
    risks: [
      "Dữ liệu học sinh, sinh viên có thể bị khai thác thương mại.",
      "Có thể tạo phụ thuộc vào một nền tảng học tập nước ngoài.",
    ],
    correctAnswer: "conditional",
    correctSummary: "Cho phép có điều kiện.",
    explanation:
      "Dự án có lợi cho giáo dục và công nghệ, nhưng dữ liệu người học là tài sản nhạy cảm. Cần ràng buộc lưu trữ dữ liệu, minh bạch thuật toán và đối tác ngân hàng Việt Nam.",
    vietnamLesson:
      "Thu hút vốn phải đi cùng kiểm soát dữ liệu và chủ quyền số.",
  },
  {
    id: "deal-soc-mall",
    companyName: "Deal Sốc Mall",
    origin: "Sàn mua sắm viral kiểu deal 1K, flash sale cả ngày",
    headline: "Muốn mở kho xuyên biên giới, ví hoàn tiền và quỹ cho vay người bán.",
    proposal: "Đưa vốn vào logistics, thương mại điện tử và tài chính tiêu dùng cho shop nhỏ.",
    chain: ["Kho hàng", "Livestream", "Ví hoàn tiền", "Cho vay shop"],
    potential: [
      "Giúp hàng hóa rẻ hơn và shop nhỏ bán nhanh hơn.",
      "Có thể tăng cạnh tranh cho thương mại điện tử trong nước.",
    ],
    risks: [
      "Hàng giá rẻ có thể ép doanh nghiệp nội địa.",
      "Ví, dữ liệu mua sắm và cho vay có thể tạo quyền lực thị trường.",
    ],
    correctAnswer: "conditional",
    correctSummary: "Cho phép có điều kiện.",
    explanation:
      "Có thể nhận vốn và công nghệ logistics, nhưng phải kiểm soát chất lượng hàng hóa, thuế, dữ liệu người mua và chống bán phá giá.",
    vietnamLesson:
      "Mở cửa thị trường phải bảo vệ doanh nghiệp nội địa và người tiêu dùng.",
  },
  {
    id: "idolpay-live",
    companyName: "IdolPay Live",
    origin: "Nền tảng idol livestream, donate và trả góp siêu nhanh",
    headline: "Muốn mua ví điện tử, công ty cho vay và mạng lưới KOL tài chính.",
    proposal: "Kết hợp livestream, donate, trả góp, tín dụng tiêu dùng và quảng cáo tài chính.",
    chain: ["Idol stream", "Ví điện tử", "Trả góp", "KOL tài chính"],
    potential: [
      "Tạo hệ sinh thái thanh toán mới cho creator.",
      "Có thể hỗ trợ kinh tế sáng tạo nếu quản lý tốt.",
    ],
    risks: [
      "Dễ đẩy giới trẻ vào vay tiêu dùng cảm tính.",
      "KOL có thể biến tài chính thành trend thiếu kiểm chứng.",
    ],
    correctAnswer: "reject",
    correctSummary: "Từ chối hồ sơ hiện tại.",
    explanation:
      "Hồ sơ gom ví điện tử, cho vay và quyền lực KOL vào một hệ sinh thái quá rủi ro. Nếu muốn vào Việt Nam, họ phải tách mảng tín dụng, kiểm duyệt quảng cáo tài chính và xin lại giấy phép.",
    vietnamLesson:
      "Không đánh đổi an toàn tài chính của giới trẻ để lấy tăng trưởng viral.",
  },
]
