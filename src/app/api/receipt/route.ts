import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-OpenRouter-Title': 'My AI App',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.5-flash',
        messages: [
          {
            role: 'system',
            content: `당신은 영수증 분석 전문가입니다. 이미지에서 영수증 정보를 추출하고, 각 항목의 카테고리를 분류하여 JSON 형식으로 반환하세요.

중요 규칙:
1. 할인 쿠폰, 포인트 사용, 멤버십 할인 등은 별도 항목으로 분리하지 말고, 해당 상품명에 괄호로 통합하세요.
   예: "올리브영 쇼핑백100 (10%할인쿠폰 -100원)" 또는 "닥터원더 발 각질제거 (쇼핑백100 10%할인 -790원)"
2. 상품명은 원본 영수증에 적힌 그대로 정확히 표기하세요.
3. "쇼핑백"은 올리브영 멤버십 프로그램명입니다. "쇼이백"이나 "쇼잉백"으로 잘못 표기하지 마세요.
4. 각 항목의 카테고리를 다음 기준에 따라 분류하세요:
   - restaurant: 식당, 음식점, 김밥, 국밥, 치킨, 피자, 떡볶이, 마라탕, 짬뽕, 탕수육, 불고기, 삼겹살, 파스타, 스테이크, 회, 초밥, 카레, 우동, 덮밥, 칼국수, 비빔밥, 정식, 백반 등 (요리된 음식을 제공하는 곳)
   - convenience: 편의점, GS25, CU, 세븐일레븐, 이마트24, 미니ストップ, PB, 도시락, 삼각김밥, 컵라면, 과자, 음료수, 생수, 우유, 계란, 햄, 소시지 등 (편의점에서 파는 가공식품/즉석식품)
   - cafe: 카페, 커피, 스타벅스, 투썸, 이디야, 베이커리, 음료 등
   - beauty: 올리브영, 화장품, 뷰티, 스킨케어, 마스크팩, 립, 파운데이션 등
   - transport: 지하철, 버스, 택시, 카카오T, 주유소, 주차 등
   - otaku: 굿즈, 캐릭터, 피규어, 포카, 앨범, 위츄, NCT, 포켓몬, 아크릴 스탠드 등
   - shopping: 쿠팡, 네이버쇼핑, 의류, 신발, 가방, 전자제품, 다이소 등
   - health: 헬스장, 운동, 약국, 병원, 치과, 안과, 건강보조제, 보약, 한약 등
   - leisure: 영화, CGV, 롯데시네마, 노래방, 게임, 놀이공원, 테마파크, 볼링, 당구, PC방, 콘서트, 공연, 전시, 뮤지컬 등
   - gift: 선물, 꽃배달, 생일, 기념일, 졸업식, 입학식, 어버이날, 스승의날, 발렌타인, 화이트데이, 추석, 설날, 기프티콘 등
   - travel: 항공, 비행기, 호텔, 숙박, 에어비앤비, 여행, 패키지, 해외, 국내여행, 게스트하우스, 리조트 등
   - etc: 위 카테고리에 해당하지 않는 것
5. 응답은 반드시 JSON 형식이어야 합니다:
   {
     "items": [
       {"name": "상품명 (할인정보)", "amount": 숫자, "category": "카테고리"},
       ...
     ],
     "total": 총금액,
     "store": "가게이름",
     "date": "날짜"
   }
6. 금액은 숫자로만 작성하세요.
7. 할인 쿠폰 항목은 절대 별도로 추가하지 마세요. 반드시 해당 상품에 통합하세요.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '이 영수증 이미지에서 정보를 추출해주세요.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter API error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze receipt' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // JSON 파싱 시도
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // JSON 파싱 실패 시 원본 텍스트 반환
    }
    
    return NextResponse.json({ raw: content });
  } catch (error) {
    console.error('Receipt API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}