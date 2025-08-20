# 🎨 Design System Documentation

이 프로젝트의 디자인 시스템은 일관된 사용자 경험과 효율적인 개발을 위해 구축되었습니다.

## 📁 구조

```
src/
├── index.css              # 전역 CSS 변수 및 스타일
├── shared/components/ui/   # UI 컴포넌트 라이브러리
│   ├── Button.tsx         # 버튼 컴포넌트
│   ├── Input.tsx          # 입력 컴포넌트
│   └── index.ts           # 컴포넌트 export
└── shared/components/demo/ # 디자인 시스템 데모
```

## 🎯 핵심 컴포넌트

### Button 컴포넌트

```tsx
import { Button } from '@/shared/components/ui';

// 기본 사용법
<Button variant="primary" size="md">
  클릭하세요
</Button>

// 로딩 상태
<Button variant="primary" loading={isLoading}>
  저장하기
</Button>

// 전체 너비
<Button variant="success" fullWidth>
  전체 너비 버튼
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean

### Input 컴포넌트

```tsx
import { Input, Textarea } from '@/shared/components/ui';

// 기본 입력
<Input
  label="이름"
  placeholder="이름을 입력하세요"
  value={name}
  onChange={(e) => setName(e.target.value)}
  fullWidth
/>

// 에러 상태
<Input
  label="이메일"
  type="email"
  error="올바른 이메일을 입력하세요"
  fullWidth
/>

// 텍스트 에어리어
<Textarea
  label="메모"
  rows={4}
  placeholder="메모를 입력하세요..."
  fullWidth
/>
```

**Props:**
- `variant`: 'default' | 'filled' | 'bordered'
- `size`: 'sm' | 'md' | 'lg'
- `label`: string
- `error`: string
- `helpText`: string
- `fullWidth`: boolean

## 🎨 색상 시스템

### CSS 변수 사용

```css
/* Primary Colors */
var(--primary-50)   /* 가장 밝은 */
var(--primary-500)  /* 기본값 */
var(--primary-900)  /* 가장 어두운 */

/* Semantic Colors */
var(--success-500)  /* 성공 */
var(--warning-500)  /* 경고 */
var(--danger-500)   /* 위험 */

/* Gray Scale */
var(--gray-50)      /* 배경색 */
var(--gray-500)     /* 텍스트 */
var(--gray-900)     /* 진한 텍스트 */
```

### 유틸리티 클래스

```html
<!-- 텍스트 색상 -->
<p class="text-primary">Primary 텍스트</p>
<p class="text-success">Success 텍스트</p>
<p class="text-danger">Error 텍스트</p>

<!-- 배경색 -->
<div class="bg-primary">Primary 배경</div>
<div class="bg-gray">Gray 배경</div>

<!-- 그림자 -->
<div class="shadow-sm">작은 그림자</div>
<div class="shadow-lg">큰 그림자</div>

<!-- 간격 -->
<div class="m-4">마진</div>
<div class="p-6">패딩</div>
<div class="gap-3">간격</div>
```

## 🎪 Modal 시스템

```tsx
// 통일된 모달 구조
<div className="modal-overlay" onClick={onClose}>
  <div className="modal-content animate-slide-in-up">
    <div className="modal-header">
      <h2 className="modal-title">제목</h2>
      <p className="modal-description">설명</p>
    </div>
    <div className="modal-body">
      {/* 모달 내용 */}
    </div>
    <div className="modal-footer">
      <Button variant="ghost" onClick={onClose}>취소</Button>
      <Button variant="primary" onClick={onSave}>저장</Button>
    </div>
  </div>
</div>
```

## 📱 반응형 디자인

모든 컴포넌트는 모바일 우선(Mobile First) 방식으로 설계되었으며, 자동으로 다양한 화면 크기에 대응합니다.

```css
/* 모바일: 기본값 */
.component { padding: 1rem; }

/* 태블릿: 768px 이상 */
@media (min-width: 768px) {
  .component { padding: 1.5rem; }
}

/* 데스크톱: 1200px 이상 */
@media (min-width: 1200px) {
  .component { padding: 2rem; }
}
```

## 🌙 다크 모드 지원

CSS 변수를 사용하여 다크 모드를 자동으로 지원합니다:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #1f2937;
    --gray-900: #f9fafb;
    /* 색상이 자동 반전됩니다 */
  }
}
```

## 🚀 사용법

### 1. 컴포넌트 import

```tsx
import { Button, Input, Textarea } from '@/shared/components/ui';
```

### 2. CSS 변수 사용

```tsx
// 인라인 스타일에서 CSS 변수 사용
<div style={{ color: 'var(--primary-600)' }}>
  Primary 색상 텍스트
</div>
```

### 3. 유틸리티 클래스 활용

```tsx
// 클래스명으로 빠른 스타일링
<div className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg">
  카드 컴포넌트
</div>
```

## 📦 확장 방법

새로운 컴포넌트를 추가할 때:

1. `src/shared/components/ui/` 에 컴포넌트 파일 생성
2. CSS 변수와 유틸리티 클래스 활용
3. `index.ts`에서 export
4. 타입 정의 추가

## 🎯 베스트 프랙티스

- ✅ CSS 변수 사용으로 일관된 색상 적용
- ✅ 컴포넌트 재사용으로 코드 중복 방지
- ✅ 유틸리티 클래스로 빠른 스타일링
- ✅ TypeScript로 타입 안정성 확보
- ✅ 접근성 고려 (focus, aria 속성)

---

**💡 Tip:** 디자인 시스템 데모는 `/demo/design-system` 경로에서 확인할 수 있습니다.