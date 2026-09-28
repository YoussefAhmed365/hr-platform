# الدليل الشامل لـ Better-Auth مع NestJS و Prisma 🚀

هذا الدليل يشرح بالتفصيل المعماري والعملي كيفية عمل **Better-Auth** داخل مشروع **NestJS 11** باستخدام **Prisma ORM**، وكيف تتكامل كل الأجزاء معاً لتأمين وإدارة المستخدمين والبيانات.

---

## الفهرس
1. [ما هو Better-Auth وكيف يعمل؟](#1-ما-هو-better-auth-وكيف-يعمل)
2. [المعمارية داخل المشروع (Architecture & Flow)](#2-المعمارية-داخل-المشروع-architecture--flow)
3. [الـ Endpoints: هل هي جاهزة أم نقوم ببرمجتها؟](#3-الـ-endpoints-هل-هي-جاهزة-أم-نقوم-ببرمجتها)
4. [قائمة الـ Endpoints الجاهزة وكيفية استدعائها (cURL & Fetch)](#4-قائمة-الـ-endpoints-الجاهزة-وكيفية-استدعائها)
5. [كيفية التسجيل وتسجيل الدخول بـ Email & Password](#5-كيفية-التسجيل-وتسجيل-الدخول-بـ-email--password)
6. [تخصيص البيانات والحقول (Custom Fields & Additional Fields)](#6-تخصيص-البيانات-والحقول-custom-fields--additional-fields)
7. [قاعدة البيانات (Prisma): الجداول، الحفظ، والجلب](#7-قاعدة-البيانات-prisma-الجداول-الحفظ-والجلب)
8. [حماية الـ Endpoints في NestJS (@Session و @AllowAnonymous)](#8-حماية-الـ-endpoints-في-nestjs-session-و-allowanonymous)
9. [مثال عملي متكامل (Feature Module: Posts / Employees)](#9-مثال-عملي-متكامل-feature-module)
10. [أهم الأوامر وخطوات العمل اليومية](#10-أهم-الأوامر-وخطوات-العمل-اليومية)

---

## 1. ما هو Better-Auth وكيف يعمل؟

**Better-Auth** هو إطار عمل حديث ومتكامل للمصادقة (Authentication Framework) مبني لبيئات TypeScript و Node.js الحديثة. يتميز عن المكتبات التقليدية (مثل Passport.js أو NextAuth) بالآتي:

1. **إدارة متكاملة للجلسات وقواعد البيانات**: لا يكتفي بالتحقق من الرموز (Tokens)، بل يدير جداول المستخدمين، الجلسات، الحسابات، ورموز التحقق بنفسه عبر Database Adapter (مثل Prisma).
2. **Session-based مع دعم الـ Tokens**: يعتمد على جلسات مشفرة مخزنة في قاعدة البيانات وتُرسل للعميل عبر `HttpOnly Cookies` آمنة أو عبر `Bearer Token`، مما يحميك تلقائياً من هجمات XSS و CSRF.
3. **أمان قياسي افتراضياً**: تشفير كلمات المرور تلقائياً باستخدام خوارزميات حديثة وآمنة (`scrypt`)، حماية ضد الـ Session Hijacking والـ Token Rotation.
4. **قابلة للتوسيع (Modular & Extensible)**: يدعم Plugins لإضافة الـ 2FA، Multi-tenancy / Organizations، OAuth (Google, GitHub)، وأي حقول مخصصة بسهولة.

---

## 2. المعمارية داخل المشروع (Architecture & Flow)

في مشروعنا الحالي، يتكامل Better-Auth مع NestJS عبر ثلاث طبقات رئيسية:

```mermaid
flowchart TD
    Client[العميل: المتصفح / تطبيق الموبايل / Postman]
    
    subgraph NestJS_App ["تطبيق NestJS (Port 3000)"]
        Arcjet["Arcjet Guard (Rate Limit & Shield)"]
        
        subgraph Routing ["توجيه الطلبات"]
            AuthRouter["مسارات المصادقة الجاهزة\n/api/auth/*"]
            AppControllers["Controllers التطبيق الخاصة بنا\n/posts, /employees, etc."]
        end
        
        BetterAuthEngine["محرك Better-Auth (auth.ts)"]
        AuthGuard["Better Auth Global Guard\n(يفحص الـ Session)"]
        PrismaService["Prisma Service (src/lib/database)"]
    end
    
    subgraph Database ["قاعدة بيانات PostgreSQL (Prisma Postgres)"]
        UserTable[("User")]
        SessionTable[("Session")]
        AccountTable[("Account (Passwords)")]
        VerificationTable[("Verification")]
        AppTables[("جداول التطبيق (Posts, etc.)")]
    end

    Client -->|1. HTTP Request| Arcjet
    Arcjet -->|2. طلب مسموح به| Routing
    
    AuthRouter -->|طلب مصادقة تلقائي| BetterAuthEngine
    BetterAuthEngine -->|تخزين/مطابقة بيانات| Database
    
    AppControllers -->|محمي بواسطة| AuthGuard
    AuthGuard -->|التحقق من الجلسة| BetterAuthEngine
    AppControllers -->|عمليات التطبيق CRUD| PrismaService
    PrismaService -->|قراءة وكتابة| Database
```

### كيف تم ربطها في الكود؟

1. **`src/main.ts`**:
   قُمنا بتعطيل `bodyParser` الافتراضي لـ NestJS (`bodyParser: false`) لأن Better-Auth يتعامل مع تدفق البيانات (Streams) والـ Raw Request بنفسه لضمان الأمان والتعامل مع Webhooks و CSRF.
2. **`src/lib/auth/auth.ts`**:
   ملف إعداد كائن `auth` الأساسي بواسطة `betterAuth(...)`. هنا نقوم بتحديد الـ Database Adapter (Prisma)، تفعيل الـ Email & Password، وإضافة أي حقول مخصصة مثل الـ `role`.
3. **`src/lib/auth/auth.module.ts`**:
   تغليف `BetterAuthModule.forRoot({ auth })` من مكتبة `@thallesp/nestjs-better-auth` وجعله `@Global()`. هذا الموديول يقوم تلقائياً بـ:
   - تسجيل Middleware يلتقط كل الـ requests القادمة إلى البادئة `/api/auth/*` وتمريرها لمحرك Better-Auth.
   - تفعيل `AuthGuard` عام يحمي كل مسارات التطبيق افتراضياً.

---

## 3. الـ Endpoints: هل هي جاهزة أم نقوم ببرمجتها؟

> [!IMPORTANT]
> **الـ Endpoints الخاصة بالمصادقة جاهزة 100% ولا تحتاج لكتابة أي Controller لها!**

بمجرد استيراد `BetterAuthModule`، يقوم النظام تلقائياً بإنشاء Handler يلتقط أي طلب يبدأ بـ:
```
http://localhost:3000/api/auth/*
```

لست بحاجة لإنشاء `@Controller('auth')` أو كتابة `@Post('sign-up')` أو `@Post('login')`. محرك Better-Auth يقوم بمعالجة:
- استلام البيانات وفحص صحتها (Validation).
- تشفير كلمات المرور ومطابقتها.
- إنشاء وحذف وتحديث السجلات في جداول قاعدة البيانات.
- إنشاء الـ Session وإرجاع الـ Cookies والـ Tokens للعميل.

### متى تقوم أنت بإنشاء Endpoints؟
أنت تقوم بإنشاء الـ Endpoints الخاصة بمنطق التطبيق الخاص بك (Business Logic) مثل:
- إدارة الموظفين (`/employees`)
- إدارة المهام أو المنشورات (`/posts`)
- لوحة التحكم (`/dashboard`)
وتقوم داخلها بقراءة المستخدم الحالي عبر الـ Decorator `@Session()`.

---

## 4. قائمة الـ Endpoints الجاهزة وكيفية استدعائها

جميع هذه المسارات تبدأ بـ `/api/auth`:

| Method | المسار | الوظيفة |
|---|---|---|
| `POST` | `/api/auth/sign-up/email` | إنشاء حساب جديد بواسطة البريد وكلمة المرور |
| `POST` | `/api/auth/sign-in/email` | تسجيل الدخول بواسطة البريد وكلمة المرور |
| `POST` | `/api/auth/sign-out` | تسجيل الخروج وإبطال الجلسة وحذف الكوكيز |
| `GET`  | `/api/auth/get-session` | جلب بيانات المستخدم وجلسته الحالية من الكوكيز أو التوكن |
| `POST` | `/api/auth/change-password` | تغيير كلمة المرور للمستخدم المسجل دخوله |
| `POST` | `/api/auth/forget-password` | طلب استعادة كلمة المرور (يرسل رمز أو رابط) |
| `POST` | `/api/auth/reset-password` | تعيين كلمة مرور جديدة باستخدام الرمز |
| `POST` | `/api/auth/update-user` | تحديث اسم المستخدم أو صورته الشخصية |

---

## 5. كيفية التسجيل وتسجيل الدخول بـ Email & Password

### أولاً: تسجيل حساب جديد (Sign Up)

#### 1. عن طريق cURL في الطرفية:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Password123!",
    "name": "Ahmed Mohamed"
  }' \
  -c cookies.txt -v
```

#### 2. الرد العائد (Response):
- **Headers**: سيحتوي على `Set-Cookie: better-auth.session_token=...; HttpOnly; Path=/; SameSite=Lax`
- **Body (JSON)**:
```json
{
  "token": "d7a1b...session_token...",
  "user": {
    "id": "cm7...unique_id...",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "emailVerified": false,
    "role": "PARTICIPANT",
    "createdAt": "2026-09-22T08:00:00.000Z",
    "updatedAt": "2026-09-22T08:00:00.000Z"
  }
}
```

---

### ثانياً: تسجيل الدخول (Sign In)

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed@example.com",
    "password": "Password123!"
  }' \
  -c cookies.txt -v
```

---

### ثالثاً: فحص الجلسة الحالية (Get Session)

يمكن فحص الجلسة إما بواسطة **الكوكيز (Cookies)** أو بواسطة **Bearer Token**:

#### أ) باستخدام الكوكيز (للمتصفحات):
```bash
curl -X GET http://localhost:3000/api/auth/get-session \
  -b cookies.txt
```

#### ب) باستخدام Bearer Token (لتطبيقات الموبايل أو Postman):
```bash
curl -X GET http://localhost:3000/api/auth/get-session \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN_HERE"
```

الرد:
```json
{
  "session": {
    "id": "cm7...",
    "userId": "cm7...",
    "token": "...",
    "expiresAt": "2026-09-29T08:00:00.000Z"
  },
  "user": {
    "id": "cm7...",
    "name": "Ahmed Mohamed",
    "email": "ahmed@example.com",
    "role": "PARTICIPANT"
  }
}
```

---

### رابعاً: في تطبيقات الواجهة الأمامية (Frontend)

يمكنك استدعاء الـ API ببساطة عبر `fetch` أو باستخدام مكتبة العميل الرسمية `better-auth/client`:

```typescript
// إذا كنت تستخدم createAuthClient من better-auth/client:
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000" // عنوان سيرفر NestJS
});

// 1. تسجيل مستخدم جديد
await authClient.signUp.email({
    email: "user@example.com",
    password: "Password123!",
    name: "User Name"
});

// 2. تسجيل الدخول
await authClient.signIn.email({
    email: "user@example.com",
    password: "Password123!"
});

// 3. قراءة الجلسة
const { data: session } = await authClient.useSession();
```

---

## 6. تخصيص البيانات والحقول (Custom Fields & Additional Fields)

افتراضياً، يحتوي جدول `User` في Better-Auth على:
`id`, `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt`.

### ماذا لو أردت إضافة حقول مخصصة؟ (مثال: `role`, `phoneNumber`, `department`)

يتم ذلك بخطوتين أساسيتين متوافقتين دائماً:

#### الخطوة 1: تعريف الحقل في `src/lib/auth/auth.ts`
نستخدم خاصية `user.additionalFields`:

```typescript
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // يمكنك تحديد طول كلمة المرور هنا
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'PARTICIPANT',
        input: false, // input: false تمنع المستخدم من إرسال الدور بنفسه أثناء التسجيل (أمان عالي!)
        required: false,
      },
      phoneNumber: {
        type: 'string',
        required: false,
        input: true, // input: true تسمح للمستخدم بإرساله في الـ sign-up
      },
      department: {
        type: 'string',
        defaultValue: 'Engineering',
        required: false,
      }
    },
  },
});
```

#### الخطوة 2: إضافة نفس الحقول في `prisma/schema.prisma`
يجب أن تعكس قاعدة البيانات نفس الحقول المضافة في كائن `auth`:

```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  
  // الحقول المخصصة التي أضفناها:
  role          String    @default("PARTICIPANT")
  phoneNumber   String?
  department    String?   @default("Engineering")

  sessions      Session[]
  accounts      Account[]
  posts         Post[]
}
```

بعد تعديل الـ Schema، قم بتطبيق التعديل على قاعدة البيانات:
```bash
npx prisma migrate dev --name add_user_custom_fields
npx prisma generate
```

---

## 7. قاعدة البيانات (Prisma): الجداول، الحفظ، والجلب

### جداول Better-Auth الأربعة وفائدة كل منها:

```mermaid
erDiagram
    User ||--o{ Session : "has many"
    User ||--o{ Account : "has many"
    User ||--o{ Post : "authors many"

    User {
        String id PK
        String name
        String email UK
        Boolean emailVerified
        String role
        DateTime createdAt
    }

    Session {
        String id PK
        String token UK
        DateTime expiresAt
        String userId FK
        String ipAddress
        String userAgent
    }

    Account {
        String id PK
        String userId FK
        String providerId
        String password
    }

    Verification {
        String id PK
        String identifier
        String value
        DateTime expiresAt
    }

    Post {
        Int id PK
        String title
        String content
        String authorId FK
    }
```

1. **`User`**: يمثل هوية المستخدم الشخصية والملف الشخصي والحقول المخصصة.
2. **`Session`**: يسجل كل جلسة تسجيل دخول نشطة للمستخدم (التوكن وتاريخ الانتهاء وعنوان الـ IP).
3. **`Account`**: يفصل طريقة الدخول عن هوية المستخدم. كلمة المرور المشفرة تخزن هنا في حقل `password` إذا كان `providerId = "credential"`. إذا سجل المستخدم مستقبلاً عبر Google فسيُضاف له Account جديد لنفس الـ User!
4. **`Verification`**: لحفظ الأكواد المؤقتة مثل كود تفعيل البريد أو رابط إعادة تعيين كلمة المرور.

### كيف تربط جداول مشروعك (Business Entities) بـ User؟
تستخدم `authorId String` (ملاحظة: المعرف في Better-Auth هو `String` وليس `Int`):

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())

  // علاقة مع جدول User الخاص بـ Better-Auth
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  String
}
```

---

## 8. حماية الـ Endpoints في NestJS (@Session و @AllowAnonymous)

بفضل الحزمة `@thallesp/nestjs-better-auth`:
1. **جميع المسارات محمية تلقائياً**: أي Controller أو Endpoint تنشئه سيتطلب تسجيل الدخول افتراضياً؛ إذا استدعاه مستخدم غير مسجل سيعود له الخطأ `401 Unauthorized`.
2. **استثناء المسارات العامة**: نستخدم الديكوريتور `@AllowAnonymous()` لجعل المسار متاحاً للعامة دون تسجيل دخول.
3. **الدخول الاختياري**: نستخدم `@OptionalAuth()` إذا كان المسار متاحاً للكل ولكنك تريد معرفة المستخدم إن وجد.
4. **جلب بيانات المستخدم في الـ Controller**: نستخدم الديكوريتور `@Session()`.

---

## 9. مثال عملي متكامل (Feature Module)

لنفترض أننا نريد بناء ميزة إدارة المنشورات أو الموظفين وربطها بالمستخدم المسجل:

### 1. الـ Service: `src/module/posts/posts.service.ts`
نستخدم حقن التبعيات `PrismaService`:

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // إنشاء منشور وربطه برقم المستخدم المسجل
  async create(userId: string, data: { title: string; content?: string }) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: userId,
      },
    });
  }

  // جلب منشورات المستخدم الحالي فقط
  async findMyPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { authorId: userId },
      include: { author: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  // جلب كل المنشورات المنشورة (متاح للجميع)
  async findPublicPosts() {
    return this.prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { name: true } } },
    });
  }
}
```

### 2. الـ Controller: `src/module/posts/posts.controller.ts`
استخدام Decorators الحماية والجلسة:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AllowAnonymous, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1. مسار عام متاح للجميع دون تسجيل دخول
  @AllowAnonymous()
  @Get('public')
  async getPublic() {
    return this.postsService.findPublicPosts();
  }

  // 2. مسار محمي تلقائياً - يتطلب تسجيل الدخول ويأخذ الـ session مباشرة
  @Post()
  async create(
    @Session() session: UserSession,
    @Body() body: { title: string; content?: string },
  ) {
    // session.user يحتوي على id, email, name, role
    return this.postsService.create(session.user.id, body);
  }

  // 3. مسار محمي لجلب منشورات المستخدم صاحب الجلسة
  @Get('mine')
  async getMine(@Session() session: UserSession) {
    return this.postsService.findMyPosts(session.user.id);
  }
}
```

---

## 10. أهم الأوامر وخطوات العمل اليومية

### إضافة حقول جديدة أو جداول جديدة في قاعدة البيانات:
1. عدل `prisma/schema.prisma` (وإذا كان الحقل خاصاً بـ User، أضفه أيضاً في `auth.ts`).
2. قم بتوليد Migration وتطبيقه:
   ```bash
   npx prisma migrate dev --name describe_your_change
   ```
3. أعد إنشاء الـ Prisma Client لتحديث أنواع الـ TypeScript:
   ```bash
   npx prisma generate
   ```

### فحص قاعدة البيانات ومشاهدة السجلات في المتصفح:
يوفر Prisma واجهة رسومية ممتازة لتصفح الجداول والمستخدمين والبيانات المخزنة:
```bash
npx prisma studio
```
سيعمل على الرابط: `http://localhost:5555`.

### تشغيل خادم التطوير:
```bash
pnpm run start:dev
```

---

## ملخص سريع للإجابة على تساؤلاتك:

| السؤال | الإجابة باختصار |
|---|---|
| **هل أنا من يقوم بتخصيص وإنشاء مسارات المصادقة؟** | **لا**، مسارات `/api/auth/*` جاهزة تماماً وتعمل تلقائياً. |
| **كيف أعرف الـ endpoints الخاصة بي؟** | جميعها موجودة تحت المسار `/api/auth/{action}` مثل `/api/auth/sign-up/email` و `/api/auth/sign-in/email`. |
| **كيف أسجل بـ email و password؟** | بإرسال `POST` إلى `/api/auth/sign-up/email` ببيانات `{ email, password, name }`. |
| **كيف أخصص الحقول حسب تطبيقي؟** | عبر `additionalFields` في `auth.ts` ثم إضافة نفس الحقول في `schema.prisma`. |
| **كيف أحفظ وأجلب البيانات في قاعدة البيانات؟** | من خلال حقن `PrismaService` في خدمات NestJS واستخدام `session.user.id` لربط البيانات بالمستخدم الحالي. |

# Antigravity Response — Gemini Flash 3.8 High
Viewed SKILL.md:1-219
Viewed memory.md:1-46
Viewed auth.ts:1-28
Viewed auth.module.ts:1-11
Viewed main.ts:1-10
Viewed app.module.ts:1-55
Viewed schema.prisma:1-73
Viewed prisma.service.ts:1-13
Viewed app.controller.ts:1-18
Listed directory hr-platform
Created BETTER_AUTH_GUIDE.md
Ran command: `curl -s -i http://localhost:3000/api/auth/get-session`

Memory restored. Here is where we are:

**Last session:** تم تثبيت وإعداد `better-auth` مع حزمة `@thallesp/nestjs-better-auth 2.8.0`، وتكوين `src/lib/auth/auth.ts` و `auth.module.ts` مع `bodyParser: false` في `main.ts`، بالإضافة لإنشاء جداول Better-Auth الأربعة (`User`, `Session`, `Account`, `Verification`) في `prisma/schema.prisma` وتطبيق الـ migration وتوليد Prisma Client بنجاح.  
**Current state:** مسارات المصادقة تعمل بكفاءة على `/api/auth/*`، والحماية العامة `AuthGuard` نشطة في التطبيق بالكامل.  
**Decisions in place:** الاعتماد على `@thallesp/nestjs-better-auth`، جعل `User.id` من نوع `String`، واستخدام `role` كحقل إضافي افتراضي `PARTICIPANT` مع `input: false`.  
**Next up:** بناء وحدات الأعمال (Feature Modules) وربطها بالمستخدم وجلساته.

---

تم إنشاء ملف توثيقي شامل وتفصيلي جداً في المشروع: [docs/BETTER_AUTH_GUIDE.md](file:///home/youssef/projects/nest/hr-platform/docs/BETTER_AUTH_GUIDE.md).

وفيما يلي إجابة وافية ومفصلة على جميع تساؤلاتك:

---

### 1. كيف يعمل Better-Auth في مشروعك؟

- **Better-Auth** ليس مجرد مكتبة للتحقق من التوكن؛ بل هو **محرك مصادقة متكامل (Complete Auth Framework)** يدير الجلسات، التشفير، وقواعد البيانات.
- في مشروعنا قمنا بربطه بمكتبة `@thallesp/nestjs-better-auth`. عند تشغيل السيرفر، يقوم هذا الموديول بإنشاء **Route Handler** وسيط يلتقط أي طلب يبدأ بالبادئة:
  ```text
  http://localhost:3000/api/auth/*
  ```
- قمنا بضبط `bodyParser: false` في [src/main.ts](file:///home/youssef/projects/nest/hr-platform/src/main.ts) لأن Better-Auth يحتاج لقراءة الـ Raw Stream للطلبات بنفسه لإجراء التحقق من صحة البيانات (Validation)، الحماية من هجمات CSRF، وتشفير كلمات المرور.
- عند تسجيل الدخول أو التسجيل، يُنشئ Better-Auth جلسة مشفرة في جدول `Session`، ويُرسل لك في الرد كل من:
  1. كوكيز آمنة `HttpOnly Cookie` (للمتصفحات).
  2. توكن `Bearer Token` داخل جسم الـ JSON (لتطبيقات الموبايل أو Postman).

---

### 2. هل الـ Endpoints جاهزة أم تقوم أنت بإنشائها؟ وكيف تعرفها؟

> [!IMPORTANT]
> **جميع مسارات المصادقة جاهزة 100% وتعمل تلقائياً!**
> لست بحاجة لإنشاء Controller للمصادقة أو كتابة مسارات `@Post('sign-up')` أو `@Post('login')`.

محرك Better-Auth يوفر لك تلقائياً المسارات التالية تحت البادئة `/api/auth`:

| الطريقة (Method) | المسار (Endpoint) | الوظيفة |
|---|---|---|
| `POST` | `/api/auth/sign-up/email` | إنشاء حساب جديد بالبريد وكلمة المرور |
| `POST` | `/api/auth/sign-in/email` | تسجيل الدخول بالبريد وكلمة المرور |
| `POST` | `/api/auth/sign-out` | تسجيل الخروج وإبطال الجلسة وحذف الكوكيز |
| `GET`  | `/api/auth/get-session` | جلب بيانات المستخدم وجلسته الحالية |
| `POST` | `/api/auth/change-password` | تغيير كلمة المرور للمستخدم الحالي |
| `POST` | `/api/auth/forget-password` | طلب رابط/كود استعادة كلمة المرور |
| `POST` | `/api/auth/reset-password` | تعيين كلمة المرور الجديدة عبر الكود |
| `POST` | `/api/auth/update-user` | تعديل اسم المستخدم أو صورته الشخصية |

---

### 3. كيف تسجل حساباً بـ Email و Password وتخصص الحقول؟

#### أ) تسجيل مستخدم جديد (Sign Up):
يتم إرسال طلب `POST` إلى `http://localhost:3000/api/auth/sign-up/email`:

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Youssef Ahmed"
}
```

**الرد العائد:**
```json
{
  "token": "a1b2c3d4...session_token...",
  "user": {
    "id": "cm7...",
    "name": "Youssef Ahmed",
    "email": "user@example.com",
    "emailVerified": false,
    "role": "PARTICIPANT",
    "createdAt": "2026-09-22T08:00:00.000Z",
    "updatedAt": "2026-09-22T08:00:00.000Z"
  }
}
```

#### ب) تسجيل الدخول (Sign In):
طلب `POST` إلى `http://localhost:3000/api/auth/sign-in/email`:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

#### ج) تخصيص الحقول حسب احتياج تطبيقك (مثال: `role`, `phoneNumber`, `department`):
يتم التخصيص في مكانين:
1. في [src/lib/auth/auth.ts](file:///home/youssef/projects/nest/hr-platform/src/lib/auth/auth.ts) تحت خاصية `additionalFields`:
   ```typescript
   user: {
     additionalFields: {
       role: {
         type: 'string',
         defaultValue: 'PARTICIPANT',
         input: false, // input: false تمنع المستخدم من تزوير رتبته بنفسه أثناء التسجيل
       },
       phoneNumber: {
         type: 'string',
         required: false,
         input: true,  // input: true تسمح للمستخدم بإرساله في الـ sign-up
       },
     },
   }
   ```
2. في [prisma/schema.prisma](file:///home/youssef/projects/nest/hr-platform/prisma/schema.prisma) بإضافة نفس الحقول داخل `model User`:
   ```prisma
   model User {
     id          String   @id
     name        String
     email       String   @unique
     role        String   @default("PARTICIPANT")
     phoneNumber String?
     // ... بقية الحقول
   }
   ```
   ثم تطبيق الأمر: `npx prisma migrate dev` وتوليد العميل: `npx prisma generate`.

---

### 4. كيف تنشئ قاعدة البيانات وتحفظ أو تجلب البيانات؟

#### فهم جداول Better-Auth الأربعة في Prisma:
1. **`User`**: الهوية الأساسية للمستخدم (الاسم، البريد، الـ role، وأي حقول مخصصة).
2. **`Account`**: وسيلة الدخول (كلمة المرور المشفرة تخزن هنا تلقائياً، أو حسابات Google/GitHub مستقبلاً).
3. **`Session`**: تتبع الجلسات النشطة وتاريخ انتهائها والـ IP.
4. **`Verification`**: الأكواد المؤقتة (تأكيد الإيميل، استعادة كلمة المرور).

#### كيف تربط جداول مشروعك (مثل Posts أو Employees) بالمستخدم؟
تستخدم المفتاح الأجنبي `authorId String` مشيراً لـ `User.id`:
```prisma
model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String  // معرّف المستخدم في Better-Auth هو String
}
```

#### كيف تحفظ وتجلب البيانات داخل NestJS؟
بما أن حزمة Better-Auth تفعل حماية عامة على التطبيق، يمكنك مباشرة استخدام الديكوريتور `@Session()` في أي Controller، واستخدام [PrismaService](file:///home/youssef/projects/nest/hr-platform/src/lib/database/prisma.service.ts) لحفظ وجلب البيانات:

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';
import { Session, UserSession, AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../../lib/database/prisma.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. حفظ منشور جديد وربطه بالمستخدم الحالي
  @Post()
  async createPost(
    @Session() session: UserSession,
    @Body() body: { title: string; content?: string },
  ) {
    return this.prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id, // معرف المستخدم المسجل حالياً
      },
    });
  }

  // 2. جلب منشورات المستخدم المسجل فقط
  @Get('my-posts')
  async getMyPosts(@Session() session: UserSession) {
    return this.prisma.post.findMany({
      where: { authorId: session.user.id },
    });
  }

  // 3. مسار عام لا يتطلب تسجيل الدخول
  @AllowAnonymous()
  @Get('all-public')
  async getAllPublic() {
    return this.prisma.post.findMany({ where: { published: true } });
  }
}
```

---

يمكنك مراجعة الدليل الكامل المنسق والمدعم بالمخططات في:
📄 [docs/BETTER_AUTH_GUIDE.md](file:///home/youssef/projects/nest/hr-platform/docs/BETTER_AUTH_GUIDE.md)

هل تود البدء في بناء ميزة معينة (Feature Module) وربطها بنظام الصلاحيات (RBAC) وقاعدة البيانات الآن؟