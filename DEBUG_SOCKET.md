# Debug Socket.IO Connection

## 🔍 Vấn đề: Server gửi `emit hello` nhưng client không nhận được

### Các bước debug:

#### 1. **Kiểm tra Server**
```javascript
// Trên server, đảm bảo có code này:
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Gửi hello ngay khi client kết nối
  socket.emit('hello', { message: 'Hello from server!', timestamp: new Date() });
  
  // Hoặc gửi hello định kỳ
  setInterval(() => {
    socket.emit('hello', { message: 'Hello from server!', timestamp: new Date() });
  }, 5000);
});
```

#### 2. **Sử dụng file test**
- Mở file `socket-test.html` trong browser
- Kiểm tra console và logs để xem có nhận được event không

#### 3. **Kiểm tra Console Browser**
- Mở Developer Tools (F12)
- Xem tab Console để kiểm tra logs:
  ```
  ✅ Socket connected successfully!
  🎉 Received hello event from server: {message: "Hello from server!", timestamp: "..."}
  ```

#### 4. **Kiểm tra Network Tab**
- Trong Developer Tools, xem tab Network
- Tìm WebSocket connection hoặc Socket.IO requests
- Kiểm tra có lỗi CORS không

#### 5. **Các lỗi thường gặp:**

##### **Lỗi CORS:**
```
Access to XMLHttpRequest at 'http://localhost:3001/socket.io/' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Giải pháp:** Thêm CORS config trên server:
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:5173", // URL của frontend
    methods: ["GET", "POST"]
  }
});
```

##### **Lỗi Connection Refused:**
```
Connection error: xhr poll error
```

**Giải pháp:** 
- Kiểm tra server có chạy trên port 3001 không
- Kiểm tra firewall
- Thử đổi port

##### **Lỗi Transport:**
```
Transport closed
```

**Giải pháp:** Thử cả websocket và polling:
```javascript
const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});
```

#### 6. **Test với curl:**
```bash
# Test server có chạy không
curl http://localhost:3001

# Test Socket.IO endpoint
curl http://localhost:3001/socket.io/
```

#### 7. **Debug trên React App:**
- Mở React app
- Mở Developer Tools
- Xem console logs:
  ```
  SocketListener: Initializing socket connection...
  ✅ Socket connected successfully!
  Socket ID: abc123
  🎉 Received hello event from server: {...}
  ```

#### 8. **Kiểm tra Server Logs:**
Trên server, đảm bảo có logs:
```
Client connected: abc123
Emitting hello to client: abc123
```

### 🔧 Các cài đặt đã được thêm:

#### **SocketListener.tsx:**
- ✅ Thêm debug logs chi tiết
- ✅ Lắng nghe tất cả events với `socket.onAny()`
- ✅ Hiển thị connection status
- ✅ Xử lý lỗi kết nối

#### **Index.tsx:**
- ✅ Hiển thị connection status trên UI
- ✅ Debug info với server URL và status

#### **socket-test.html:**
- ✅ File test độc lập để debug
- ✅ Hiển thị tất cả events
- ✅ Auto-connect và manual controls

### 📋 Checklist Debug:

- [ ] Server chạy trên port 3001
- [ ] Server có CORS config cho frontend
- [ ] Server emit event 'hello'
- [ ] Client kết nối thành công
- [ ] Client lắng nghe event 'hello'
- [ ] Không có lỗi CORS
- [ ] Không có lỗi transport
- [ ] Console hiển thị logs đúng

### 🚀 Cách test:

1. **Khởi động server** trên port 3001
2. **Mở socket-test.html** trong browser
3. **Kiểm tra logs** xem có nhận được 'hello' không
4. **Nếu test.html hoạt động**, kiểm tra React app
5. **Nếu test.html không hoạt động**, debug server trước

### 📞 Hỗ trợ:

Nếu vẫn không hoạt động, hãy cung cấp:
- Server logs
- Browser console logs
- Network tab screenshots
- Server code snippet 