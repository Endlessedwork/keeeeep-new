import React from "react";
import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedScreen from "../components/ThemedScreen";
import ThemedHeader from "../components/ThemedHeader";
import ThemedCard from "../components/ThemedCard";
import { theme } from "../theme/colors";

const LAST_UPDATED = "20 สิงหาคม 2025";
const CONTACT_EMAIL = "endlessedwork@gmail.com";

interface SectionProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <ThemedCard style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.surfaceStrong,
            marginRight: 10,
          }}
        >
          <Ionicons name={icon} size={17} color="#FFFFFF" />
        </View>
        <Text style={{ color: theme.textPrimary, fontSize: 17, fontWeight: "700", flex: 1 }}>
          {title}
        </Text>
      </View>
      {children}
    </ThemedCard>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 23, marginBottom: 8 }}>
      {children}
    </Text>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 6, paddingRight: 4 }}>
      <Text style={{ color: theme.textMuted, fontSize: 15, lineHeight: 23, marginRight: 8 }}>•</Text>
      <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 23, flex: 1 }}>
        {children}
      </Text>
    </View>
  );
}

export default function PrivacyPolicyScreen({ navigation }: any) {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ThemedScreen>
      <ThemedHeader title="นโยบายความเป็นส่วนตัว" onBack={() => navigation.goBack()} />

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Intro */}
        <ThemedCard style={{ marginBottom: 12 }}>
          <Text style={{ color: theme.textPrimary, fontSize: 20, fontWeight: "800", marginBottom: 6 }}>
            นโยบายความเป็นส่วนตัวของ Keeeeep
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 10 }}>
            อัปเดตล่าสุด: {LAST_UPDATED}
          </Text>
          <Paragraph>
            Keeeeep ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของคุณ
            นโยบายฉบับนี้อธิบายว่าเราเก็บรวบรวม ใช้ และปกป้องข้อมูลของคุณอย่างไร
            เมื่อคุณใช้งานแอปพลิเคชัน Keeeeep
          </Paragraph>
        </ThemedCard>

        {/* Data we collect */}
        <Section icon="document-text-outline" title="ข้อมูลที่เราเก็บรวบรวม">
          <Paragraph>ข้อมูลที่คุณให้กับเราโดยตรง</Paragraph>
          <Bullet>ข้อมูลบัญชี: อีเมล ชื่อที่แสดง และรหัสผ่าน (จัดการผ่าน Firebase Authentication)</Bullet>
          <Bullet>ข้อมูล Bookmark: URL ชื่อเรื่อง คำอธิบาย แท็ก และหมวดหมู่ที่คุณบันทึก</Bullet>
          <Bullet>เนื้อหาที่คุณสร้าง: บันทึกย่อและคำอธิบายที่คุณเพิ่มเข้าไปในแต่ละรายการ</Bullet>

          <View style={{ height: 6 }} />
          <Paragraph>ข้อมูลที่ระบบเก็บโดยอัตโนมัติ</Paragraph>
          <Bullet>Metadata ของเว็บไซต์: เมื่อคุณบันทึก URL เราจะดึงข้อมูลสาธารณะ เช่น ชื่อเรื่อง คำอธิบาย และรูปภาพ จากหน้าเว็บนั้น</Bullet>
          <Bullet>บทสรุปที่สร้างโดย AI: เนื้อหาสรุปภาษาไทยที่ระบบสร้างขึ้นจากหน้าเว็บที่คุณบันทึก</Bullet>
        </Section>

        {/* How we use */}
        <Section icon="construct-outline" title="เราใช้ข้อมูลของคุณอย่างไร">
          <Bullet>ให้บริการและดูแลรักษาการทำงานของแอป Keeeeep</Bullet>
          <Bullet>สร้างบทสรุปเนื้อหาของเว็บไซต์ที่คุณบันทึกด้วย AI</Bullet>
          <Bullet>จัดระเบียบ bookmark ตามหมวดหมู่และแท็กของคุณ</Bullet>
          <Bullet>ซิงก์ข้อมูลของคุณระหว่างอุปกรณ์ที่ล็อกอินด้วยบัญชีเดียวกัน</Bullet>
          <Bullet>ปรับปรุงประสบการณ์การใช้งานให้ดียิ่งขึ้น</Bullet>
          <Paragraph>เราไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของคุณแก่บุคคลที่สาม</Paragraph>
        </Section>

        {/* Storage */}
        <Section icon="cloud-outline" title="การจัดเก็บข้อมูล">
          <Paragraph>
            ข้อมูลบัญชีและ bookmark ของคุณถูกจัดเก็บบน Google Cloud Firestore
            และยืนยันตัวตนผ่าน Firebase Authentication
            โดยข้อมูลจะผูกกับบัญชีผู้ใช้ของคุณและเข้าถึงได้เฉพาะบัญชีนั้น
          </Paragraph>
          <Paragraph>
            แอปยังเก็บข้อมูลบางส่วนไว้บนเครื่องของคุณ เช่น สถานะการเข้าสู่ระบบและการตั้งค่า
            เพื่อให้ใช้งานได้รวดเร็วขึ้น
          </Paragraph>
        </Section>

        {/* Third parties */}
        <Section icon="link-outline" title="บริการของบุคคลที่สาม">
          <Bullet>Firebase (Google): ระบบยืนยันตัวตนและฐานข้อมูลสำหรับจัดเก็บ bookmark</Bullet>
          <Bullet>OpenAI: ใช้สำหรับสร้างบทสรุปเนื้อหา โดยจะส่ง URL และเนื้อหาสาธารณะของหน้าเว็บไปประมวลผล</Bullet>
          <Paragraph>คุณสามารถอ่านนโยบายความเป็นส่วนตัวของผู้ให้บริการเหล่านี้ได้ที่</Paragraph>
          <Pressable onPress={() => handleOpenLink("https://policies.google.com/privacy")}>
            <Text style={{ color: "#93C5FD", fontSize: 15, lineHeight: 23 }}>
              • นโยบายความเป็นส่วนตัวของ Google
            </Text>
          </Pressable>
          <Pressable onPress={() => handleOpenLink("https://openai.com/policies/privacy-policy")}>
            <Text style={{ color: "#93C5FD", fontSize: 15, lineHeight: 23 }}>
              • นโยบายความเป็นส่วนตัวของ OpenAI
            </Text>
          </Pressable>
        </Section>

        {/* Security */}
        <Section icon="shield-checkmark-outline" title="ความปลอดภัยของข้อมูล">
          <Bullet>รหัสผ่านถูกจัดการโดย Firebase Authentication และเราไม่สามารถเข้าถึงรหัสผ่านของคุณได้</Bullet>
          <Bullet>การรับส่งข้อมูลระหว่างแอปกับเซิร์ฟเวอร์เข้ารหัสด้วย HTTPS</Bullet>
          <Bullet>กฎความปลอดภัยของ Firestore จำกัดให้เข้าถึงข้อมูลได้เฉพาะเจ้าของบัญชีเท่านั้น</Bullet>
          <Paragraph>
            อย่างไรก็ตาม ไม่มีระบบใดปลอดภัย 100%
            เราจึงแนะนำให้คุณตั้งรหัสผ่านที่คาดเดายากและไม่ใช้ซ้ำกับบริการอื่น
          </Paragraph>
        </Section>

        {/* Rights */}
        <Section icon="person-outline" title="สิทธิของคุณ">
          <Bullet>เข้าถึงและดูข้อมูลทั้งหมดที่คุณบันทึกไว้ในแอป</Bullet>
          <Bullet>แก้ไขหรือลบ bookmark และหมวดหมู่ได้ตลอดเวลา</Bullet>
          <Bullet>เปลี่ยนรหัสผ่านได้จากหน้าตั้งค่า</Bullet>
          <Bullet>ขอลบบัญชีและข้อมูลทั้งหมดได้ โดยติดต่อเราทางอีเมล</Bullet>
        </Section>

        {/* Deletion */}
        <Section icon="trash-outline" title="การลบข้อมูล">
          <Bullet>ลบ bookmark หรือหมวดหมู่ทีละรายการได้จากภายในแอป</Bullet>
          <Bullet>
            หากต้องการลบบัญชีและข้อมูลทั้งหมดอย่างถาวร กรุณาส่งอีเมลมาที่ {CONTACT_EMAIL}
            โดยระบุอีเมลที่ใช้สมัคร เราจะดำเนินการภายใน 30 วัน
          </Bullet>
        </Section>

        {/* Children */}
        <Section icon="people-outline" title="ความเป็นส่วนตัวของเด็ก">
          <Paragraph>
            Keeeeep ไม่ได้ออกแบบมาสำหรับผู้ใช้ที่มีอายุต่ำกว่า 13 ปี
            และเราไม่มีเจตนาเก็บรวบรวมข้อมูลจากเด็กอายุต่ำกว่า 13 ปี
            หากพบว่ามีการเก็บข้อมูลดังกล่าว เราจะลบออกทันที
          </Paragraph>
        </Section>

        {/* Changes */}
        <Section icon="refresh-outline" title="การเปลี่ยนแปลงนโยบาย">
          <Paragraph>
            เราอาจปรับปรุงนโยบายฉบับนี้เป็นครั้งคราว
            หากมีการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งให้ทราบผ่านแอปและอัปเดตวันที่ด้านบน
            การใช้งานแอปต่อไปถือว่าคุณยอมรับนโยบายฉบับที่ปรับปรุงแล้ว
          </Paragraph>
        </Section>

        {/* Contact */}
        <Section icon="mail-outline" title="ติดต่อเรา">
          <Paragraph>หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้ ติดต่อเราได้ที่</Paragraph>
          <Pressable
            onPress={handleEmailPress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.surfaceStrong,
              borderRadius: theme.radiusControl,
              paddingVertical: 12,
              paddingHorizontal: 14,
            }}
          >
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            <Text style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "600", marginLeft: 10 }}>
              {CONTACT_EMAIL}
            </Text>
          </Pressable>
        </Section>

        <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", marginTop: 8 }}>
          © 2025 Keeeeep by Endlessedwork. All rights reserved.
        </Text>
      </ScrollView>
    </ThemedScreen>
  );
}
