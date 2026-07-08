export type Stage2AnswerOption = {
  id: string
  label: string
}

export type Stage2Case = {
  id: string
  caseNumber: number
  organizationName: string
  information: string[]
  options: Stage2AnswerOption[]
  correctAnswerId: string
  correctLabel: string
  explanation: string
}

export const stage2Cases: Stage2Case[] = [
  {
    id: "alpha-finance-group",
    caseNumber: 1,
    organizationName: "Alpha Finance Group",
    information: [
      "Một ngân hàng lớn nắm cổ phần trong nhiều công ty sản xuất thép, điện tử và vận tải.",
      "Các công ty vẫn giữ tên riêng, nhưng muốn mở rộng nhà máy phải phụ thuộc vào nguồn vốn từ ngân hàng.",
      "Khi ngân hàng thay đổi chính sách tín dụng, hoạt động sản xuất của nhiều doanh nghiệp bị ảnh hưởng.",
    ],
    options: [
      {
        id: "price-agreement",
        label: "Các doanh nghiệp cùng ngành bắt tay nhau để thống nhất giá bán.",
      },
      {
        id: "financial-capital-control",
        label:
          "Một tổ chức tài chính dùng vốn và cổ phần để chi phối hoạt động sản xuất.",
      },
      {
        id: "advertising-consumption",
        label: "Một doanh nghiệp dùng quảng cáo để thay đổi thói quen tiêu dùng.",
      },
      {
        id: "rare-resource-control",
        label:
          "Một công ty kiểm soát thị trường vì sở hữu nguồn nguyên liệu hiếm.",
      },
    ],
    correctAnswerId: "financial-capital-control",
    correctLabel:
      "Một tổ chức tài chính dùng vốn và cổ phần để chi phối hoạt động sản xuất.",
    explanation:
      "Hồ sơ này nói về tư bản tài chính theo lý luận của Lênin: tư bản ngân hàng kết hợp với tư bản công nghiệp. Ngân hàng không chỉ cho vay mà còn chi phối sản xuất thông qua vốn, cổ phần và tín dụng.",
  },
  {
    id: "global-investment-fund",
    caseNumber: 2,
    organizationName: "Global Investment Fund",
    information: [
      "Một quỹ đầu tư nắm cổ phần trong nhiều công ty thuộc các lĩnh vực công nghệ, ngân hàng, bán lẻ và vận tải.",
      "Quỹ không trực tiếp sản xuất hàng hóa, nhưng có thể tác động đến việc chọn lãnh đạo và chiến lược kinh doanh.",
      "Lợi nhuận chủ yếu đến từ cổ tức, trái phiếu, cổ phiếu và mua bán vốn.",
    ],
    options: [
      {
        id: "regional-market-division",
        label: "Một nhóm doanh nghiệp chia nhau khu vực bán hàng để tránh cạnh tranh.",
      },
      {
        id: "discount-consumer-attraction",
        label: "Một công ty giảm giá hàng hóa để thu hút người tiêu dùng.",
      },
      {
        id: "self-production-sale",
        label: "Một doanh nghiệp tự sản xuất và tự bán toàn bộ sản phẩm của mình.",
      },
      {
        id: "share-ownership-control",
        label:
          "Một tổ chức dùng quyền sở hữu cổ phần để tác động đến nhiều doanh nghiệp.",
      },
    ],
    correctAnswerId: "share-ownership-control",
    correctLabel:
      "Một tổ chức dùng quyền sở hữu cổ phần để tác động đến nhiều doanh nghiệp.",
    explanation:
      "Đây là biểu hiện hiện đại của sức mạnh tư bản tài chính. Quỹ đầu tư không cần trực tiếp sản xuất nhưng vẫn chi phối doanh nghiệp thông qua cổ phần, quyền biểu quyết và thị trường vốn.",
  },
  {
    id: "nova-securities-network",
    caseNumber: 3,
    organizationName: "Nova Securities Network",
    information: [
      "Một tập đoàn liên tục phát hành cổ phiếu và trái phiếu để huy động nguồn vốn lớn.",
      "Khi giá cổ phiếu tăng, tập đoàn dùng lợi thế đó để mua lại các công ty nhỏ hơn.",
      "Một nhóm nhà đầu tư lớn có thể gây áp lực buộc ban lãnh đạo thay đổi chiến lược.",
    ],
    options: [
      {
        id: "hire-workers-machines",
        label:
          "Doanh nghiệp tăng sản lượng bằng cách thuê thêm công nhân và mua thêm máy móc.",
      },
      {
        id: "media-celebrity-influence",
        label:
          "Doanh nghiệp tạo ảnh hưởng bằng phim ảnh, người nổi tiếng và nội dung giải trí.",
      },
      {
        id: "minimum-price-agreement",
        label:
          "Doanh nghiệp cùng ngành thỏa thuận không bán dưới một mức giá nhất định.",
      },
      {
        id: "stock-bond-voting-power",
        label:
          "Doanh nghiệp mở rộng quyền lực bằng công cụ cổ phiếu, trái phiếu và quyền biểu quyết.",
      },
    ],
    correctAnswerId: "stock-bond-voting-power",
    correctLabel:
      "Doanh nghiệp mở rộng quyền lực bằng công cụ cổ phiếu, trái phiếu và quyền biểu quyết.",
    explanation:
      "Hồ sơ này liên quan đến sự chi phối thông qua thị trường chứng khoán. Cổ phiếu, trái phiếu và quyền biểu quyết giúp các nhóm tư bản lớn huy động vốn, thâu tóm doanh nghiệp và kiểm soát chiến lược kinh tế.",
  },
  {
    id: "finpay-digital-platform",
    caseNumber: 4,
    organizationName: "FinPay Digital Platform",
    information: [
      "Một nền tảng thanh toán số cung cấp ví điện tử, cho vay tiêu dùng và điểm tín dụng.",
      "Nền tảng lưu giữ dữ liệu giao dịch, lịch sử mua sắm và khả năng vay nợ của người dùng.",
      "Doanh nghiệp nhỏ phải tham gia nền tảng nếu muốn tiếp cận nhiều khách hàng.",
    ],
    options: [
      {
        id: "transaction-data-control",
        label:
          "Doanh nghiệp kiểm soát người dùng và doanh nghiệp nhỏ thông qua dữ liệu giao dịch.",
      },
      {
        id: "raw-material-control",
        label:
          "Doanh nghiệp thâu tóm thị trường bằng cách sở hữu mỏ nguyên liệu quan trọng.",
      },
      {
        id: "price-cartel",
        label:
          "Doanh nghiệp cùng ngành thống nhất giá bán để loại bỏ cạnh tranh.",
      },
      {
        id: "traditional-factory-expansion",
        label:
          "Doanh nghiệp mở rộng sản xuất bằng cách xây thêm nhà máy truyền thống.",
      },
    ],
    correctAnswerId: "transaction-data-control",
    correctLabel:
      "Doanh nghiệp kiểm soát người dùng và doanh nghiệp nhỏ thông qua dữ liệu giao dịch.",
    explanation:
      "Hồ sơ này thể hiện hình thức chi phối mới trong nền kinh tế số. Khi nền tảng nắm dữ liệu tài chính, hành vi tiêu dùng và kênh thanh toán, nó có thể tạo sự phụ thuộc cho cả người dùng lẫn doanh nghiệp nhỏ.",
  },
  {
    id: "softpower-media-corp",
    caseNumber: 5,
    organizationName: "SoftPower Media Corp",
    information: [
      "Một tập đoàn sở hữu nền tảng video ngắn, quảng cáo, giải trí và thương mại điện tử.",
      "Thuật toán liên tục đề xuất sản phẩm, xu hướng thời trang, ăn uống và lối sống.",
      "Người dùng không bị ép mua hàng, nhưng hành vi tiêu dùng bị dẫn dắt bởi nội dung, hình ảnh và người nổi tiếng.",
    ],
    options: [
      {
        id: "bank-loan-production-control",
        label: "Doanh nghiệp chi phối sản xuất bằng vốn vay ngân hàng.",
      },
      {
        id: "price-agreement-competitors",
        label:
          "Doanh nghiệp kiểm soát giá cả bằng cách thỏa thuận với đối thủ cạnh tranh.",
      },
      {
        id: "media-algorithm-consumption",
        label:
          "Doanh nghiệp tác động đến lựa chọn tiêu dùng thông qua truyền thông và thuật toán.",
      },
      {
        id: "material-overtime-expansion",
        label:
          "Doanh nghiệp mở rộng bằng cách mua thêm nguyên liệu và tăng ca sản xuất.",
      },
    ],
    correctAnswerId: "media-algorithm-consumption",
    correctLabel:
      "Doanh nghiệp tác động đến lựa chọn tiêu dùng thông qua truyền thông và thuật toán.",
    explanation:
      "Đây là biểu hiện của quyền lực mềm của độc quyền. Tổ chức không ép buộc trực tiếp, nhưng thông qua truyền thông, thuật toán, quảng cáo, hình ảnh và xu hướng để định hướng hành vi tiêu dùng.",
  },
]