# 🔗 URL นโยบายความเป็นส่วนตัว (สำหรับ Play Store)

Play Store ต้องการ **URL สาธารณะ** ของนโยบายความเป็นส่วนตัว — หน้าจอในแอปใช้แทนไม่ได้

## ✅ URL ที่ต้องใช้

```
https://keeeeep.sky168.info/privacy-policy.html
```

ใส่ใน Play Console → **Policy → App content → Privacy policy**

หน้านี้ถูกเสิร์ฟจากเว็บเดียวกับตัวแอป (Easypanel + Nginx, build จาก branch `main`)
โดยไฟล์อยู่ที่ `public/privacy-policy.html`

- `npx expo export --platform web` จะคัดลอกทุกอย่างในโฟลเดอร์ `public/` ไปไว้ที่ root ของเว็บ
- `Dockerfile` ยัง `COPY` ไฟล์นี้เข้า web root ซ้ำอีกชั้น เพื่อกันพลาดถ้าขั้นตอน export เปลี่ยนไป

> ต้อง merge เข้า `main` แล้ว deploy ใหม่ใน Easypanel ก่อน URL ถึงจะใช้งานได้

## สำรอง: GitHub Pages

`docs/index.html` เป็นหน้า redirect ไปยัง URL ด้านบน หากเปิด GitHub Pages
(Settings → Pages → branch `main`, โฟลเดอร์ `/docs`) จะได้อีก URL คือ
`https://endlessedwork.github.io/keeeeep-new/` ซึ่งจะเด้งไปหน้าเดียวกัน
ไม่จำเป็นต้องเปิดก็ได้ ถ้าใช้โดเมนหลักอยู่แล้ว

## เวลาแก้เนื้อหานโยบาย

แก้ให้ตรงกันทั้ง 3 ที่ เพื่อไม่ให้ข้อมูลขัดกัน

1. `public/privacy-policy.html` — หน้าเว็บ (URL ที่ Play Store ใช้)
2. `src/screens/PrivacyPolicyScreen.tsx` — หน้าในแอป
3. `PRIVACY_POLICY.md` — เอกสารในโปรเจกต์

commit + push ขึ้น `main` แล้ว deploy ใหม่

## ❓ ถ้าเปิด URL แล้วไม่เจอ

- **404** → ยังไม่ได้ deploy รอบใหม่หลัง merge หรือ build ล้ม ลองดู log ใน Easypanel
- **เห็นหน้าแอปแทน** → nginx fallback ทำงาน แปลว่าไฟล์ยังไม่อยู่ใน web root ให้ตรวจว่า `Dockerfile` มีบรรทัด `COPY public/privacy-policy.html`
- **หน้าเก่าค้าง** → cache เบราว์เซอร์ ลอง hard refresh (Ctrl/Cmd + Shift + R)
