# Mẫu Hệ thống

## Kiến trúc Hệ thống

- Ứng dụng web được xây dựng trên nền tảng Next.js với React.
- Sử dụng TypeScript để đảm bảo tính an toàn kiểu dữ liệu.
- Tích hợp Socket.IO để hỗ trợ nhắn tin thời gian thực.

## Quyết định Kỹ thuật Chính

- Sử dụng Next.js để hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG) nhằm tối ưu hóa hiệu suất.
- Tích hợp API thông qua các endpoint được định nghĩa trong thư mục `src/api/`.
- Quản lý trạng thái người dùng và xác thực thông qua Context API.

## Mẫu Thiết kế Đang Sử dụng

- **Component-based Architecture**: Các thành phần giao diện được tổ chức trong thư mục `src/app/components/`.
- **Hooks**: Sử dụng các custom hooks như `useQueryPage` và `useSocket` để quản lý logic.
- **Modular API**: Các hàm API được tổ chức theo chức năng (auth, message, post, user).

## Mối quan hệ giữa các Thành phần

- Thành phần `boxChat` chịu trách nhiệm hiển thị giao diện hộp thoại chính.
- Thành phần `formsend` xử lý việc gửi tin nhắn.
- Thành phần `SelectFriend` cho phép người dùng chọn bạn bè để nhắn tin.

## Đường dẫn Triển khai Quan trọng

- Đường dẫn chính cho trang nhắn tin: `src/app/message/page.tsx`.
- Xử lý đăng nhập và xác thực: `src/app/login/page.tsx`.
- Context xác thực được quản lý tại: `src/context/authContext.tsx`.
