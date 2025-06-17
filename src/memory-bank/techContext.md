# Bối cảnh Kỹ thuật

## Công nghệ Được Sử dụng

- **Next.js**: Framework chính cho ứng dụng web, hỗ trợ SSR và SSG.
- **React**: Thư viện giao diện người dùng.
- **TypeScript**: Ngôn ngữ lập trình để đảm bảo an toàn kiểu dữ liệu.
- **Socket.IO**: Hỗ trợ nhắn tin thời gian thực.
- **Tailwind CSS**: Framework CSS để thiết kế giao diện.
- **Axios**: Thư viện để thực hiện các yêu cầu HTTP.

## Thiết lập Phát triển

- **Node.js**: Môi trường runtime cho JavaScript/TypeScript.
- **Yarn/NPM**: Quản lý gói phụ thuộc.
- **VSCode**: IDE chính để phát triển.
- Cấu hình dự án được định nghĩa trong `tsconfig.json`, `next.config.ts`, và `tailwind.config.ts`.

## Ràng buộc Kỹ thuật

- Ứng dụng phải tương thích với các trình duyệt hiện đại.
- Hiệu suất phải được tối ưu hóa cho các thiết bị có cấu hình thấp.
- Đảm bảo bảo mật cho các kết nối API và Socket.

## Phụ thuộc

- Các gói phụ thuộc chính được liệt kê trong `package.json`.
- Một số phụ thuộc quan trọng bao gồm `next`, `react`, `react-dom`, `socket.io-client`, và `axios`.

## Mẫu Sử dụng Công cụ

- Sử dụng `next.config.ts` để tùy chỉnh cấu hình Next.js.
- Sử dụng các custom hooks trong thư mục `src/hooks/` để quản lý logic phức tạp.
- Sử dụng Context API để quản lý trạng thái toàn cục như xác thực người dùng.
