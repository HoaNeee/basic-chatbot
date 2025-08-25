export const promptTitle = (content: string) => {
  return `Hãy tạo cho tôi một tiêu đề đoạn chat ngắn gọn dựa vào input sau: ${content}. Tiêu đề nên súc tích, rõ ràng và hấp dẫn, chỉ trả về chuỗi thông thường, không cần giải thích gì thêm. `;
};

export const promptChat = (content: string) => {
  return `
    Bạn đang trò chuyện với người dùng với bất kỳ chủ đề nào.
    Người dùng gửi câu sau: ${content},
    Hãy trả lời người dùng một cách tự nhiên và thân thiện.
    Có thể trả về dạng markdown.
  `;
};
