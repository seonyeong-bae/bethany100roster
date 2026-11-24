# 멀티팀 로테이션 스케줄러

https://bethany100roster.kr 복구본 (배포된 사이트의 소스맵에서 원본 TypeScript 소스를 추출해 복원)

## 실행
```bash
npm install
npm start        # 개발 서버 (http://localhost:3000)
npm run build    # 배포용 build/ 생성
```

## 구조
- `src/App.tsx` — 상태 관리, 랜덤 배치, 엑셀 다운로드, localStorage 저장
- `src/components/Calendar.tsx` — 날짜 복수 선택 캘린더 (react-calendar)
- `src/components/RoleInput.tsx`, `NameInput.tsx` — 역할/이름 입력 (쉼표 구분)
- `src/components/RoleAssignment.tsx` — 멤버별 담당 역할 선택
- `src/components/UnavailableDates.tsx` — 멤버별 참여 불가 날짜
- `src/components/RotationTable.tsx` — 배정표 (셀마다 수동 수정 가능)
- `src/components/RandomAssignButton.tsx`, `ExcelDownloadButton.tsx`
- `src/styles/` — 테마, 글로벌 스타일

## 복원 시 변경점
- 사용되지 않던 `DateCheckboxList` import 제거 (배포 번들에 포함되지 않아 원본 없음)
- 중복되던 체크박스 옵션 컴포넌트를 `CheckboxOption.tsx`로 분리
- `RotationTable` 안의 쓰이지 않던 `handleRandomAssign` 제거 (App.tsx의 것이 실제 사용됨)
- `styled.d.ts` (테마 타입 선언) 새로 작성
- favicon / logo 이미지는 서버에도 없어서 복원 불가 — 필요하면 `public/`에 추가
