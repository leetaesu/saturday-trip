import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages 주소가 https://<아이디>.github.io/saturday-trip/ 이므로 base를 저장소 이름에 맞춘다.
// 저장소 이름을 바꾸면 이 값도 같이 바꿔야 한다.
export default defineConfig({
  base: '/saturday-trip/',
  plugins: [react(), tailwindcss()],
});
