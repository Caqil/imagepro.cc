/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
 
  imageTools: {
    title: "이미지 도구",
    description: "이미지를 변환, 편집, 변형하기 위한 무료 온라인 도구",
    categories: {
      conversion: "형식 변환",
      editing: "이미지 편집",
      enhancement: "이미지 개선",
      optimization: "최적화",
      advanced: "고급 도구"
    },
    compressPng: {
      title: "PNG 압축",
      description: "품질을 유지하면서 PNG 파일 크기를 줄임",
      metaTitle: "PNG 이미지 압축 | 이미지 도구",
      metaDescription: "웹사이트 로딩 속도를 높이고 효율적인 저장을 위해 품질을 유지하면서 PNG 파일 크기를 줄임",
      metaKeywords: "PNG 압축, 이미지 크기 줄이기, 이미지 최적화, 이미지 압축, 무손실 압축, 파일 크기 감소"
    },
    makeTransparent: {
      title: "PNG 투명화",
      description: "PNG 파일 내의 임의의 색상을 투명으로 대체",
      metaTitle: "PNG 투명화 | 이미지 도구",
      metaDescription: "PNG 파일 내의 임의의 색상을 빠르게 투명으로 대체",
      metaKeywords: "배경 제거, 투명 PNG, 색상 대체, 이미지 편집, 배경 제거, 투명 이미지"
    },
    pngToJpg: {
      title: "PNG를 JPG로 변환",
      description: "사용자 정의 가능한 품질 설정으로 PNG 이미지를 JPG 형식으로 변환",
      metaTitle: "PNG를 JPG로 변환 | 이미지 도구",
      metaDescription: "조정 가능한 품질로 PNG 이미지를 JPG 형식으로 변환",
      metaKeywords: "PNG에서 JPG로, 이미지 변환, 이미지 형식, 손실 압축, 이미지 품질"
    },
    jpgToPng: {
      title: "JPG를 PNG로 변환",
      description: "투명도를 지원하여 JPG 이미지를 PNG 형식으로 변환",
      metaTitle: "JPG를 PNG로 변환 | 이미지 도구",
      metaDescription: "무손실 품질로 JPG 이미지를 PNG 형식으로 변환",
      metaKeywords: "JPG에서 PNG로, 이미지 변환, 투명도, 무손실 형식, 이미지 품질"
    },
    pngToWebp: {
      title: "PNG를 WebP로 변환",
      description: "웹 성능 향상을 위해 PNG 이미지를 WebP 형식으로 변환",
      metaTitle: "PNG를 WebP로 변환 | 이미지 도구",
      metaDescription: "파일 크기를 줄이기 위해 PNG 이미지를 WebP 형식으로 변환",
      metaKeywords: "PNG에서 WebP로, 이미지 변환, 웹 최적화, 이미지 압축"
    },
    webpToPng: {
      title: "WebP를 PNG로 변환",
      description: "호환성 향상을 위해 WebP 이미지를 PNG 형식으로 변환",
      metaTitle: "WebP를 PNG로 변환 | 이미지 도구",
      metaDescription: "완전한 호환성으로 WebP 이미지를 PNG 형식으로 변환",
      metaKeywords: "WebP에서 PNG로, 이미지 변환, 이미지 형식, 호환성"
    },
    svgToPng: {
      title: "SVG를 PNG로 변환",
      description: "벡터 SVG 파일을 래스터 PNG 이미지로 변환",
      metaTitle: "SVG를 PNG로 변환 | 이미지 도구",
      metaDescription: "사용자 정의 치수로 벡터 SVG 그래픽을 래스터 PNG 이미지로 변환",
      metaKeywords: "SVG에서 PNG로, 벡터에서 래스터로, 이미지 변환, 그래픽 디자인"
    },
    pngToBase64: {
      title: "PNG를 Base64로 변환",
      description: "웹 페이지에 삽입하기 위해 PNG 이미지를 Base64 인코딩으로 변환",
      metaTitle: "PNG를 Base64로 변환 | 이미지 도구",
      metaDescription: "웹 삽입용으로 PNG 이미지를 Base64 문자열로 변환",
      metaKeywords: "PNG에서 Base64로, 이미지 인코딩, 웹 개발, 이미지 삽입"
    },
    base64ToPng: {
      title: "Base64를 PNG로 변환",
      description: "Base64로 인코딩된 이미지 문자열을 PNG 파일로 재변환",
      metaTitle: "Base64를 PNG로 변환 | 이미지 도구",
      metaDescription: "Base64 이미지 문자열을 PNG 이미지 파일로 재변환",
      metaKeywords: "Base64에서 PNG로, 이미지 디코딩, 웹 개발, 이미지 변환"
    },
    changeColors: {
      title: "PNG 색상 변경",
      description: "PNG 이미지 내의 특정 색상을 새로운 색상으로 대체",
      metaTitle: "PNG 색상 변경 | 이미지 도구",
      metaDescription: "PNG 이미지 내의 특정 색상을 쉽게 새로운 색상으로 대체",
      metaKeywords: "이미지 색상 변경, 색상 대체, PNG 편집, 이미지 색상 변경기, 색상 교환"
    },
    changeTone: {
      title: "색조 변경",
      description: "예술적 효과를 위해 이미지에 색조와 톤을 적용",
      metaTitle: "PNG 색조 변경 | 이미지 도구",
      metaDescription: "예술적 효과를 위해 PNG 이미지에 색조와 톤을 적용",
      metaKeywords: "색조, 이미지 톤 조정, 예술적 효과, 색상 오버레이, 사진 필터"
    },
    addNoise: {
      title: "PNG에 노이즈 추가",
      description: "예술적 스타일을 위해 PNG 이미지에 필름 그레인 또는 노이즈 효과 추가",
      metaTitle: "PNG에 노이즈 추가 | 이미지 도구",
      metaDescription: "예술적 스타일을 위해 PNG 이미지에 필름 그레인 또는 노이즈 효과 추가",
      metaKeywords: "노이즈 추가, 필름 그레인, 이미지 텍스처, 예술적 필터, 빈티지 사진 효과"
    },
    resize: {
      title: "이미지 크기 조정",
      description: "품질을 유지하면서 이미지를 정확한 치수로 크기 조정",
      metaTitle: "이미지 크기 조정 | 이미지 도구",
      metaDescription: "품질을 유지하면서 이미지를 정확한 치수로 쉽게 크기 조정",
      metaKeywords: "이미지 크기 조정, 이미지 크기 변경, 이미지 스케일, 이미지 치수, 이미지 크기 조정"
    },
    rotate: {
      title: "회전 및 뒤집기",
      description: "올바른 방향을 위해 이미지를 회전 및 뒤집기",
      metaTitle: "이미지 회전 및 뒤집기 | 이미지 도구",
      metaDescription: "이미지를 원하는 각도로 쉽게 회전하고 수평 또는 수직으로 뒤집기",
      metaKeywords: "이미지 회전, 이미지 뒤집기, 이미지 방향, 이미지 돌리기, 수직 뒤집기"
    },
    crop: {
      title: "이미지 자르기",
      description: "불필요한 영역을 제거하고 중요한 콘텐츠에 초점을 맞추기 위해 이미지 자르기",
      metaTitle: "이미지 자르기 | 이미지 도구",
      metaDescription: "구성을 개선하기 위해 불필요한 영역을 제거하며 이미지 자르기",
      metaKeywords: "이미지 자르기, 이미지 트리밍, 배경 제거, 이미지 구성"
    },
    addText: {
      title: "이미지에 텍스트 추가",
      description: "사용자 정의 텍스트, 캡션 또는 워터마크를 이미지에 추가",
      metaTitle: "이미지에 텍스트 추가 | 이미지 도구",
      metaDescription: "간단한 서식 옵션으로 사용자 정의 텍스트, 캡션, 워터마크를 이미지에 추가",
      metaKeywords: "이미지에 텍스트 추가, 이미지 캡션, 워터마크, 텍스트 오버레이, 이미지 주석"
    },
    addBorder: {
      title: "테두리 추가",
      description: "다양한 스타일과 색상으로 사용자 정의 테두리를 이미지에 추가",
      metaTitle: "이미지에 테두리 추가 | 이미지 도구",
      metaDescription: "사용자 정의 테두리, 프레임, 효과로 이미지를 개선",
      metaKeywords: "이미지 테두리 추가, 포토 프레임, 이미지 프레이밍, 테두리 스타일, 이미지 개선"
    },
    addWatermark: {
      title: "워터마크 추가",
      description: "사진을 보호하기 위해 텍스트 또는 이미지 워터마크 추가",
      metaTitle: "이미지에 워터마크 추가 | 이미지 도구",
      metaDescription: "이미지를 보호하고 브랜드화하기 위해 텍스트 또는 이미지 워터마크 추가",
      metaKeywords: "워터마크 추가, 이미지 보호, 브랜딩, 저작권, 이미지 보안"
    }
  }
}