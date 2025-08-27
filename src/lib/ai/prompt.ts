import { WeatherResponse } from "@/types/Response.types";

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

export const promptIntent = (content: string) => {
  return `
    Nhiệm vụ của bạn là phân tích intent dựa vào input sau: ${content},
    Danh sách các intent có thể:
    - general (trò chuyện thông thường).
    - weather (dự báo thời tiết).

    Hãy chắc chắn rằng bạn đã kiểm tra kỹ lưỡng input trước khi đưa ra kết luận.
    Nếu intent xác định là "general": chỉ cần trả về intent "general" và không cần trường "location", "content".

    Nếu intent xác định là "weather": 
    - Hãy kiểm tra xem người dùng có gửi địa chỉ hay địa điểm cụ thể nào không, nếu người dùng không cung cấp địa điểm cụ thể  hãy trả về intent là "general" và trường "content" là một prompt yêu cầu người dùng cung cấp thêm thông tin địa điểm, ví dụ như: "Người dùng đang yêu cầu thông tin thời tiết hiện tại nhưng không cung cấp địa điểm cụ thể, hãy hỏi lại người dùng địa điểm cụ thể nhé?".
    
      Nếu có địa điểm cụ thể, hãy chỉ định địa điểm đó vào trường "location".

    Yêu cầu trả về dạng json sau, không cần giải thích gì thêm: 
    {
      "intent": "weather",
      "location": "Hà Nội" (nếu có),
      "content": câu trả lời của bạn yêu cầu người dùng cung cấp thêm thông tin (nếu có)
    }
  `;
};

export const promptWeather = (
  content: string,
  weatherData: WeatherResponse
) => {
  return `
    Bạn đang trò chuyện với người dùng về thời tiết.
    Người dùng gửi câu sau: ${content},
    Dữ liệu thời tiết: ${JSON.stringify(weatherData)},
    Hãy trả lời người dùng một cách ngắn gọn, tự nhiên và thân thiện.

    Yêu cầu trả về dạng JSON sau, không cần giải thích gì thêm:
    {
      intent: 'weather',
      content: 'Dữ liệu thời tiết cho Hà Nội hôm nay có thể bao gồm nhiệt độ, độ ẩm, và tình trạng thời tiết.',
      data_weather: {
       location: 'Hà Nội',
       data: ${JSON.stringify(weatherData)}
    }
  `;
};
