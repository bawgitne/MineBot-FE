# Socket Integration Guide

## Tích hợp Socket.IO với Server

### Cấu trúc dữ liệu từ Server

Server sẽ gửi dữ liệu qua event `'allbot'` với cấu trúc:

```javascript
socket.on('allbot', (botsArray) => {
  // botsArray là array các bot object
  [
    {
      id: "1",                    // String - ID của bot
      username: "bot1",           // String - Tên đăng nhập
      state: "MINING",            // String - Trạng thái hiện tại
      durability: 1450,           // Number | null - Độ bền tool (null nếu không có)
      blocksMinedToday: 150,      // Number - Số block đã đào hôm nay
      ping: 50,                   // Number | null - Ping hiện tại (null nếu chưa có)
      tps: 20,                    // Number | null - TPS server (null nếu chưa có)
      warpName: "mine1",          // String - Tên warp hiện tại
      logs: [                     // Array - Toàn bộ log history (MỚI)
        {
          msg: "Đã vào server",   // String - Nội dung log
          time: "2024-01-15T10:30:00.000Z"  // String - Thời gian ISO
        },
        {
          msg: "Đăng nhập thành công",
          time: "2024-01-15T10:30:05.000Z"
        },
        {
          msg: "Đã warp tới mine",
          time: "2024-01-15T10:30:10.000Z"
        },
        {
          msg: "Đang quá trình Mining&Repairing",
          time: "2024-01-15T10:30:15.000Z"
        }
        // ... tối đa 20 logs gần nhất
      ]
    }
  ]
});
```

### Các trạng thái State được hỗ trợ

- `"MINING"` → `"mining"`
- `"IDLE"` → `"idle"`
- `"REPAIRING"` → `"repairing"`
- `"ERROR"` → `"error"`
- `"DISCONNECTED"` → `"disconnected"`

### Cấu hình kết nối

1. **URL Server**: Mặc định kết nối tới `http://localhost:3001`
2. **Event**: Lắng nghe event `'allbot'`
3. **Auto-reconnect**: Socket.IO tự động reconnect khi mất kết nối

### Các file đã được cập nhật

1. **`src/lib/mockData.ts`**
   - Thêm interface `ServerBot` với trường `logs`
   - Thêm interface `ServerLogEntry` và `LogEntry`
   - Cập nhật interface `Bot` để hỗ trợ trường `logs`
   - Thêm hàm `convertServerBotToBot()` để chuyển đổi dữ liệu và logs
   - Thêm hàm `generateMockLogs()` để tạo logs mẫu

2. **`src/components/SocketListener.tsx`**
   - Lắng nghe event `'allbot'`
   - Chuyển đổi dữ liệu từ server sang Bot interface
   - Hiển thị trạng thái kết nối

3. **`src/pages/Index.tsx`**
   - Tích hợp SocketListener component
   - Hiển thị indicator kết nối
   - Xử lý cập nhật dữ liệu real-time

4. **`src/components/dashboard/BotCard.tsx`**
   - Xử lý hiển thị giá trị `null` cho durability, ping, tps
   - Hiển thị "N/A" khi không có dữ liệu

5. **`src/components/dashboard/BotHistoryModal.tsx`** (MỚI)
   - Thêm tabs để hiển thị "Server Logs" và "Activity History"
   - Hiển thị logs từ server với định dạng thời gian Việt Nam
   - Hiển thị số lượng logs trong tab header
   - Fallback message khi chưa có logs

### Tính năng mới - Server Logs

- **Tab "Server Logs"**: Hiển thị logs thực từ server với thời gian ISO
- **Tab "Activity History"**: Hiển thị activity history cũ (fallback)
- **Định dạng thời gian**: Sử dụng locale Việt Nam (dd/mm/yyyy hh:mm:ss)
- **Sắp xếp**: Logs được sắp xếp theo thời gian mới nhất trước
- **Responsive**: Modal rộng hơn để hiển thị tốt hơn

### Cách sử dụng

1. **Khởi động server** trên port 3001
2. **Khởi động frontend**: `npm run dev`
3. **Kiểm tra kết nối**: Indicator "Connected to Server" sẽ xuất hiện khi kết nối thành công
4. **Dữ liệu real-time**: Dashboard sẽ tự động cập nhật khi server gửi dữ liệu mới
5. **Xem logs**: Click vào nút "History" trên bot card để xem server logs

### Fallback Data

Khi chưa kết nối được server, ứng dụng sẽ hiển thị dữ liệu mock để demo giao diện, bao gồm cả logs mẫu.

### Troubleshooting

1. **Không kết nối được**: Kiểm tra server có chạy trên port 3001 không
2. **Dữ liệu không cập nhật**: Kiểm tra server có gửi event `'allbot'` không
3. **Lỗi TypeScript**: Đảm bảo đã cài đặt `socket.io-client` dependency
4. **Logs không hiển thị**: Kiểm tra server có gửi trường `logs` trong dữ liệu không 