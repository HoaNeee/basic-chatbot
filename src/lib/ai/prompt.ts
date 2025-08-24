export const promptTitle = (content: string) => {
  return `Hãy tạo cho tôi một tiêu đề đoạn chat dựa vào input sau: ${content}, không cần giải thích gì thêm`;
};

export const promptChat = (content: string) => {
  return `
    Bạn đang trò chuyện với người dùng với bất kỳ chủ đề nào.
    Người dùng gửi câu sau: ${content},
    Hãy trả lời người dùng một cách tự nhiên và thân thiện.
    Có thể trả về dạng markdown.
  `;
};
