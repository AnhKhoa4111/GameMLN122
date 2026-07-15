export type Stage1TimelineItem = {
  id: string
  title: string
  description: string
  correctOrder: number
}

export const stage1TimelineItems: Stage1TimelineItem[] = [
  {
    id: "production-concentration",
    title: "Tích tụ và tập trung sản xuất",
    description:
      "Sản xuất ngày càng tập trung vào một số doanh nghiệp lớn, tạo nền tảng cho độc quyền.",
    correctOrder: 1,
  },
  {
    id: "industrial-monopoly",
    title: "Hình thành độc quyền công nghiệp",
    description:
      "Các doanh nghiệp lớn liên kết hoặc chi phối thị trường trong những ngành quan trọng.",
    correctOrder: 2,
  },
  {
    id: "bank-capital-concentration",
    title: "Tích tụ và tập trung tư bản ngân hàng",
    description:
      "Vốn tiền tệ tập trung vào các ngân hàng lớn, làm tăng quyền lực của hệ thống tài chính.",
    correctOrder: 3,
  },
  {
    id: "bank-monopoly",
    title: "Hình thành độc quyền ngân hàng",
    description:
      "Một số ngân hàng lớn nắm vai trò chi phối tín dụng, vốn và hoạt động đầu tư.",
    correctOrder: 4,
  },
  {
    id: "capital-merger",
    title: "Tư bản ngân hàng dung hợp với tư bản công nghiệp độc quyền",
    description:
      "Ngân hàng và doanh nghiệp công nghiệp liên kết chặt chẽ thông qua sở hữu, đầu tư và kiểm soát vốn.",
    correctOrder: 5,
  },
  {
    id: "financial-capital",
    title: "Hình thành tư bản tài chính",
    description:
      "Sự kết hợp giữa tư bản ngân hàng và tư bản công nghiệp, tạo ra quyền lực chi phối nền kinh tế.",
    correctOrder: 6,
  },
]