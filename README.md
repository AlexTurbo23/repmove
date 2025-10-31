## 🚀 Обзор

Автоматизация UI-тестов на Playwright + TypeScript по паттерну Page Object Model (POM). Репозиторий готов для локальных прогонов и интеграции в CI.

Ключевые возможности:

- UI-тесты (репорты HTML из коробки)
- Конфигурация окружений через переменные среды
- Параметризация и переиспользуемые Page Object-ы

## 🧰 Технологии

- Язык: TypeScript
- Тест-раннер: Playwright
- Паттерн: Page Object Model (POM)
- Отчёты: Playwright HTML Reporter
- CI: готовность к GitHub Actions / Jenkins

## ✅ Требования

- Node.js 18+ (проверьте: `node -v`)
- Интернет для установки браузеров Playwright

## ⚙️ Установка (Windows PowerShell)

1. Установить зависимости (используется `package-lock.json`):

```powershell
npm ci
```

2. Установить браузеры Playwright (один раз на машину):

```powershell
npx playwright install
```

## 🔧 Конфигурация окружения

- Базовый URL задаётся переменной `BASE_URL` (по умолчанию берётся из `playwright.config.ts`):
  - По умолчанию: `http://dev-repmove-enterprise.web.app/`
- Переопределить на время текущей PowerShell-сессии:

```powershell
$env:BASE_URL = "https://your-env.example.com/"
```

- Тестовые учётные данные — файл `utils/credentials.ts`:

```typescript
// utils/credentials.ts
const credentials = {
  email: 'user@example.com',
  password: 'Str0ngP@ssword',
  emailEmpty: '',
  passwordEmpty: '',
  invalidEmail: 'user@example.',
};
export default credentials;
```

## 🗂️ Структура проекта

- `pages/` — Page Object-ы (`AuthPage`, `RegistrationPage`)
- `tests/` — тесты (`auth.spec.ts`, `reg.spec.ts`)
- `utils/` — хелперы и данные (`credentials.ts`)
- `playwright.config.ts` — глобальная конфигурация тестов
- `playwright-report/` — HTML-отчёты (генерируются автоматически)
- `test-results/` — артефакты прогона (трейсы, скриншоты и т. п.)

## ▶️ Запуск тестов

Запуск всех тестов:

```powershell
npx playwright test
```

Или через npm-скрипты:

```powershell
npm run test        # все тесты
npm run test:ui     # UI-режим (удобно для локальной отладки)
npm run test:headed # видимый браузер
npm run report      # открыть последний HTML-отчёт
```

Точечные запуски:

```powershell
# Один файл
npx playwright test .\tests\auth.spec.ts

# По названию теста/сьюта
npx playwright test -g "User successfully logged in"
```

## 🧱 Примеры

`tests/auth.spec.ts` (фрагмент):

```typescript
test('User successfully logged in; redirected to main page.', async ({ page }) => {
  const auth = new AuthPage(page);
  await auth.open('/');
  await auth.login(credentials.email, credentials.password);
  await auth.verifyLogoutBtn();
});
```

## 🔍 Отладка и отчёты

- Включить трейс на каждый первый ретрай (уже настроено в конфиге): `trace: 'on-first-retry'`.
- Открыть HTML-отчёт после прогона:

```powershell
npm run report
```

Полезно знать:

- Отчёты: `playwright-report/`
- Артефакты и трейсы: `test-results/`

## 🧩 Полезные скрипты

В `package.json` доступны:

- `test` — запуск тестов
- `test:ui` — UI-режим
- `test:headed` — видимый браузер
- `report` — открыть последний отчёт
- `codegen` — генератор шагов (интерактивный рекордер)

## ❗️ Troubleshooting

- “Browser not found” — выполните `npx playwright install`.
- Переменные окружения не применяются — задайте через `$env:BASE_URL = "..."` (в текущей сессии) или используйте значения по умолчанию из `playwright.config.ts`.
- Таймауты — проверьте доступность `BASE_URL` и сеть; при необходимости увеличьте таймауты в конфиге.
- Флаки — используйте ретраи (в CI уже включены) и ожидайте видимость элементов (`waitFor`, `expect(...).toBeVisible`).

---
